/*********************************************************************/
/****************************产品个体ProductItem******************************/
/*********************************************************************/
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectIdSchema = Schema.ObjectId;
var ObjectId = mongoose.Types.ObjectId;
 
  //二维码信息 格式: projectId,productId,_id
  //产品名称
  //所属项目ID
  //项目名称
  //批次id
  //批次名称
  //描述
  //二维码
  //照片集合描述
  //照片集合0
  //照片集合1
  //照片集合2
  //照片集合3
  //照片集合4

var ProductItemSchema = new Schema({
    //_id:{type:ObjectIdSchema, default: new ObjectId()},
    //二维码信息 格式: projectId,productId,_id
    //QRCodes:{type:String, default:"", comment:""}
    //产品名称
    name: {type : String, default:0, comment:"产品名称"},
    //所属项目ID
    projectId: {type : String, default:'', trim : true, comment:"所属项目ID"},
    //项目名称
    projectName: {type : String, default : 0, comment:"所属项目名称"},
    //批次id
    productId:{type : String, default : 0, comment:"批次id"},
    //批次名称
    productName:{type : String, default : 0, comment:"批次名称"},
    //描述
    description: {type : String, default:0, comment:"描述"},
    //二维码
    QRCodes:{type:String, default:"", comment:"二维码地址"},
    //相机视角
    cameraViews:[{
      //viewId:{type:String,default:""},
      //变更时，需要清空原来camera表中的数据（如果原来camera表中已经不是自己的了，则不需要清空），然后录入当前数据
      //camera:{cameraId:{type:String,default:""}, createDate:{type:Date},creatorId:{type:String,default:""}},
      viewIndex:{type:String,default:""},
      cameraId:{type:String,default:""},
      title:{type:String,default:""},
      createTime:{type:Date, default:new Date()},
      description:{type:String,default:""}
    }]
});


ProductItemSchema.statics = {
  queryList: function (options, cb) {
    var criteria = options.criteria || {};
    this.find(criteria)
      .sort(options.sortObj)
      .limit(options.rows)
      .skip(options.rows * (options.page-1))
      .exec(cb);
      }
};

mongoose.model('ProductItem', ProductItemSchema);
