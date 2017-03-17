#! /usr/bin/env node

const _ = require('lodash')
const config = require('../plugin/config')
const es = require('event-stream')
const fs = require('fs')
const {read} = require('@djforth/ap_utils');
const path = require('path')
const program = require('commander')
const buildSvgSprites = require('../plugin/build_svgs');
const buildSprites = require('../plugin/build_sprites');
const storeFiles = require('../plugin/store');

program
  .version('1.0.0')
  .option('-e, --ext <list>', 'exts to process')
  .option('-i, --input <folder>', 'input folder')
  .option('-o, --output <folder>', 'output folder')
  .option('-co, --cssout <folder>', 'css output folder')
  .option('-c, --css', 'build css')
  .option('-s, --scss', 'build scss')
  .option('-v, --svg', 'build svg sprites')
  .parse(process.argv);

var manageFiles = storeFiles();
var options = ['ext', 'input', 'output', 'cssout', 'css', 'scss'];

options.forEach((op)=>{
  if (!_.isEmpty(program[op]) || program[op]){
    config.set(op, program[op]);
  }
});
// console.log(program.ext)
let ext = (program.svg) ? '*.svg' : config.get('ext');
console.log(ext, program.svg);
let folder = (program.svg) ? 'svgs' : 'pngs';
let input = path.resolve(config.get('input'), folder);
// Gets all sprite files
read(input, ext)
  .on('end', (d)=>{
    if (program.svg){
      buildSvgSprites(manageFiles);
    } else {
      buildSprites(manageFiles);
    }
  })
  .pipe(es.mapSync(function(entry){
    var ext = path.extname(entry.path);
    if (entry.path.match(/(.DS_Store$)/)){
      return null;
    }
    return {path: entry.fullPath, dir: entry.parentDir};
  }))
  .pipe(es.map(function(d){
    // console.log(d)
    if (!_.isNull(d)) manageFiles(d);
  }));
