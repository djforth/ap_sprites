var _ = require('lodash');
const SVGSpriter = require('svg-sprite');
const path = require('path');
const {create, read} = require('@djforth/ap_utils');
const mkdirp = require('mkdirp');
const fs = require('fs');
var config = require('./config');

const buildConfig = (output)=>{
  return {
    dest: config.get('output')
    , log: 'info'
    , mode: {
      css: {
        dest: config.get('cssout')
        , sprite: path.join(config.get('output'), output)
        , bust: false
        , mixin: output
        , render: {
          scss:  {
            template: path.join(__dirname, 'tmpl/sprite.scss')
            , dest: path.resolve(config.get('cssout'), `_${output}`)
          }
        }
      }
    }
    // , variables: {
    //   hasMixin: true
    //   , mixinName: 'svg-mixin'
    // }
  };
};

const compileSprites = (spriter)=>{
  // Compile the sprite
  spriter.compile(function(error, result, cssData) {
      // Run through all configured output modes
      for (var mode in result) {
          // Run through all created resources and write them to disk
          for (var type in result[mode]) {
              mkdirp.sync(path.dirname(result[mode][type].path));
              fs.writeFileSync(result[mode][type].path, result[mode][type].contents);
          }
      }
  });
};

module.exports = (manageFiles)=>{
  var sprites = manageFiles();
  _.forIn(sprites, function(files, output){
    let spriter  = new SVGSpriter(buildConfig(output));
    console.log(files);
    files.forEach((file)=>{
      spriter.add(file, path.basename(file), fs.readFileSync(file, {encoding: 'utf-8'}));
    });
    compileSprites(spriter);
  });
};
