process.env.TMPDIR = 'tmp'; // to avoid the EXDEV rename error, see http://stackoverflow.com/q/21071303/76173


/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , User = mongoose.model('User')
  , utils = require('../../lib/utils')
  , passport = require('passport');
var Grid = require('gridfs-stream');
var fs = require('fs');
var stream = require('stream');
var gm = require('gm');
var imageMagick = gm.subClass({ imageMagick : true });
var Query = mongoose.Query;

Grid.mongo = mongoose.mongo;

var gfs = Grid(mongoose.connection.db);

var flow = require('../../lib/flow-node.js')('tmp');



var login = function (req, res) {
  var redirectTo = req.session.returnTo ? req.session.returnTo : '/';
  delete req.session.returnTo;
  res.redirect(redirectTo);
};


/**
 * Auth callback
 */

/*exports.authCallback = login*/

/**
 * Show login form
 */
/*exports.login = function (req, res) {
  res.render('users/login', {
    title: 'Login',
    message: req.flash('error')
  })
}
*/
//Login failed
exports.loginFailed = function (req, res) {
  res.json({success:false, error:req.flash('error')[0]});
};
//Login successfully
exports.loginSuccess = function (req, res) {
 /* var redirectTo = req.session.returnTo ? req.session.returnTo : '/'
  delete req.session.returnTo
  res.redirect(redirectTo)*/
  utils.trimSensitiveUserInfo(req.user);
  res.json({success:true, user:req.user});
};


/**
 * Show sign up form
 */

exports.signup = function (req, res) {
  res.render('users/signup', {
    title: 'Sign up',
    user: new User()
  });
};

/**
 * Logout
 */

exports.logout = function (req, res) {
  req.logout();
  res.json({
      success : true
   });
};

/**
 * Session
 */

exports.session = login;

/**
 * Create user
 */

exports.create = function (req, res) {
  var user = new User(req.body);
  user.provider = 'local';
  user.save(function (err) {
    if (err) {
        res.json({
          success:false,
          error:err.errors
        });
    }
    // manually login the user once successfully signed up
    req.logIn(user, function(err) {
      if (err){
        res.json({
          success:false,
          error:err.errors
        });
      }
       res.json({
          success : true
       });
      /*return res.redirect('/')*/
    });
  });
};

/**
 *  Show profile
 */

exports.show = function (req, res) {
  var user = req.profile;
  res.render('users/show', {
    title: user.name,
    user: user
  });
};

/**
 * Find user by id
 */

exports.user = function (req, res, next, id) {
  User
    .findOne({ _id : id })
    .exec(function (err, user) {
      if (err) return next(err);
      if (!user) return next(new Error('Failed to load User ' + id));
      req.profile = user;
      next();
    });
};

//session中的user信息
exports.userSessionInfo = function(req, res){
  if(req.user){
    utils.trimSensitiveUserInfo(req.user);
    res.json(req.user);
  }else{
    res.json({"logined":false});
  }
};

/*****更新用户信息******/
exports.updateUserInfo = function(req, res){
  var userUpdate = new User(req.body);
  User.updateUserInfo(userUpdate, req.user, function(err) {
    if(!err) {
      res.json({success:true});
    }
    else {
      res.json({success:false, message:err});
    }
  });
};


/***************修改密码***************/
exports.changePassword = function(req, res){
  var oldPassword = req.body.oldPassword;
  var newPassword = req.body.newPassword;

  if(req.user.authenticate(oldPassword)){
    //update
    User.findOne({ email: req.user.email}, function (err, user) {
      user.password = newPassword;
      user.save(function(err){
        if(!err) {
          res.json({success:true});
          return;
        }
        else {
          res.json({success:false, message:"内部错误!"});
        }
      });
    });
  }else{
    //return error info
     res.json({success:false, message:'当前密码有误!'});
  }


  /*var userUpdate = new User();
  userUpdate.password = newPass
  word;
  userUpdate.salt = req.user.salt;
*/
  /*User.updateUserInfo(userUpdate, req.user, function(err) {
    if(!err) {
      res.json({success:true});
    }
    else {
      res.json({success:false, message:err});
    }
  });*/
};

//获取所有的生产者
exports.getAllProducers = function(req, res){
  //1代表生产者
  var query = User.find({"userrole":1});
  query.select('username email userrole phonenumber birthday introduction website address userPhotoID browseCount ');
  query.exec(function(err, producers){
    if(!err) {
      res.json({success:true, 'producers':[{ "items":producers}] });
    }
    else {
      res.json({success:false, message:"内部错误!"});
      //return;
    }
  });
};




// Handle cross-domain requests
exports.uploadGetStatus = function(req, res) {
         res.send(200, 404);
};

exports.getUserPhotoByFileId = function(req, res){
  var photoFileId = req.param("photoFileId");
    if(photoFileId && photoFileId.trim()){
      var readstream = gfs.createReadStream({
        _id: req.param("photoFileId"),
        root:'userPhoto'
      });
      readstream.pipe(res);
      readstream.on('error', function (error){
        res.redirect("/images/common/404.gif");
      });
    }else{
        res.redirect("/images/common/404.gif");
    }
};

//上传用户图片
exports.uploadUserPhoto = function(req, res) {

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
                root: 'userPhoto'
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
              User.findOne({ _id: req.user._id}, function (err, user) {
                  if(user && user.userPhotoID){
                    //删除数据库中的文件
                    var photoId = new mongoose.mongo.BSONPure.ObjectID(user.userPhotoID);
                      gfs.remove({_id:user.userPhotoID, root:'userPhoto'}, function(){
                    });
                  }
                  user.userPhotoID = writestream.id;
                  user.save(function(err){
                    if(!err) {
                      res.json({success:true});
                    }
                    else {
                      res.json({success:false, message:"内部错误!"});
                    }
                  });
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


