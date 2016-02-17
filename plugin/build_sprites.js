var _           = require("lodash")
  , buildSCSS   = require("./build_scss")
  , config      = require("./config")
  , create      = require('@djforth/ap_utils').create
  , fs          = require('fs')
  , path        = require('path')
  , spritesmith = require('spritesmith');


create.folder(config.get("output"))


function getSpritePath(root_path, output){
  var filename = "sprite.png";
  var obj = {
     setFilename:function(fn){
       filename = fn+".png";
       return obj;
     }
    , getRootPath:function(){
      return root_path+"/"+filename;
    }
    , getSpriteName:function(){
      return path.resolve(output, filename)
    }
  }

  return obj;
}

function createSprite(files, sprite_path, cb){
  spritesmith.run({
    src: files,
    algorithm: 'binary-tree'
  }, function handleResult (err, result) {
    // If there was an error, throw it
    if (err) {
      console.warn(err);
    }
    //Write the sprite

    fs.writeFileSync(sprite_path.getSpriteName(), result.image, 'binary');

    cb(result);
    // buildSCSS(result, sprite_path, output);
  })
}

function build_css(root_path, output){
  return function(result){
    console.log(buildSCSS)
    buildSCSS(result, root_path, output);
  }
}

// Builds sprites
module.exports = function(manageFiles){
  var sprites = manageFiles();
  var sprite_path = getSpritePath(config.get("root_path"), config.get("output"));
  _.forIn(sprites, function(files, output){
    sprite_path.setFilename(output);
    createSprite(
        files
      , sprite_path
      , build_css(sprite_path.getRootPath(), output)
    );
  })
}