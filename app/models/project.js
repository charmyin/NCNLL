/*********************************************************************/
/***********************项目Project*********************/
/*********************************************************************/
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectIdSchema = Schema.ObjectId;
var ObjectId = mongoose.Types.ObjectId;

/*

  i.项目名称 name
  ii.项目编号 id
  iii.生产点编号: placeId  （临时的地点，用生产者单独的生产点编号，比如一个人 有十块分散的土地，这十块土地算一个生产点。详细在项目地点里面写明。）
  iv.项目地点 location
  iv.项目地点ID locationId
  v.经纬度 gps
  vi.项目描述 description
  vii.项目开始时间 startTime，
  viii.项目预估结束时间preEndTime
  ix.项目实际结束时间 endTime
  x.项目类型：type (原始生产，运输，加工等等)
  xi.相机IDs :   cameraIds   [{‘cameraId’:2234, ‘cameraDescription’:’照射飞机’},{‘cameraId’:2234, ‘cameraDescription’:’照射坦克’}]
  xii.前一环节项目产品纳入量 preContained：[{‘projectName:‘:’haochide’,’productName’:’mianbao’, ‘productAmount’:123，’unit’:’米’, ’产品id’:111, ‘projectId’:232}{‘projectName:‘:’haochide’,’productName’:’mianbao’, ‘productAmount’:123，’unit’:’米’, ’产品id’:111, ‘projectId’:232}]
  xiii.下一个环节项目纳出 preContained：[{‘projectName:‘:’haochide’,’productName’:’mianbao’, ‘productAmount’:123，’unit’:’米’, ’产品id’:111, ‘projectId’:232}{‘projectName:‘:’haochide’,’productName’:’mianbao’, ‘productAmount’:123，’unit’:’米’, ’产品id’:111, ‘projectId’:232}]
  xiv.关联的前面所有项目编号：preProjects
  xv.主要负责人ID：mainProducerId
  xvi.主要负责人名称：mainProducerName
  xvii.次要负责人：producers
  xviii.生产总量 actualAmount{“物品A”:120,“物品B”：222}
  xix.生产预估量estimateAmount{“物品A”:120,“物品B”：222}
  xx.本条记录新建日期
  xxh.本条记录修改日期
*/

var ProjectSchema = new Schema({
  // ii.项目编号 id
  //_id:{type:ObjectIdSchema, default: new ObjectId()},
  // i.项目名称 name
  name:{type:String, default:'', comment:"项目名称"},
  // iii.生产点编号: placeId  （临时的地点，用生产者单独的生产点编号，比如一个人 有十块分散的土地，这十块土地算一个生产点。详细在项目地点里面写明。）
  placeId:{type:String, default:'', comment:"生产点编号"},
  //所属产品
  // iv.项目地点 location
  producePlace:{type:String, default:'', comment:"项目生产地点"},
  // iv.项目地点ID locationId
  producePlaceId:{type:String, default:'', comment:"项目地点ID"},
  // v.经纬度 gps
  gps:{type:String, default:'', comment:"经纬度"},
  // vi.项目描述 description
  description:{type:String, default:'', comment:"项目描述"},
  // vii.项目开始时间 startTime，
  startTime:{type:Date, default:'', comment:"startTime"},
  // viii.项目预估结束时间preEndTime
  preEndTime:{type:Date, default:'', comment:"项目预估结束时间"},
  // ix.项目实际结束时间 endTime
  endTime:{type:Date, default:'', comment:"项目实际结束时间"},
  // x.项目类型：type (原始生产，运输，加工等等)
  type:{type:String, default:'', comment:"项目类型"},
  // xi.相机IDs :   cameraIds   [{‘cameraId’:2234, ‘cameraDescription’:’照射飞机’},{‘cameraId’:2234, ‘cameraDescription’:’照射坦克’}]
  cameraIds:{type:[], default:'', comment:"相机IDs"},
  // xii.前一环节项目产品纳入量 preContained：[{‘projectName:‘:’haochide’,’productName’:’mianbao’, ‘productAmount’:123，’unit’:’米’, ’产品id’:111, ‘projectId’:232}{‘projectName:‘:’haochide’,’productName’:’mianbao’, ‘productAmount’:123，’unit’:’米’, ’产品id’:111, ‘projectId’:232}]
  preContained:{type:[], default:'', comment:"前一环节项目产品纳入量"},
  // xiii.下一个环节项目纳出 preContained：[{‘projectName:‘:’haochide’,’productName’:’mianbao’, ‘productAmount’:123，’unit’:’米’, ’产品id’:111, ‘projectId’:232}{‘projectName:‘:’haochide’,’productName’:’mianbao’, ‘productAmount’:123，’unit’:’米’, ’产品id’:111, ‘projectId’:232}]
  nextOutput : {type:[], default:'', comment:"下一个环节项目纳出"},
  // xiv.关联的前面所有项目编号：preProjects
  preProjects:{type:[], default:'', comment:"关联的前面所有项目编号"},
  // xv.主要负责人ID：mainProducerId
  mainProducerId:{type:String, default:'', comment:"主要负责人ID"},
  // xvi.主要负责人名称：mainProducerName
  mainProducerName:{type:String, default:'', comment:"主要负责人名称"},
  // xvii.次要负责人：producers
  producers:{type:[], default:'', comment:"次要负责人"},
  // xviii.生产总量 actualAmount{“物品A”:120,“物品B”：222}
  actualAmount:{type:String, default:'', comment:"生产总量"},
  // xix.生产预估量estimateAmount{“物品A”:120,“物品B”：222}
  estimateAmount:{type:{}, comment:"生产预估量"},
  //相机视角
  cameraViews:[{
    viewIndex:{type:Number, default:""},
   // viewId:{type:String,default:""},
    cameraId:{type:String,default:""},
    title:{type:String,default:""},
    createTime:{type:Date, default:new Date()},
    description:{type:String,default:""}
  }]
  // xx.新建日期
  //createTime:{type:Date, default:new Date(), comment:"新建日期"},
  //xxi.修改日期
  //lastModifyTime:{type:Date, default:new Date(), comment:"修改日期"}
});

ProjectSchema.statics = {
  queryList: function (options, cb) {
    var criteria = options.criteria || {};
    this.find(criteria)
      .sort(options.sortObj)
      .limit(options.rows)
      .skip(options.rows * (options.page-1))
      .exec(cb);
      }
};

mongoose.model('Project', ProjectSchema);
