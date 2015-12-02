
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Imager = require('imager')
  , env = process.env.NODE_ENV || 'development'
  , config = require('../../config/config')[env]
  , Schema = mongoose.Schema
  , utils = require('../../lib/utils');
 
var TokenSchema = new Schema({
  //errcode:{type:Number},
  //errmsg:{type : String, default : '', trim : true},
  access_token: {type : String, default : '', trim : true},
  ticket: {type : String, default : '', trim : true},
  expires_in:{type:Number},
  createdAt  : {type : Date, default : Date.now, expires: 10 }
});



mongoose.model('WeChatToken', TokenSchema)
