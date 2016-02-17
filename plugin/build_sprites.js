var _           = require("lodash")
  , buildSCSS   = require("./build_scss")
  , config      = require("./config")
  , create      = require('@djforth/ap_utils').create
  , fs          = require('fs')
  , path        = require('path')
  , spritesmith = require('spritesmith');


create.folder(config.get("output"))


function getSpritePath(root_path, output){

  return function(fn){
    var filename = fn+".png";

    return {
      getRootPath:function(){
        return root_path+"/"+filename;
      }
      , getSpriteName:function(){
        return path.resolve(output, filename)
      }
    }
  }

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
    console.log(sprite_path.getSpriteName())
    fs.writeFileSync(sprite_path.getSpriteName(), result.image, 'binary');

    cb(result);
    // buildSCSS(result, sprite_path, output);
  })
}

function build_css(root_path, output){
  return function(result){

    buildSCSS(result, root_path, output);
  }
}

// Builds sprites
module.exports = function(manageFiles){
  var sprites = manageFiles();
  var sprite_path = getSpritePath(config.get("root_path"), config.get("output"));
  _.forIn(sprites, function(files, output){
    sp_path = sprite_path(output);
    createSprite(
        files
      , sp_path
      , build_css(sp_path.getRootPath(), output)
    );
  })
}