var mongoose = require('mongoose')
  , CommonModel = mongoose.model('ProductItem')
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



exports.findProductItemById = function(req, res){
  var id = req.param("_id");
  CommonModel.findOne({ _id:id}, function(err, doc){
    if(err) {
      res.json({success:false, message:"内部错误!"});
    }
    else {
      res.json({success:true, productItem:doc});
    }
  });
};

