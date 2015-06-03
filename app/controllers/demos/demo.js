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
       res.render("demos/projectList", {dataList:list, allCount:count});
    });
  });
}

//批次列表
exports.productList = function(req, res){
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
    ProductModel.find(crite, function(err,list){
    	console.log(list)
       res.render("demos/productList", {dataList:list});
    });
  });
}

//产品个体列表
exports.productItemList = function(req, res){
  var crite = utils.setCriteriaParam(req.body);
  var sortObj = utils.setSortParam(req.body);
  ProductItemModel.count(crite, function(errors, count){
    if(errors){
      res.json({
         "success":false,
         "msg":"查询过程中出错！",
         "error":errors
      });
      return;
    }
    ProductItemModel.find(crite, function(err,list){
       res.render("demos/productItemList", {dataList:list});
    });
  });
}

//批次列表
exports.productItemImageList = function(req, res){
  var crite = utils.setCriteriaParam(req.body);
  var sortObj = utils.setSortParam(req.body);
  ImageInfoModel.count(crite, function(errors, count){
    if(errors){
      res.json({
         "success":false,
         "msg":"查询过程中出错！",
         "error":errors
      });
      return;
    }
    ImageInfoModel.find(crite, function(err,list){
       res.render("demos/productItemImageList", {dataList:list});
    });
  });
}