'use strict';

const {create} = require('@djforth/ap_utils');
const extname = require('path-complete-extname');
const path = require('path');
const _ = require('lodash');
const fs = require('fs');
const svgstore = require('svgstore');
const config = require('./config');
// const SVGO = require('svgo');
// const svgo = new SVGO({
//   cleanupIDs: true
//   , convertStyleToAttrs: true
//   , removeStyleElement: true
// });

module.exports = (manageFiles)=>{
  console.log('inline');
  var folders = manageFiles();
  _.forIn(folders, (files, output)=>{
    var store = svgstore({
      cleanDefs: true
      , cleanObjects: true
    });
    files.forEach((file)=>{
      let name = path.basename(file, extname(file));
      let svg = fs.readFileSync(file, 'utf8');
      store = store.add(name, svg);
    });
    let svgName = path.resolve(config.get('svgInlineOutput'), output + '.svg');
    create.file(svgName, store);
    // svgo.optimize(store).then(function(svgSprite){
    //   console.log(svgSprite)
    //   create.file(svgName, svgSprite);
    // });
  });
};
