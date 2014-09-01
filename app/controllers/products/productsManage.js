var mongoose = require("mongoose");
var ProductInfo =  mongoose.model("ProductInfo");
var Category =  mongoose.model("Category");
var Brand = mongoose.model('Brand');

var Grid = require('gridfs-stream');
var fs = require('fs');
var gm = require('gm');
var imageMagick = gm.subClass({ imageMagick : true });
var Query = mongoose.Query;
Grid.mongo = mongoose.mongo;
var gfs = Grid(mongoose.connection.db);
var flow = require('../../../lib/flow-node.js')('tmp');

exports.saveProductBasicInfo = function(req, res){
  var productInfo = new ProductInfo(req.body);

    //update
    ProductInfo.findOne({_id:productInfo._id}, function(err, dbProductInfo){
      if (err){
        callback(err);
        res.json({"success":false, "error":err});
        return;
      }
      if(dbProductInfo){
        dbProductInfo.productName = productInfo.productName;
        dbProductInfo.productDescription = productInfo.productDescription;
        dbProductInfo.productCategory = productInfo.productCategory;
        dbProductInfo.productOriginPlace = productInfo.productOriginPlace;
        dbProductInfo.linkToBuy = productInfo.linkToBuy;
        dbProductInfo.save(function(err){
          if(!err){
            res.json({"success":true, "productInfo":dbProductInfo});
          }else{
            res.json({"success":false, "error":err});
          }
        });
      }else{
        //Insert
        productInfo.user = req.user;
        productInfo.save(function(err, newProductInfo){
          if(!err){
            res.json({"success":true, "productInfo":newProductInfo});
          }else{
            res.json({"success":false, "error":err});
          }
        });
      }
    });
};

//保存图片轮播
exports.savePicsScroll = function(req, res){
  var picsScroll = req.body;
  //先删除原有记录
  ProductInfo.findOneAndUpdate({
    _id:picsScroll._id
  }, {
    $pull: { scrollPics:{"orderIndex": picsScroll.orderIndex} }
    //$push: { scrollPics: picsScroll }
  }, function(err, dbProductInfo){
    if (err){
      res.json({"success":false, "error":err});
      return;
    }
    ProductInfo.findOneAndUpdate({
      _id:picsScroll._id
    }, {
     // $pull: { "orderIndex": picsScroll.orderIndex },
      $push: { scrollPics: picsScroll }
    }, {
      safe: true
    }, function(err, dbProductInfo){
      if (err){
        res.json({"success":false, "error":err});
        return;
      }
      res.json({"success":true, "productInfo":dbProductInfo});
    });
  });
};

//删除图片轮播tab，并清除关联图片
exports.removePicsScroll = function(req, res){
  var picsScroll = req.body;

    //update
    ProductInfo.findOne({_id:picsScroll._id}, function(err, dbProductInfo){
      if (err){
        res.json({"success":false, "error":err});
        return;
      }
      if(dbProductInfo){

        // 清除相关图片
        dbProductInfo.scrollPics.forEach(function(item){
          if(item.orderIndex == picsScroll.orderIndex){
            item.picIds.forEach(function(picId){
              gfs.remove({_id:picId, root:'productPhotoInTab'}, function(){
              });
            });
          }
        });

        for(var i = 0; i<dbProductInfo.scrollPics.length; i++){
          if(dbProductInfo.scrollPics[i].orderIndex == picsScroll.orderIndex){
            dbProductInfo.scrollPics.splice(i, 1);
          }
        }

        console.log(dbProductInfo.scrollPics);



        dbProductInfo.save(function(err){
          if(!err){
            //返回对象，重新渲染页面
            res.json({"success":true, "productInfo":dbProductInfo});
          }else{
            res.json({"success":false, "error":err});
          }
        });
      }else{
        res.json({"success":false, "error":err});
      }
    });


};


//保存缩拍视频
exports.saveVideoUpload = function(req, res){
  var videoUpload = req.body;

  //先删除原有记录
  ProductInfo.findOneAndUpdate({
    _id:videoUpload._id
  }, {
    $pull: { timelapseVideos:{"orderIndex": videoUpload.orderIndex} }
    //$push: { timelapseVideos: videoUpload }
  }, function(err, dbProductInfo){
    if (err){
      res.json({"success":false, "error":err});
      return;
    }
    ProductInfo.findOneAndUpdate({
      _id:videoUpload._id
    }, {
     // $pull: { "orderIndex": videoUpload.orderIndex },
      $push: { timelapseVideos: videoUpload }
    }, {
      safe: true
    }, function(err, dbProductInfo){
      if (err){
        res.json({"success":false, "error":err});
        return;
      }
      res.json({"success":true, "productInfo":dbProductInfo});
    });
  });
};

