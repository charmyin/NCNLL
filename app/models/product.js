/*********************************************************************/
/****************************产品批次Product******************************/
/*********************************************************************/
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectIdSchema = Schema.ObjectId;
var ObjectId = mongoose.Types.ObjectId;

/*
  i.所属项目id : projectId
  ii.项目名称：projectName
  iii.产品名称：name
  iv.产量:output
  v.单位：unit
  vi.产品特点描述: description
  vii.产品分类id：productTypeId
  viii.产品分类名称: productTypeName
  ix.生产日期：productDate
*/

var ProductSchema = new Schema({
  //_id:{type:ObjectIdSchema, default: new ObjectId()},
  //产品名称
  name: {type : String, default:0, comment:"产品名称"},
  //所属项目ID
  projectId: {type : String, default : '', trim : true, comment:"所属项目ID"},
  //项目名称
  projectName: {type : String, default : 0, comment:"所属项目名称"},
  //产量
  output: {type : String, default:0, comment:"产量"},
  //单位
  unit:{type : String, default:0, comment:"单位"},
  // vii.项目开始时间 startTime，
  startTime:{type:Date, default:'', comment:"生成开始时间"},
  // viii.项目预估结束时间preEndTime
  preEndTime:{type:Date, default:'', comment:"该产品批次预估结束时间"},
  // ix.项目实际结束时间 endTime
  endTime:{type:Date, default:'', comment:"该产品批次实际结束时间"},
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
  //特点描述
  description: {type : String, default:new Date(), comment:"特点描述"},
  //产品分类ID
  productTypeId: {type:String,default:0, comment:"产品分类ID"},
  //产品分类名称
  productTypeName: {type:String,default:0, comment:"产品分类名称"},
  //产品生产日期
  produceDate : {type:Date, default:new Date(), comment:"生产日期"}
});


ProductSchema.statics = {
  queryList: function (options, cb) {
    var criteria = options.criteria || {};
    this.find(criteria)
      .sort(options.sortObj)
      .limit(options.rows)
      .skip(options.rows * (options.page-1))
      .exec(cb);
      }
};

mongoose.model('Product', ProductSchema);