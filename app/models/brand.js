/***Module dependencies**/

var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  utils = require('../../lib/utils');

var BrandSchema = new Schema({
  /*  name: { type: String, default: '' },*/
  brandname: { type: String, default: '' },
  website: { type: String, default: '' },
  address:{type:String, default:''},
  //电话号码
  introduction: { type: String, default: '' },
  //品牌所有者
  user: {type : Schema.ObjectId, ref : 'User'},
  category:[{
    name:{type:String, default:''}
  }],
  brandPhotoIds:[{type:String}]
});


BrandSchema.statics = {
  /***
  *按用户名插入brand，如果存在则更新
  *brand:要更新的brand
  *ownerUser:brand所属用户
  *callback:错误回调函数
  ***/
  upsertBrand:function(brand,ownerUser,callback){

    this.findOne({ user : ownerUser }, function (err, tmpBrand) {
      if (err){
        callback(err);
        return;
      }
      //Update fields
      if(tmpBrand){
        tmpBrand.brandname = brand.brandname;
        tmpBrand.website =  brand.website;
        tmpBrand.address=brand.address;
        tmpBrand.introduction=brand.introduction;
        tmpBrand.save(callback);
      }else{
        brand.user = ownerUser;
        brand.save(callback);
      }
    });
  },

  /**
  *按当前用户查找品牌信息
  *ownerUser:所属用户
  **/
  getUserBrand:function(ownerUser, callback){
    this.findOne({user:ownerUser}, callback);
  }

};


mongoose.model("Brand", BrandSchema);
