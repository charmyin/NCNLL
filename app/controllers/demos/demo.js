var mongoose = require('mongoose');
var ImageInfoModel = mongoose.model('ImageInfo');
var ProductModel = mongoose.model('Product');
var ProductItemModel = mongoose.model('ProductItem');
var ProjectModel = mongoose.model('Project');
var utils = require('../../../lib/utils');


exports.searchList = function(req, res) {
  var crite = utils.setCriteriaParam(req.body);
  var sortObj = utils.setSortParam(req.body);
  ProductModel.count(crite, function(errors, count){
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

exports.projectList = function(req, res){
  var crite = utils.setCriteriaParam(req.body);
  var sortObj = utils.setSortParam(req.body);
  ProjectModel.count(crite, function(errors, count){
    if(errors){
      res.json({
         "success":false,
         "msg":"查询过程中出错！",
         "error":errors
      });
      return;
    }
    ProjectModel.find(crite, function(err,list){
       res.render("demos/projectList", {dataList:list});
    });
  });
	
}