var _ = require("lodash");

module.exports = function(){
  var folderList = {}

  return function(entry){
    if(entry && !_.has(folderList, entry.dir)){
      folderList[entry.dir] = []
    }

    if(entry){
      folderList[entry.dir].push(entry.path)
    }


    return folderList;
  }
}