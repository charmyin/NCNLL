var mongoose = require('mongoose')
  , CommonModel = mongoose.model('ProductItem')
  , utils = require('../../../lib/utils')
   , wechatUtils = require('../../../lib/wechatUtils');
var sha1 = require('sha1');
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

exports.sharePruductById = function(req, res){
  var id = req.param("id");

  var timestr = Math.round(new Date().getTime()/1000);
  var url = 'http://192.168.1.105:18080/shareProduct/'+id+"/";
  wechatUtils.getSignatureIfNotExist(function(obj, signature){
    console.log(signature)
    res.render('share/shareIndex', { title: 'NCNLL', pageType:'share', timestr:timestr, signature:signature });
  }, url,timestr);

}