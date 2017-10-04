'use latest';

const _ = require('lodash');
const moment = require('moment');
const Lokka = require('lokka').Lokka;
const Transport = require('lokka-transport-http').Transport;

const headers = {
  Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1MDUzOTEzODMsImNsaWVudElkIjoiY2ozYThyeWp6ZDFxZzAxMzAxc2tiN3JoOCIsInByb2plY3RJZCI6ImNqN2J2d2Z0ajIxb3owMTAzc3YyaHJzbWciLCJwZXJtYW5lbnRBdXRoVG9rZW5JZCI6ImNqN2tmNXR2djB3OGswMTk1eWllY29vamkifQ.FbPomoVe66AKvhipsW9zUah5chbvlxBjbdMZx3b1mck'
};

const client = new Lokka({
  transport: new Transport(
    'https://api.graph.cool/simple/v1/cj7bvwftj21oz0103sv2hrsmg',
    { headers }
  )
});

const getStats = tries => {
  const triesBeforeSuccessByUser = _(tries).groupBy('user.id').map(i => {
    const successfulTries = i
      .sort((a, b) => (moment(a).isBefore(b) ? 1 : -1))
      .find(j => j.successLevel === 5);

    const firstSuccess = _.get(successfulTries, 'createdAt', null);

    return firstSuccess
      ? i.filter(a => moment(a.createdAt).isBefore(firstSuccess)).length + 1
      : 0;
  });

  const successUsers = triesBeforeSuccessByUser.filter(a => a > 0);
  const averageTries = successUsers.sum() / successUsers.size();
  const successRate = _.round(
    successUsers.size() / triesBeforeSuccessByUser.size(),
    2
  );

  return { averageTries, successRate };
};

module.exports = function(event) {
  const { tries, id } = event.data.Try.node.route;
  const stats = getStats(tries);

  console.log(
    `
  routeID: ${id}
    - successRate: ${stats.successRate}
    - averageSuccess: ${stats.averageTries}
  `
  );
  
  return client.mutate(
    `
    ($id: ID!, $successRate: Float!, $averageTries: Float!){
      updateRoute(id: $id, successRate: $successRate, averageTries: $averageTries) {
        id
      }
    }
  `,
    Object.assign({id}, stats)
  );
};