//删除视频tab
exports.removeVideoUpload = function(req, res){
  var videoUpload = req.body;
  //先删除原有记录
  ProductInfo.findOneAndUpdate({
    _id:videoUpload._id
  }, {
    $pull: { timelapseVideos:{"orderIndex": videoUpload.orderIndex} }
    //$push: { timelapseVideos: videoUpload }
  }, function(err, dbProductInfo){
    if (err){
      res.json({"success":false, "error":err});
      return;
    }
    res.json({"success":true, "productInfo":dbProductInfo});
  });
};



//保存实时图片
exports.saveRealtimePics = function(req, res){
  var realtimePics = req.body;

  //先删除原有记录
  ProductInfo.findOneAndUpdate({
    _id:realtimePics._id
  }, {
    $pull: { realtimePics:{"orderIndex": realtimePics.orderIndex} }
    //$push: { timelapseVideos: realtimePics }
  }, function(err, dbProductInfo){
    if (err){
      res.json({"success":false, "error":err});
      return;
    }
    ProductInfo.findOneAndUpdate({
      _id:realtimePics._id
    }, {
     // $pull: { "orderIndex": realtimePics.orderIndex },
      $push: { realtimePics: realtimePics }
    }, {
      safe: true
    }, function(err, dbProductInfo){
      if (err){
        res.json({"success":false, "error":err});
        return;
      }
      res.json({"success":true, "productInfo":dbProductInfo});
    });
  });
};

//删除实时图片
exports.removeRealtimePics = function(req, res){
  var realtimePics = req.body;
  //先删除原有记录
  ProductInfo.findOneAndUpdate({
    _id:realtimePics._id
  }, {
    $pull: { realtimePics:{"orderIndex": realtimePics.orderIndex} }
    //$push: { timelapseVideos: videoUpload }
  }, function(err, dbProductInfo){
    if (err){
      res.json({"success":false, "error":err});
      return;
    }
    res.json({"success":true, "productInfo":dbProductInfo});
  });
};

//获取session中用户的产品
exports.getUserProducts = function(req, res){
  ProductInfo.find({"user":req.user}).exec(function(err, collection){
      res.json(collection);
  });
};

//通过用户ID删除
exports.deleteById = function(req, res){
  ProductInfo.findOneAndRemove({"_id":req.body._id, "user":req.user},function(err, dbProductInfo){
    if (err){
      res.json({"success":false, "error":err});
      return;
    }
    res.json({"success":true, "productInfo":dbProductInfo});
  });
};

//先删除所有类别，然后添加
exports.saveProductCategories = function(req, res){

  var categoryArray = req.body;

  Category.remove(function(err){
    if (err){
      res.json({"success":false, "error":err});
      return;
    }
    categoryArray.forEach(function(item){
      var ci = new Category(item);
      ci.save(function(err){
        if (err){
          res.json({"success":false, "error":err});
          return;
        }
        res.json({"success":true});
      });
    });
  });
};
//获取所有类别信息
exports.allCategories = function(req, res){
  Category.find({}, function(err, categories){
    if (err){
      res.json({"success":false, "error":err});
      return;
    }
    res.json({"success":true, "categories":categories});
  });
};

//获取所有分类的前三条信息
exports.getLimitedElementByCategory = function(req, res){
  Category.find({}, function(err, categories){
    if (err){
      res.json({"success":false, "error":err});
      return;
    }
    var categoriesArray = [];
    //计数器
    var tmpCount=0;
   //console.log(tmpCount);

    var recurseQuery = function(){
      //console.log(categories[tmpCount]);
      var query = ProductInfo.find({"productCategory":categories[tmpCount]._id});
      query.populate({
        path:'user',
        select: 'username',
      });
      query.limit(3).exec(function(err, dbCategoryProducts){
        if (err){
          res.json({"success":false, "error":err});
          return;
        }
        var tmpResult = {"self":categories[tmpCount], "items":dbCategoryProducts};

        categoriesArray[tmpCount]=tmpResult;

        tmpCount++;
        if(tmpCount==categories.length){
          res.json({"success":true, "categories":categoriesArray});
          return;
        }
        recurseQuery();
      });
    };

    if(categories.length > 0){
      recurseQuery();
    }

  });
};

//按分类获取产品
exports.getProductByCategory = function(req, res){
  var catId = req.param("_id");

  Category.findOne({"_id":catId}, function(err, category){
    if (err){
      res.json({"success":false, "error":err});
      return;
    }else{
      var query = ProductInfo.find({"productCategory":catId}).populate({
        path:"user",
        select:"username"
      });

      query.exec(function(err, productInfos){
        if (err){
          res.json({"success":false, "error":err});
          return;
        }else{
          var tmpResult = {"self":category, "items":productInfos};
          res.json({"success":true, "productInfos":[tmpResult]});
        }
      });
    }
  });
};

