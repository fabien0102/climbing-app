const cheerio = require("cheerio");
const _ = require("lodash");

module.exports = file => {
  const $ = cheerio.load(file);

  const colors = {
    weiß: "white",
    pink: "pink",
    blau: "blue",
    schwarz: "black",
    gelb: "yellow",
    lila: "purple",
    orange: "orange",
    grün: "green",
    natursteine: "rock",
    "nur Volumen": "volume",
    Holz: "wood",
    rot: "red",
    "gelb neon": "yellow"
  };

  return _.map($("#boulders>tbody>tr"), row => ({
    grade: parseInt(_.get(row, "children.3.children.0.attribs.alt")) + 2,
    name: _.get(row, "children.15.children.0.children.0.data", "unknown"),
    color: colors[_.get(row, "children.17.children.1.data").trim()] ||
      _.get(row, "children.17.children.1.data").trim() ||
      "unknow",
    openedAt: _.get(row, "children.29.children.0.data")
  }));
};
