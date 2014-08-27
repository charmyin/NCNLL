/***Module dependencies**/

var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  utils = require('../../lib/utils');

var ProductInfo = new Schema({
  //产品名称
  productName:{type:String, default:''},
  //产品描述
  productDescription:{type:String, default:''},
  //产品类别
  //productCategory:{type:Schema.ObjectId, ref:'Category'},
  productCategory:{type:String, default:''},
  //产品产地
  productOriginPlace:{type:String, default:''},
  //购买链接
  linkToBuy:{type:String, default:''},
  //所属用户
  user:{type: Schema.ObjectId, ref:'User'},
  //item展示图片
  indexImgIds:[{
    type:String
  }],

  //图片轮播
  scrollPics:[{
    tabType:{type:Number},
    orderIndex:{type:Number},
    picsTitle:{type:String, default:''},
    description:{type:String, default:''},
    picIdentities:[{type:String, default:''}]
  }],
  //缩时摄像
  timelapseVideos:[{
    tabType:{type:Number},
    orderIndex:{type:Number},
    videoTitle:{type:String, default:''},
    videoLink:{type:String, default:''},
    description:{type:String, default:''}
  }],
  //实时图片
  realtimePics:[{
    tabType:{type:Number},
    orderIndex:{type:Number},
    picsTitle:{type:String, default:''},
    realtimeID:{type:String, default:''},
    description:{type:String, default:''}
  }]

});

mongoose.model("ProductInfo", ProductInfo);


