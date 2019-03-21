#! /usr/bin/env node

const _ = require("lodash");
const config = require("../plugin/config");
const es = require("event-stream");
const path = require("path");
const program = require("commander");
const buildSvgSprites = require("../plugin/build_svg");
const buildSprites = require("../plugin/build_sprites");
const storeFiles = require("../plugin/store");
const read = require("../plugin/read");

program
  .version("5.0.0")
  .option("-c, --css", "build css")
  .option("-s, --scss", "build scss")
  // .option('-v, --svg', 'build svg sprites')
  .option("-vi, --svg", "build svg sprites")
  .parse(process.argv);

var manageFiles = storeFiles();
var options = ["ext", "input", "output", "cssout", "css", "scss"];

const setRead = (config, svg) => {
  let input = config.input;
  if (svg) {
    return {
      build: buildSvgSprites,
      ext: "*.svg",
      input: path.resolve(input, config.svgFolder)
    };
  }

  return {
    build: buildSprites,
    ext: config.ext,
    input: path.resolve(input, config.pngFolder)
  };
};

const { build, ext, input } = setRead(config, program.svg);
// Gets all sprite files
read(input, ext)
  .on("end", d => {
    build(manageFiles);
  })
  .pipe(
    es.mapSync(function(entry) {
      if (entry.path.match(/(.DS_Store$)/)) {
        return null;
      }
      return { path: entry.fullPath, dir: entry.parentDir };
    })
  )
  .pipe(
    es.map(function(d) {
      if (!_.isNull(d)) manageFiles(d);
    })
  );
