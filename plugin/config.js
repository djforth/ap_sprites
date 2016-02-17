var _      = require("lodash")
  , utils  = require("@djforth/ap_utils").config
  , path   = require("path")


function setPaths(key, def){
  return function(path, obj){
    obj[key] =(_.isUndefined(path)) ? def : path;
    return obj;
  }
}

var defaults = {
    input    : path.resolve("app/assets_uncompiled", "sprites")
  , output   : path.resolve("app/assets_uncompiled", "images", "sprites")
  , cssout : path.resolve("app/assets_uncompiled", "stylesheets" , "sprites")
  , ext      : ["*.png", "*.gif"]
  , css:true
  , scss:true
  , image_url:true
  , root_path:"sprites"
}

var config = utils(defaults, "sprites")
    .addOutput("images/sprites");

module.exports = config;