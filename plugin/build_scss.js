var _ = require("lodash");
var config = require("./config");
const create = require("./create");
var fs = require("fs");
var path = require("path");
var templater = require("spritesheet-templates");

create.folder(config.cssout);

function addImageUrl(data) {
  return data.replace(/url\(([^)]*)\)/gim, "url('$1')");
}

function setName(output, scss) {
  var ext = scss ? ".scss" : ".css";
  return "_" + output + ext;
}

function getCoordinates(coordinates) {
  var coords = [];
  _.forIn(coordinates, (v, k) => {
    var obj = {
      name: path.parse(k).name
    };
    coords.push(_.merge(obj, v));
  });

  return coords;
}

function getSpriteSheet(sprites, props, spritesheet) {
  return function(fmt) {
    return templater(
      {
        sprites: sprites,
        spritesheet: {
          width: props.width,
          height: props.height,
          image: spritesheet
        }
      },
      { format: fmt }
    );
  };
}

function processSpritesheet(sheet, iu) {
  var sprite_css = "";

  var obj = {
    add: function(type) {
      sprite_css += sheet(type);
      // sprite_css += (iu) ? addImageUrl(css) : css;
      return obj;
    },
    result: function() {
      return sprite_css;
    }
  };

  return obj;
}

// Builds css
module.exports = function(result, sprite, output) {
  var coords = getCoordinates(result.coordinates);
  var sheet = getSpriteSheet(coords, result.properties, sprite);
  var sprite_css = processSpritesheet(sheet, config.imageUrl);

  if (config.scss) sprite_css.add("scss");
  if (config.css) sprite_css.add("css");

  var file = path.resolve(config.cssout, setName(output, config.scss));
  fs.writeFileSync(file, sprite_css.result());
};