//按分类获取产品
exports.getProductsByProducer = function(req, res){
  var producerId = req.param("_id");
  Brand.findOne({"user":producerId}).populate({
     path:"user",
     select:"username email userrole phonenumber birthday introduction website address userPhotoID"
  }).exec(function(err, brandInfo){

    Category.find({}, function(err, categories){
      if (err){
        res.json({"success":false, "error":err});
        return;
      }
      var categoriesArray = [];
      //计数器
      var tmpCount=0;
     //console.log(tmpCount);

      var recurseQuery = function(){
        //console.log(categories[tmpCount]);
        if (!categories[tmpCount]){
          res.json({"success":true, "brandInfo":brandInfo, "categories":undefined});
          return;
        }
        var query = ProductInfo.find({"productCategory":categories[tmpCount]._id, "user":producerId});
        query.exec(function(err, dbCategoryProducts){
          if (err){
            res.json({"success":false, "error":err});
            return;
          }
          var tmpResult = {"self":categories[tmpCount], "items":dbCategoryProducts};

          categoriesArray[tmpCount]=tmpResult;

          tmpCount++;
          if(tmpCount==categories.length){
            res.json({"success":true, "brandInfo":brandInfo, "categories":categoriesArray});
            return;
          }
          recurseQuery();
        });
      };
      recurseQuery();
    });
  });

/*  ProductInfo.find({"user":producerId}, function(err, products){
    if (err){
      res.json({"success":false, "error":err});
      return;
    }else{
     res.json({"success":true, "productInfos":[{ "items":products}]});
    }
  });*/
};

// Handle cross-domain requests
exports.uploadProductPhotoStatus = function(req, res) {
     res.send(200, 404);
};


//获取首页展示图片
exports.getProductPhotoByFileId = function(req, res){
  var photoFileId = req.param("photoFileId");
    if(photoFileId && photoFileId.trim()){
      var readstream = gfs.createReadStream({
        _id: req.param("photoFileId"),
        root:'productPhoto'
      });
      readstream.pipe(res);
      readstream.on('error', function (error){
        res.redirect("/images/common/404.gif");
      });
    }else{
        res.redirect("/images/common/404.gif");
    }
};

//图片处理
/*exports.uploadProductPhoto = function(req, res){
    var product_id = req.param("product_id");
    flow.post(req, function(status, filename, original_filename, identifier) {
       if(status=="done"){
        //将文件写入gridfs
        var writestream = gfs.createWriteStream({
          userId : req.user._id,
          filename: filename, // a filename
          mode: 'w', // default value: w+, possible options: w, w+ or r, see [GridStore](http://mongodb.github.com/node-mongodb-native/api-generated/gridstore.html)
          //chunkSize: 1024,
         // content_type: 'image/jpeg', // For content_type to work properly, set "mode"-option to "w" too!
          root: 'productPhoto'
        });

        flow.write(identifier, writestream, {
          onDone:function(){
            //清除文件夹中已经存入数据库的文件
            flow.clean(identifier);
            //删除原有的用户图片，录入新图片
            ProductInfo.findOne({_id:product_id}, function (err, product) {
              if(product){
                if(product.indexImgIds && product.indexImgIds.length>0){
                  //删除数据库中的文件
                  var photoFileId = new mongoose.mongo.BSONPure.ObjectID(product.indexImgIds[0]._id);
                  gfs.remove({_id:photoFileId, root:'productPhoto'}, function(){
                  });
                }
                if(product.indexImgIds){
                  product.indexImgIds.pop();
                }
                product.indexImgIds.push(writestream.id);
                product.save(function(err){
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
        });
      }

  });
};
*/

