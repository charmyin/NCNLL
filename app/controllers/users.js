process.env.TMPDIR = 'tmp'; // to avoid the EXDEV rename error, see http://stackoverflow.com/q/21071303/76173


/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , User = mongoose.model('User')
  , ProductInfo = mongoose.model('ProductInfo')
  , utils = require('../../lib/utils')
  , emailUtils = require('../../lib/emailutils')
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
      success : true,
      userInfo : req.user
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

exports.getLostPassword = function(req, res){
  var password = utils.makePassword();
  req.session.tempPassword ={"createTime":new Date(), "password":password};
  //send email
  console.log(req.body.address);
  emailUtils.sendEmail(req.body.address, "你从哪里来", "秘钥找回页面", "<strong>临时秘钥为："+password+"</strong>", function(error){
    if(error){
       res.json({success:false});
     }else{
       res.json({success:true});
     }
  });
 
}

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


//收藏, 如果有重复，则删除； 删除返回FALSE； 插入返回true。
exports.storeProduct = function(req, res){
  if(!req.user){
    res.json({success:false, message:"请先登录!"});
    return;
  }

  var findIndexByProductId = function(productId, array){
    for(var i=0; i<array.length; i++){
      if(array[i]._id==productId){
        return i;
      }
    }
    return "false";
  };

  User.findOne({ _id: req.user._id}, function (err, user) {
      if(req.body._id){
        var index = findIndexByProductId(req.body._id, user.storedProducts);
        //不存在，新增
        if(isNaN(index)){
          user.storedProducts.push(req.body._id);
        }else{ //存在，删除
          user.storedProducts.splice(index, 1);
        }
        user.save(function(err){
          if(!err) {
            if(isNaN(index)){
              res.json({success:true, stored:true,userInfo:user});
            }else{
              res.json({success:true, stored:false, userInfo:user});
            }
          }
          else {
            res.json({success:false, message:"内部错误!"});
          }
        });
      }
  });
};

/**
** 获取用户存储的
**/
exports.getStoredProducts = function(req, res){
  ProductInfo.find({
    _id:{$in : req.user.storedProducts}
  }, function(err, list){
      console.log(list);
      res.json(list);
  });
};
