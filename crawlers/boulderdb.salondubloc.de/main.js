const inquirer = require("inquirer");
const fs = require("fs");
const getBoulderDBData = require("./getBoulderDBData");
const parseData = require("./parseData");
const uploadToGraphcool = require("./uploadToGraphcool");

const cache = fs.existsSync(".cache/credentials.json")
  ? JSON.parse(fs.readFileSync(".cache/credentials.json"))
  : {};

inquirer
  .prompt([
    {
      type: "input",
      name: "username",
      message: "Your username on boulderdb.salondubloc.de",
      default: cache.username
    },
    {
      type: "password",
      name: "password",
      message: "Your password on boulderdb.salondubloc.de",
      default: cache.password
    },
    {
      type: "list",
      name: "action",
      message: "What do you want?",
      choices: [
        {
          value: "json",
          name: "Create a json of actual boulderdb base (./boulderdb.json)"
        },
        {
          value: "upload",
          name: "Upload data on graph.cool project"
        }
      ]
    },
    {
      when: answers => answers.action === "upload",
      type: "input",
      name: "graphcoolEndpoint",
      message: "Graph.cool simple API endpoint?",
      default: cache.graphcoolEndpoint
    },
    {
      when: answers => answers.action === "upload",
      type: "input",
      name: "graphcoolToken",
      message: "Graph.cool token?",
      default: cache.graphcoolToken
    }
  ])
  .then(async ({
    username,
    password,
    action,
    graphcoolEndpoint,
    graphcoolToken
  }) => {
    const rawData = await getBoulderDBData(username, password);
    const data = parseData(rawData);

    // Add some cache to avoid copy/past token on each exec :)
    if (!fs.existsSync(".cache")) fs.mkdirSync(".cache");
    fs.writeFileSync(
      ".cache/credentials.json",
      JSON.stringify(
        { username, password, graphcoolEndpoint, graphcoolToken },
        null,
        2
      )
    );

    if (action === "json") {
      fs.writeFileSync("./boulderDB.json", JSON.stringify(data, null, 2));
      console.log("boulderDB.json was created!");
    } else if (action === "upload") {
      const { routesCreated, wallsCreated } = await uploadToGraphcool(
        data,
        graphcoolEndpoint,
        graphcoolToken
      );
      console.log(`${wallsCreated.length} walls has been created!`);
      console.log(`${routesCreated.length} routes has been created!`);
    }
  })
  .catch(err => console.error(err));