//上传产品图片
exports.uploadProductPhoto = function(req, res) {
    var product_id = req.param("product_id");
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
                root: 'productPhoto'
              });

              // var writeTmpImgStreamSmall = fs.createWriteStream("./flow-"+identifier+"tmp");
              //将原图缩小后，放入gridfs中
              imageMagick("./tmp/flow-"+identifier+"tmp")
              .scale('410', '410')
              //将流写入数据库
              .stream().pipe(writestream)
              .on('close', function () {
                fs.unlink("./tmp/flow-"+identifier+"tmp");
              });

              /*(function (err, stdout, stderr) {
                stdout.pipe(writestream);
              });*/

              //清除文件夹中已经存入数据库的文件
              flow.clean(identifier);
              //删除原有的产品图片，录入新图片
              ProductInfo.findOne({_id:product_id}, function (err, product) {
                if(product){
                  if(product.indexImgIds && product.indexImgIds.length>0){
                    //删除数据库中的文件
                    var photoFileId = new mongoose.mongo.BSONPure.ObjectID(product.indexImgIds[0]._id);
                    gfs.remove({_id:photoFileId, root:'productPhoto'}, function(){
                    });
                  }
                  if(product.indexImgIds){
                    product.indexImgIds.pop();
                  }
                  product.indexImgIds.push(writestream.id);
                  product.save(function(err){
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
          res.send(500 , {
            success:false,
            "message":"文件太大，请小于4M"
          });
        }else{
          res.send(200, {
            success:true
          });
        }
    });
};



//上传产品Tab中轮播等点击开后的图片
exports.uploadProductPhotoInTab = function(req, res) {
    var product_id = req.param("productId");
    var tabIndex = req.param("tabIndex");
    console.log(product_id);

    flow.post(req, function(status, filename, original_filename, identifier) {

        if(status=="done"){
          //fs.createReadStream('D:/test.jpg').pipe(writestream);
          var writeTmpImgStream = fs.createWriteStream("./tmp/flow-"+identifier+"tmp");

          flow.write(identifier, writeTmpImgStream, {
            onDone:function(){
              //将文件写入gridfs
              var writestream = gfs.createWriteStream({
                filename: filename, // a filename
                mode: 'w+', // default value: w+, possible options: w, w+ or r, see [GridStore](http://mongodb.github.com/node-mongodb-native/api-generated/gridstore.html)
               //chunkSize: 1024,
               // content_type: 'image/jpeg', // For content_type to work properly, set "mode"-option to "w" too!
                root: 'productPhotoInTab'
              });

              // var writeTmpImgStreamSmall = fs.createWriteStream("./flow-"+identifier+"tmp");
              //将原图缩小后，放入gridfs中
              imageMagick("./tmp/flow-"+identifier+"tmp")
              .scale('810', '810')
              .stream().pipe(writestream)
              .on('close', function () {
                fs.unlink("./tmp/flow-"+identifier+"tmp");
              });

              /*(function (err, stdout, stderr) {
                stdout.pipe(writestream);
              });*/

              //清除文件夹中已经存入数据库的文件
              flow.clean(identifier);
              //删除原有的产品图片，录入新图片
              ProductInfo.findOne({_id:product_id}, function (err, product) {
                if(product){
                  //找到对应的tabIndex的图片scroll
                  for(var i=0; i<product.scrollPics.length; i++){
                    if(product.scrollPics[i].orderIndex==tabIndex){
                        product.scrollPics[i].picIds.push(writestream.id);
                    }
                  }

                  product.save(function(err){
                    if(!err) {
                      res.json({success:true,picId:writestream.id});
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
          res.send(500, {
            success:false,
            "message":"文件太大，请小于4M"
          });
        }else{
          res.send(200, {
            success:true
          });
        }
    });
};


//获取tab页中的轮播图片
exports.getProductPhotoInTab = function(req, res){
  var photoFileId = req.param("photoFileId");
    if(photoFileId && photoFileId.trim()){
      var readstream = gfs.createReadStream({
        _id: req.param("photoFileId"),
        root:'productPhotoInTab'
      });
      readstream.pipe(res);
      readstream.on('error', function (error){
        res.redirect("/images/common/404.gif");
      });
    }else{
        res.redirect("/images/common/404.gif");
    }
};


exports.deleteProductPhotoInTab = function(req, res){
  var product_id = req.param("productId");
  var tabIndex = req.param("tabIndex");
  var photoFileId = req.param("fileId");

  console.log(product_id+"----"+tabIndex+"----"+photoFileId);
  try{
      //删除原有的产品图片，录入新图片
    ProductInfo.findOne({_id:product_id}, function (err, product) {
      if(product){
        //找到对应的tabIndex的图片scroll

        //删除product中的链接
         for(var i=0; i<product.scrollPics.length; i++){
            if(product.scrollPics[i].orderIndex==tabIndex){
                for(var j=0; j<product.scrollPics[i].picIds.length; j++){
                  if(photoFileId == product.scrollPics[i].picIds[j]){
                    product.scrollPics[i].picIds.splice(j, 1);
                    //delete $scope.isolatePicScrollModel.picIds[i];
                  }
                }
            }
          }


        product.save(function(err){
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

    //删除gfs中的文件
    gfs.remove({_id:photoFileId, root:'productPhotoInTab'}, function(){
    });
  }catch(e){
    console.log(e);
    res.json({success:false, message:"内部错误!"});
  }



};
