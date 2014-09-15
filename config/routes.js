/*!
 * Module dependencies.
 */

var async = require('async');


/**
 * Controllers
 */

var users = require('../app/controllers/users');
/*  , articles = require('../app/controllers/articles')
  , auth = require('./middlewares/authorization')*/
var indexRoute = require("../app/controllers/index");
var auth = require('./middlewares/authorization');
var brands = require("../app/controllers/products/brands");
var productsManage = require("../app/controllers/products/productsManage");

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

/*var flow = require("../lib/flow-node");*/
var fileUploader = require("../app/controllers/fileUpload");


/**
 * Route middlewares
 */

var articleAuth = [auth.requiresLogin, auth.article.hasAuthorization];
var commentAuth = [auth.requiresLogin, auth.comment.hasAuthorization];

/**
 * Expose routes
 */

module.exports = function (app, passport) {

    app.get("/",indexRoute.index );
    app.get("/indexData",indexRoute.indexData);
    app.get("/userProducts",indexRoute.userProducts);
    app.post("/userRegister", users.create);
    app.get("/userSessionInfo", users.userSessionInfo);
    app.get("/logout", users.logout);
    app.post('/signup',passport.authenticate('local', {
        successRedirect : '/loginSuccess',
        failureRedirect : '/loginFailed',
        failureFlash: true
    }));
    app.get('/loginSuccess', users.loginSuccess);
    app.get('/loginFailed', users.loginFailed);
    app.get('/users/:userId', users.show);
    app.post('/updateUserInfo', users.updateUserInfo);
    app.post('/changePassword', users.changePassword);
    app.post('/user/uploadUserPhoto', users.uploadUserPhoto);
    app.get('/user/photoid/:photoFileId', users.getUserPhotoByFileId);
    app.get('/user/photoid', users.getUserPhotoByFileId);

    app.post("/saveBrandInfo", brands.saveBrandInfo);
    app.get('/brand/uploadBrandPhoto', brands.uploadBrandPhotoStatus);
    app.post('/brand/uploadBrandPhoto', brands.uploadBrandPhoto);
    app.get('/brand/photoid/:photoFileId', brands.getBrandPhotoByFileId);
    app.get('/brand/photoid/', brands.getBrandPhotoByFileId);


    app.get("/getBrandInfo", brands.getBrandInfo);

    app.get("/producer/all", users.getAllProducers);

    //产品信息管理
    app.post("/products/saveProductBasicInfo", productsManage.saveProductBasicInfo);
    app.post("/products/savePicsScroll", productsManage.savePicsScroll);
    app.post("/products/removePicsScroll", productsManage.removePicsScroll);
    app.post("/products/saveVideoUpload", productsManage.saveVideoUpload);
    app.post("/products/removeVideoUpload", productsManage.removeVideoUpload);
    app.post("/products/saveRealtimePics", productsManage.saveRealtimePics);
    app.post("/products/removeRealtimePics", productsManage.removeRealtimePics);
    //产品浏览次数记录
    app.post("/productInfo/increaseBrowseCount", productsManage.increaseBrowseCount);
    //轮播器图片上传
    app.post("/products/uploadProductPhotoInTab", productsManage.uploadProductPhotoInTab);


    //Session中的user
    app.get("/products/getUserProducts",productsManage.getUserProducts);
    //按生产者ID获取产品
    app.get("/products/getProductsByProducer/:_id",productsManage.getProductsByProducer);
    app.post("/products/deleteById",productsManage.deleteById);

    app.post("/product/category/save", productsManage.saveProductCategories);
    app.get("/product/allCategories", productsManage.allCategories);
    app.get("/product/getLimitedElementByCategory", productsManage.getLimitedElementByCategory);
    app.get("/product/category/:_id", productsManage.getProductByCategory);

    //图片处理
    app.post("/prodouct/uploadProductPhoto/:product_id", productsManage.uploadProductPhoto);
    app.get("/prodouct/uploadProductPhoto/:product_id", productsManage.uploadProductPhotoStatus);
    app.get("/prodouct/getProductPhotoByFileId/:photoFileId", productsManage.getProductPhotoByFileId);
    app.get("/prodouct/getProductPhotoInTabByFileId/:photoFileId", productsManage.getProductPhotoInTab);
    app.post("/product/deleteProductPhotoInTab", productsManage.deleteProductPhotoInTab);




    //Upload and download
    app.post('/upload', multipartMiddleware, fileUploader.uploadPostedFile);
    app.get('/download/:identifier', fileUploader.downloadFile);
    app.get('/upload', fileUploader.uploadGetStatus);


/*    app.get("/userSession", user.userSession);*/

 // user routes
 /* app.get('/login', users.login)
  app.get('/signup', users.signup)
  app.get('/logout', users.logout)
  app.post('/users', users.create)
   app.post('/users/session',
    passport.authenticate('local', {
      failureRedirect: '/login',
      failureFlash: 'Invalid email or password.'
    }), users.session)
  app.get('/users/:userId', users.show)
 */
/*
  app.param('userId', users.user)
*/

  // article routes
/*
  app.param('id', articles.load)
  app.get('/articles', articles.index)
  app.get('/articles/new', auth.requiresLogin, articles.new)
  app.post('/articles', auth.requiresLogin, articles.create)
  app.get('/articles/:id', articles.show)
  app.get('/articles/:id/edit', articleAuth, articles.edit)
  app.put('/articles/:id', articleAuth, articles.update)
  app.del('/articles/:id', articleAuth, articles.destroy)
*/

  // home route
/*  app.get('/', articles.index)*/

  // comment routes
/*  var comments = require('../app/controllers/comments')
  app.param('commentId', comments.load)
  app.post('/articles/:id/comments', auth.requiresLogin, comments.create)
  app.get('/articles/:id/comments', auth.requiresLogin, comments.create)
  app.del('/articles/:id/comments/:commentId', commentAuth, comments.destroy)*/

  // tag routes
 /* var tags = require('../app/controllers/tags')
  app.get('/tags/:tag', tags.index)*/

};
