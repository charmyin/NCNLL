process.env.TMPDIR = 'tmp'; // to avoid the EXDEV rename error, see http://stackoverflow.com/q/21071303/76173


var mongoose = require("mongoose");
var Brand =  mongoose.model("Brand");

var User = mongoose.model('User');

var Grid = require('gridfs-stream');
var fs = require('fs');
var gm = require('gm');
var imageMagick = gm.subClass({ imageMagick : true });

var Query = mongoose.Query;
Grid.mongo = mongoose.mongo;
var gfs = Grid(mongoose.connection.db);
var flow = require('../../../lib/flow-node.js')('tmp');

exports.saveBrandInfo = function(req, res){
  var brand = new Brand(req.body);

  Brand.upsertBrand(brand, req.user, function(err){
    if(!err){
      res.json({"success":true});
    }else{
      res.json({"success":false, "error":err});
    }
  });
};

exports.getBrandInfo = function(req, res){
  var user = req.user;
  Brand.getUserBrand(user, function(err, brand){
    if(!err){
      res.json({"success":true, "brand":brand});
    }else{
      res.json({"success":false, "message":err});
    }
  });
};

exports.getBrandPhotoByFileId = function(req, res){
  var photoFileId = req.param("photoFileId");
    if(photoFileId && photoFileId.trim()){
      var readstream = gfs.createReadStream({
        _id: req.param("photoFileId"),
        root:'brandPhoto'
      });
      readstream.pipe(res);
      readstream.on('error', function (error){
        res.redirect("/images/common/404.gif");
      });
    }else{
        res.redirect("/images/common/404.gif");
    }

};

//上传品牌图片
/*exports.uploadBrandPhoto = function(req, res) {
    flow.post(req, function(status, filename, original_filename, identifier) {
         if(status=="done"){

          //将文件写入gridfs
          var writestream = gfs.createWriteStream({
            userId : req.user._id,
            filename: filename, // a filename
            mode: 'w', // default value: w+, possible options: w, w+ or r, see [GridStore](http://mongodb.github.com/node-mongodb-native/api-generated/gridstore.html)
            //chunkSize: 1024,
           // content_type: 'image/jpeg', // For content_type to work properly, set "mode"-option to "w" too!
            root: 'brandPhoto'
          });
          //fs.createReadStream('D:/test.jpg').pipe(writestream);

          flow.write(identifier, writestream, {
            onDone:function(){
              //清除文件夹中已经存入数据库的文件
              flow.clean(identifier);
              //删除原有的用户图片，录入新图片
              Brand.findOne({ user: req.user._id}, function (err, brand) {

                if(brand){
                  if(brand.brandPhotoIds && brand.brandPhotoIds.length>0){
                    //删除数据库中的文件
                    //console.log("user.brandPhotoID----"+user.userPhotoID);
                    var photoFileId = new mongoose.mongo.BSONPure.ObjectID(brand.brandPhotoIds[0]._id);
                    gfs.remove({_id:photoFileId, root:'brandPhoto'}, function(){
                    });
                  }
                  if(brand.brandPhotoIds){
                    brand.brandPhotoIds.pop();
                  }
                  brand.brandPhotoIds.push(writestream.id);
                  brand.save(function(err){
                    if(!err) {
                      res.json({success:true});
                    }
                    else {
                      res.json({success:false, message:"内部错误!"});
                    }
                  });
                }else{
                  res.json({success:false, message:"请先保存用户信息!"});
                }
              });
            }
          });

        }else{
          res.send(200, {
            success:true
              // NOTE: Uncomment this funciton to enable cross-domain request.
              //'Access-Control-Allow-Origin': '*'
          });
        }
    });
};*/


// Handle cross-domain requests
exports.uploadBrandPhotoStatus = function(req, res) {
         res.send(200, 404);
};


//上传用户品牌图片
exports.uploadBrandPhoto = function(req, res) {

    flow.post(req, function(status, filename, original_filename, identifier) {

        if(status=="done"){
          //fs.createReadStream('D:/test.jpg').pipe(writestream);
          var writeTmpImgStream = fs.createWriteStream("./tmp/flow-"+identifier+"tmp");

          flow.write(identifier, writeTmpImgStream, {

            onDone:function(){

              //将文件写入gridfs
              var writestream = gfs.createWriteStream({
                userId : req.user._id,
                filename: filename, // a filename
                mode: 'w+', // default value: w+, possible options: w, w+ or r, see [GridStore](http://mongodb.github.com/node-mongodb-native/api-generated/gridstore.html)
               //chunkSize: 1024,
               // content_type: 'image/jpeg', // For content_type to work properly, set "mode"-option to "w" too!
                root: 'brandPhoto'
              });

              // var writeTmpImgStreamSmall = fs.createWriteStream("./flow-"+identifier+"tmp");
              //将原图缩小后，放入gridfs中
              imageMagick("./tmp/flow-"+identifier+"tmp")
              .scale('410', '410')
              .stream().pipe(writestream)
              .on('close', function () {
                fs.unlink("./tmp/flow-"+identifier+"tmp");
              });

              /*(function (err, stdout, stderr) {
                stdout.pipe(writestream);
              });*/

              //清除文件夹中已经存入数据库的文件
              flow.clean(identifier);
              //删除原有的用户图片，录入新图片
              Brand.findOne({ user: req.user._id}, function (err, brand) {
                if(brand){
                  if(brand.brandPhotoIds && brand.brandPhotoIds.length>0){
                    //删除数据库中的文件
                    //console.log("user.brandPhotoID----"+user.userPhotoID);
                    var photoFileId = new mongoose.mongo.BSONPure.ObjectID(brand.brandPhotoIds[0]._id);
                    gfs.remove({_id:photoFileId, root:'brandPhoto'}, function(){
                    });
                  }
                  if(brand.brandPhotoIds){
                    brand.brandPhotoIds.pop();
                  }
                  brand.brandPhotoIds.push(writestream.id);
                  brand.save(function(err){
                    if(!err) {
                      res.json({success:true});
                    }
                    else {
                      res.json({success:false, message:"内部错误!"});
                    }
                  });
                }else{
                  res.json({success:false, message:"请先保存用户信息!"});
                }
              });
            }
          });
        }else if(status=="invalid_flow_request2"){
          res.send(200, {
            success:false,
            "message":"文件太大，请小于1M"
          });
        }else{
          res.send(200, {
            success:true
          });
        }
    });
};
