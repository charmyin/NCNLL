/***Module dependencies**/

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var CategorySchema = new Schema({
  categoryName:{type:String},
  categoryOrderIndex:{type:Number},
  iconName:{type:String}
});

mongoose.model("Category", CategorySchema);




