var path = require("path");
var fs = require("fs");

var defaults = {
  input: path.resolve("app/javascript", "sprites"),
  output: path.resolve("app/javascript", "images", "sprites"),
  svgOutput: path.resolve("app/javascript", "images", "sprites"),
  cssout: path.resolve("app/javascript", "stylesheets", "sprites"),
  ext: ["*.png", "*.gif"],
  css: true,
  scss: true,
  imageUrl: true,
  rootPath: "images/sprites",
  pngFolder: "pngs",
  svgFolder: "svgs",
  svgOutput: path.resolve("app/assets/images")
};

const config_path = path.resolve("./package.json");
const pData = JSON.parse(fs.readFileSync(config_path, "utf8"));

let data = Object.prototype.hasOwnProperty.call(pData, "sprites")
  ? { ...defaults, ...pData.sprites }
  : defaults;

module.exports = data;
