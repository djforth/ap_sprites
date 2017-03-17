var _           = require('lodash');
var config      = require('./config');
var create      = require('@djforth/ap_utils').create;
var fs          = require('fs');
var path        = require('path');
var templater   = require('spritesheet-templates');

create.folder(config.get('cssout'));

function addImageUrl(data){
  return data.replace(/url\(([^)]*)\)/igm, "url('$1')");
}

function setName(output, scss){
  var ext = (scss) ? '.scss' : '.css';
  return '_' + output + ext;
}

function getCoordinates(coordinates){
  var coords = [];
  _.forIn(coordinates, (v, k)=>{
    var obj = {
      name: path.parse(k).name
    };
    coords.push(_.merge(obj, v));
  });

  return coords;
}

function getSpriteSheet(sprites, props, spritesheet){
  return function(fmt){
    return templater({
      sprites: sprites
      , spritesheet: {
        width: props.width, height: props.height, image: spritesheet
      }
    }, {format: fmt});
  };
}

function processSpritesheet(sheet, iu){
  var sprite_css = '';

  var obj = {
    add: function(type){
      sprite_css += sheet(type);
      // sprite_css += (iu) ? addImageUrl(css) : css;
      return obj;
    }
    , result: function(){
      return sprite_css;
    }
  };

  return obj;
}

// Builds css
module.exports = function(result, sprite, output){
  var coords = getCoordinates(result.coordinates);
  var sheet  = getSpriteSheet(coords, result.properties, sprite);
  var sprite_css = processSpritesheet(sheet, config.get('image_url'));

  if (config.get('scss')) sprite_css.add('scss');
  if (config.get('css')) sprite_css.add('css');

  var file = path.resolve(
    config.get('cssout')
    , setName(output, config.get('scss'))
  );
  fs.writeFileSync(file, sprite_css.result());
};
