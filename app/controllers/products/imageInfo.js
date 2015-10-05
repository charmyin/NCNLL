var mongoose = require('mongoose')
  , CommonModel = mongoose.model('ImageInfo')
  , utils = require('../../../lib/utils');


exports.searchList = function(req, res) {
  var crite = utils.setCriteriaParam(req.body);
  var sortObj = utils.setSortParam(req.body);
  CommonModel.count(crite, function(errors, count){
    if(errors){
      res.json({
         "success":false,
         "msg":"查询过程中出错！",
         "error":errors
      });
      return;
    }
    CommonModel.queryList({rows:req.body.rows, page:req.body.page, criteria:crite, sort:sortObj}, function(err,list){
      utils.setQueryListResponse(err, req, res, list, count);
    });
  });
};


exports.searchHistoryImageList = function(req, res) {
    CommonModel.find({ $and:[{cameraSerialId:req.body.cameraSerialId}, {createTime:{ $lt: new Date(req.body.endTime) }}, {createTime:{ $gt: new Date(req.body.startTime) }} ]}).exec(function(err,list){
      if(err){
        console.log(err)
      }
      utils.setQueryListResponse(err, req, res, list, 0);
    });
};