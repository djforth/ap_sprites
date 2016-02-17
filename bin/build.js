#! /usr/bin/env node

var _            = require('lodash')
  , config       = require("../plugin/config")
  , fs           = require('fs')
  , read         = require('@djforth/ap_utils').read
  , path         = require('path')
  , program      = require('commander')
  , buildSprites = require("../plugin/build_sprites")
  , storeFiles   = require("../plugin/store");

 program
  .version('0.0.1')
  .option('-e, --ext <list>', 'exts to process', [])
  .option('-i, --input <folder>', 'input folder')
  .option('-o, --output <folder>', 'output folder')
  .option('-co, --cssout <folder>', 'css output folder')
  .option('-c, --css', 'build css')
  .option('-s, --scss', 'build scss')
  .parse(process.argv);

var manageFiles = storeFiles();
var options = ["ext", "input", "output", "cssout", "css", "scss"]

options.forEach(function(op){
  console.log(program[op])
  if(!_.isEmpty(program[op]) || program[op]){
    config.set(op, program[op])
  }
});
// console.log(program.ext)

// Gets all sprite files
var stream = read(config.get("input"), config.get("ext") )
  .on("end", function(d){ buildSprites(manageFiles)})
  .pipe(es.mapSync(function (entry) {
    var ext = path.extname(entry.path);
    if(entry.path.match(/(.DS_Store$)/)){
      return null
    }
    return { path: entry.fullPath, dir: entry.parentDir };
  }))
  .pipe(es.map(function(d){
    // console.log(d)
    if(!_.isNull(d)) manageFiles(d);
  }))