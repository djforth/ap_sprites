var utils  = require('@djforth/ap_utils').config;
var path   = require('path');

var defaults = {
  input: path.resolve('app/javascript', 'sprites')
  , output: path.resolve('app/javascript', 'images', 'sprites')
  , svgOutput: path.resolve('app/javascript', 'images', 'sprites')
  , cssout: path.resolve('app/javascript', 'stylesheets', 'sprites')
  , ext: ['*.png', '*.gif']
  , css: true
  , scss: true
  , image_url: true
  , root_path: 'images/sprites'
  , inlineSvgFolder: 'inlinesvg'
  , pngFolder: 'pngs'
  , svgFolder: 'svgs'
  , svgInlineOutput: path.resolve('app/assets/images')
};

var config = utils(defaults, 'sprites')
    .addOutput('images/sprites');

module.exports = config;
