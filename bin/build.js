#! /usr/bin/env node

const _ = require('lodash');
const config = require('../plugin/config');
const es = require('event-stream');
const {read} = require('@djforth/ap_utils');
const path = require('path');
const program = require('commander');
const buildSvgSprites = require('../plugin/build_svgs');
const buildInlineSvgSprites = require('../plugin/build_inline_svg');
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
  .option('-vi, --svginline', 'build inline svg sprites')
  .parse(process.argv);

var manageFiles = storeFiles();
var options = ['ext', 'input', 'output', 'cssout', 'css', 'scss'];

options.forEach((op)=>{
  if (!_.isEmpty(program[op]) || program[op]){
    config.set(op, program[op]);
  }
});

const getType = (program)=>{
  return ['svg', 'svginline'].reduce((val, key)=>{
    if (_.has(program, key) && program[key]) return key;
    return val;
  }, 'png');
};

const setRead = (config, type)=>{
  let input = config.get('input');
  switch (type){
    case 'svg':
      return {
        build: buildSvgSprites
        , ext: '*.svg'
        , input: path.resolve(input, config.get('svgFolder'))
      };
    case 'svginline':
      return {
        build: buildInlineSvgSprites
        , ext: '*.svg'
        , input: path.resolve(input, config.get('svgInlineFolder'))
      };
    default:
      return {
        build: buildSprites
        , ext: config.get('ext')
        , input: path.resolve(input, config.get('pngFolder'))
      };
  }
};


const {build, ext, input} = setRead(config, getType(program));
console.log(getType(program), input, ext)
// Gets all sprite files
read(input, ext)
  .on('end', (d)=>{
    build(manageFiles);
    // if (program.svg){
    //   buildSvgSprites(manageFiles);
    // } else if (program.inlinesvg){
    //   buildInlineSvgSprites(manageFiles);
    // } else {
    //   buildSprites(manageFiles);
    // }
  })
  .pipe(es.mapSync(function(entry){
    if (entry.path.match(/(.DS_Store$)/)){
      return null;
    }
    return {path: entry.fullPath, dir: entry.parentDir};
  }))
  .pipe(es.map(function(d){
    if (!_.isNull(d)) manageFiles(d);
  }));
