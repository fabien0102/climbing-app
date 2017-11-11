const request = require("request");
const jar = request.jar();

const getCookieOptions = (username, password) => ({
  method: "POST",
  url: "http://boulderdb.salondubloc.de/sessions",
  headers: {
    "content-type": "multipart/form-data; boundary=---011000010111000001101001"
  },
  formData: { username, password },
  jar: "JAR"
});

const getCookie = (username, password) =>
  new Promise((resolve, reject) =>
    request(getCookieOptions(username, password), (err, res, body) => {
      if (err) return reject(new Error(err));
      if (!res.headers["set-cookie"])
        return reject(new Error("Wrong user/password"));

      resolve(res.headers["set-cookie"][0]);
    })
  );

const getBouldersOptions = cookie => ({
  method: "GET",
  url: "http://boulderdb.salondubloc.de/boulders",
  headers: {
    cookie
  },
  jar: "JAR"
});

const getBoulders = cookie =>
  new Promise((resolve, reject) =>
    request(getBouldersOptions(cookie), (err, res, body) => {
      if (err) reject(new Error(err));
      resolve(body);
    })
  );

module.exports = async (username, password) => {
  const cookie = await getCookie(username, password);
  return await getBoulders(cookie);
};
