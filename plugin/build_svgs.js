var _ = require('lodash');
const SVGSpriter = require('svg-sprite');
const path = require('path');
// const {create, read} = require('@djforth/ap_utils');
const mkdirp = require('mkdirp');
const fs = require('fs');
var config = require('./config');

const scssOutput = (output)=>{
  if (output.match(/\//)){
    return output.replace(/\/([^/]*)$/, '/_$1');
  }
  return  `_${output}`;
};

const folderExtent = (output)=>{
  if (output.match(/\//)){
    let split = output.split('/');
    split.pop();
    return split.join('-') + '-';
  }
  return  '';
};

const buildConfig = (output)=>{
  let scss_output = scssOutput(output);
  let folder_extent = folderExtent(output);
  console.log('folder_extent', folder_extent);
  return {
    dest: config.get('output')
    , log: 'info'
    , shape: {
      // dimension: {
      //   precision: 5
      // },
      spacing: {
        padding: 10
        , box: 'padding'
      }
    }
    , mode: {
      css: {
        dest: config.get('cssout')
        , sprite: path.join(config.get('output'), output)
        , bust: false
        , layout: 'vertical'
        , mixin: output.replace(/(\/)/igm, '_')
        , render: {
          scss: {
            template: path.join(__dirname, 'tmpl/sprite.scss')
            , dest: path.resolve(config.get('cssout'), scss_output)
            // , mixin: output.replace(/(\/)/igm, '_')
          }
        }
      }
    }
    , variables: {
      mixin_sanitised: output.replace(/(\/)/igm, '_')
      , folder_extent
    }
  };
};

const compileSprites = (spriter)=>{
  // Compile the sprite
  spriter.compile(function(error, result, cssData) {
    // Run through all configured output modes
    for (var mode in result){
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
    console.log('output', output)
    let spriter  = new SVGSpriter(buildConfig(output));
    files.forEach((file)=>{
      spriter.add(file, path.basename(file), fs.readFileSync(file, {encoding: 'utf-8'}));
    });
    compileSprites(spriter);
  });
};
