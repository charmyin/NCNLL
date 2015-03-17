(function(){
  var displayController=angular.module("displayCtl", ["modalSev", 'spinDelayMod', 'ngTouch']);

  /************************首页head类别*******************************/
  displayController.controller("headCategoryCtrl",['$scope','$http',function($scope,$http){
    $http.get("/product/allCategories").success(function(data){
      if(data.success)
      $scope.categories=data.categories;
    }).error(function(err){

    });
  }]);


  /************************首页Body************************/
  displayController.controller('viewCtrl', ['$scope','$http', '$compile', '$window', 'modalGenerateSev', function ($scope, $http, $compile, $window, modalGenerateSev) {

    $http.get("/indexData").success(function(data){
        $scope.indexData=data;
    });

    //渲染展示用modal，并显示
    $scope.openModal = function(item){
      modalGenerateSev($scope, item);
    };
  }]);

  /************************右侧菜单栏************************/
  displayController.controller('rightNavbarCtl', ['$scope','$location', '$rootScope', '$http', 'spinDelaySev', '$window', function ($scope,$location, $rootScope, $http, spinDelaySev, $window) {
    //是否登录成功
    $scope.loginSuccessfully=false;
    $http.get("/userSessionInfo").success(function(data){
      $rootScope.userInfo=data;
      if(data.username){
        $scope.username=data.username;
        $scope.loginSuccessfully=true;
      }else{
        $scope.loginSuccessfully=false;
      }

    });
    //登录成功事件
    $rootScope.$on('loginSuccessEvent', function(event,user) {
      $scope.loginSuccessfully=true;
      $scope.username = user.username;
    });

    //登出,退出登录
    $scope.logout=function(){
      var overlay = spinDelaySev("注销中...");

      $http.get("/logout").success(function(data){
        $window.setTimeout(function() {
          overlay.update({
            icon: "/vendors/iosOverlay/img/check.png",
            text: "退出成功!"
          });
        }, 500);
        $window.location.reload();
        $rootScope.userInfo = undefined;
        $scope.loginSuccessfully=false;
        $location.path("/");
        $("#loginModal input[type='password']").each(function(){
          this.value="";
        });
        $window.setTimeout(function() {
          overlay.hide();
        }, 2e3);
      });
    };
  }]);

    /************************用户登录Modal************************/
  displayController.controller('loginCtrl', ['$scope','$location','$http', '$rootScope', '$window', 'spinDelaySev', function ($scope, $location, $http, $rootScope, $window, spinDelaySev) {
    $scope.formData = {};
    $scope.loginSuccessfully=true;
    $scope.loginErrorClass="alert-danger";

    $scope.processForm = function(){
      //注册登录modal关闭事件
      $("#loginErrorDiv").hide();
      $http({
        method  : 'POST',
        url     : '/signup',
        data    : $.param($scope.formData),  // pass in data as strings
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
      }).success(function(data) {
          var overlay = spinDelaySev("登录中...");
          if (!data.success) {
            overlay.hide();
            $scope.errorinfo = data.error;
            $scope.loginSuccessfully = false;
            $("#loginErrorDiv").show("fast");
          } else {
            $rootScope.userInfo = data.userInfo;
            $window.setTimeout(function() {
              overlay.update({
                icon: "/vendors/iosOverlay/img/check.png",
                text: "登录成功!"
              });
            }, 500);
            $window.setTimeout(function() {
              overlay.hide();
            }, 2e3);
            $rootScope.$emit('loginSuccessEvent', data.user);
            $scope.loginSuccessfully = true;
            $window.location.reload();
            $("#loginModal").modal("hide");
          }

        });
    };

     //显示用户注册
    $scope.userRegister=function(){
      $("#loginModal").modal("hide");
      $location.path('/producerRegist');
    };

    //显示找回密码
    $scope.getLostPassword=function(){
      $("#loginModal").modal("hide");
      $location.path('/getLostPassword');
    };
  }]);

  /***********************用户注册modal控制****************************/
  displayController.controller('userRegisterCtrl', ['$scope','$location','$window','$http', '$rootScope', function ($scope,$location, $window, $http, $rootScope) {

    $scope.user = {};

    $scope.registedSuccessfully=false;

    //测试用数据
    /*   $scope.user.email ="charmyin@gmail.com";
    $scope.user.username ="charmyin@gmail.com";*/

     //显示用户注册
    $scope.userRegister=function(){
      $("#loginModal").modal("hide");
      $location.path('/producerRegist');
    };

    $scope.submitForm=function(){
      $scope.emailError = false;
      $scope.errorInfo = "";
      var parameters = $.param($scope.user);
      $http({
        url: "/userRegister",
        data: parameters,
        method: 'POST',
        headers : {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
      }).success(function(data){
        if(data.error&&data.error.email){
           $scope.emailError= true;
           $scope.errorInfo = data.error.email.message;
        }
        if(data.success){
          //modal显示成功信息
          $scope.registedSuccessfully = true;
        }
      }).error(function(err){

      });
    };
    //提交成功后，按确认按钮，跳转至首页, 并显示登录信息
    $scope.nextToIndexPage = function(){
     //跳转至先前页面
      $window.history.go(-1);
      //head中登录状态需要改变
      //页面头，显示用户登录信息
      $rootScope.$emit('loginSuccessEvent', $scope.user);
    };
  }]);

  /***********************用户信息更改**********************/
  displayController.controller('userInfoUpdateCtrl', ['$scope', '$http', '$window', 'spinDelaySev', '$rootScope', function ($scope, $http, $window, spinDelaySev, $rootScope) {
    $scope.userInfo={};
    //初始化用户信息
    $http.get("/userSessionInfo").success(function(data){
        $scope.userInfo=data;
    });

    $scope.saveUserInfo = function(){
      var overlay = spinDelaySev("保存中...");
      $http({
        url:"/updateUserInfo",
        data:$.param($scope.userInfo),
        method:"POST",
        headers:{'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
      }).success(function(data){
        if(data.success){
          $window.setTimeout(function() {
            overlay.update({
              icon: "/vendors/iosOverlay/img/check.png",
              text: "保存成功！"
            });
          }, 1e3);
          //更新状态
          $rootScope.$emit('loginSuccessEvent', {username:$scope.userInfo.username});
        }else{
          $window.setTimeout(function() {
            overlay.update({
              icon: "/vendors/iosOverlay/img/cross.png",
              text: "内部错误！"
            });
          }, 1e3);
        }

        $window.setTimeout(function() {
          overlay.hide();
        }, 2e3);
      }).error(function(){
        $window.setTimeout(function() {
          overlay.update({
            icon: "/vendors/iosOverlay/img/cross.png",
            text: "内部错误！"
          });
        }, 1e3);
        $window.setTimeout(function() {
          overlay.hide();
        }, 2e3);
      });
    };

  }]);

  /*********************用户密码更改********************************/
  displayController.controller('userPasswordChangeCtrl', ['$scope', '$http', '$compile', '$window', 'spinDelaySev', function($scope, $http, $compile, $window, spinDelaySev){
    $scope.user = {};

    $scope.submitForm = function(){
      var overlay = spinDelaySev("保存中...");
      $http({
        url:"/changePassword",
        method:"POST",
        data:$.param($scope.user),
        headers:{'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
      }).success(function(data){
        if(data.success){
          $window.setTimeout(function() {
            overlay.update({
              icon: "/vendors/iosOverlay/img/check.png",
              text: "保存成功！"
            });
          }, 1e3);
        }else{
          $window.setTimeout(function() {
            overlay.update({
              icon: "/vendors/iosOverlay/img/cross.png",
              text: data.message
            });
          }, 1e3);
        }

        $window.setTimeout(function() {
          overlay.hide();
        }, 2e3);
      }).error(function(){
        $window.setTimeout(function() {
          overlay.update({
            icon: "/vendors/iosOverlay/img/cross.png",
            text: "内部错误！"
          });
        }, 1e3);
        $window.setTimeout(function() {
          overlay.hide();
        }, 2e3);
      });
    };
  }]);


  /***********************获取所有分类数据**********************/
  displayController.controller('allCategoryCtrl', ['$scope','$http', '$compile', '$window', 'modalGenerateSev', function ($scope, $http, $compile, $window, modalGenerateSev) {
    $http.get("/product/getLimitedElementByCategory").success(function(data){
        $scope.indexData=data.categories;
    });
    //渲染展示用modal，并显示
    $scope.openModal = function(item){
      modalGenerateSev($scope, item);
    };
  }]);

  /***********************获取单个分类数据，并展示，此处需要有分页功能***********************/
  displayController.controller('singleCategoryCtrl', ['$scope','$http', '$compile', '$window', 'modalGenerateSev', '$routeParams', 'spinDelaySev', function ($scope, $http, $compile, $window, modalGenerateSev, $routeParams, spinDelaySev) {
    //隐藏更多标志
    $scope.hideMoreButton = true;
    $http.get("/product/category/"+$routeParams._id).success(function(data){
        $scope.indexData=data.productInfos;
        if(data.productInfos[0].items.length == 0){
          var overlay = spinDelaySev("载入中...");

          $window.setTimeout(function() {
            overlay.update({
              icon: "/vendors/iosOverlay/img/cross.png",
              text: "无内容！"
            });
          }, 100);

          $window.setTimeout(function() {
            overlay.hide();
          }, 2e3);

        }
    });

    //渲染展示用modal，并显示
    $scope.openModal = function(item){
      modalGenerateSev($scope, item);
    };
  }]);


  /***********************获取所有生产者数据***********************/
  displayController.controller('allProducersCtrl', ['$scope','$http', '$compile', '$window', '$location',  function ($scope, $http, $compile, $window, modalGenerateSev, $location) {
        //隐藏更多标志
    /*$scope.hideMoreButton = true;*/
    $http.get("/producer/all").success(function(data){
        $scope.producersData=data.producers;
    });
   /* //打开单一用户产品介绍页面
    $scope.openModal = function(item){
      $window.location="#!/producer/products/"+item._id;
    };*/
  }]);


  /************************按id获取一位生产者数据***********************/
  displayController.controller('producerMainpageCtrl', ['$scope','$http', '$compile', '$window', 'modalGenerateSev', '$routeParams', function ($scope, $http, $compile, $window, modalGenerateSev, $routeParams) {
    //隐藏更多标志
    $scope.hideMoreButton = true;
    var producer_id = $routeParams._id;
    //console.log(producer_id);
    $http.get(("/products/getProductsByProducer/"+producer_id)).success(function(data){
        //data.categories
        $scope.indexData=data.categories;
        data.brandInfo.user.imgPath = "/user/photoid/"+data.brandInfo.user.userPhotoID;
        data.brandInfo.brandInfoPhotoPath = "/brand/photoid/"+data.brandInfo.brandPhotoIds[0];
        $scope.brandInfo = data.brandInfo;

    });
    //渲染展示用modal，并显示
    $scope.openModal = function(item){
      modalGenerateSev($scope, item);
    };
  }]);


  /************************按id获取一位生产者数据************************/
  displayController.controller('producerCategoryCtrl', ['$scope','$http', '$compile', '$window', function ($scope, $http, $compile, $window) {
    //隐藏更多标志
    $scope.hideMoreButton = true;
    $http.get("/indexData").success(function(data){
        $scope.indexData=data;
    });
    //此处不打开modal，直接连接至生产者首页
    /*$scope.openModal = function(item){
      $window.location=("#!/producer/products/"+item._id);
    };*/
  }]);

  /*******#########################产品管理Controller#############################*******/


  /***************************用户品牌管理*******************************/
  displayController.controller('brandInfoCtrl', ['$scope', '$http', 'spinDelaySev', '$window', function($scope, $http, spinDelaySev, $window){
    $scope.brand={};

    $http.get("/getBrandInfo").success(function(data){
      if(data.success){
        $scope.brand = data.brand;
      }else{

      }

    }).error(function(err){

    });

    $scope.submitForm = function(){
      var overlay = spinDelaySev("保存中...");
      $http({
        url:"/saveBrandInfo",
        data:$.param($scope.brand),
        method:"POST",
        headers:{'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
      }).success(function(data){
        if(data.success){
          $window.setTimeout(function() {
            overlay.update({
              icon: "/vendors/iosOverlay/img/check.png",
              text: "保存成功！"
            });
          }, 1e3);
        }else{
          $window.setTimeout(function() {
            overlay.update({
              icon: "/vendors/iosOverlay/img/cross.png",
              text: "内部错误！"
            });
          }, 1e3);
        }

        $window.setTimeout(function() {
          overlay.hide();
        }, 2e3);


      }).error(function(data){
        $window.setTimeout(function() {
          overlay.update({
            icon: "/vendors/iosOverlay/img/cross.png",
            text: "内部错误！"
          });
        }, 1e3);
        $window.setTimeout(function() {
          overlay.hide();
        }, 2e3);

      });
    };
  }]);

  /************************按id生成用户产品管理首页************************/
  displayController.controller('productManageCtrl', ['$scope','$http', '$compile', '$window', 'modalEditGenerateSev','modalGenerateSev','addTabInModalSev', 'spinDelaySev', function ($scope, $http, $compile, $window, modalEditGenerateSev,modalGenerateSev, addTabInModalSev, spinDelaySev) {

    $scope.basicInfo={};

    //tab管理页面,添加一个tab页面
    $scope.addTabInModalSev = function(templateIndex){
      addTabInModalSev($scope, templateIndex);
    };

    //modal中选中的tab页面
    $scope.selectedTab = 1;

    //载入baasicInfo
    $scope.picScroll={
      picsTitle:"",
      description:""
    };
    $scope.realtimePicsModel={
      picsTitle:"",
      realtimeID:"",
      description:""
    };
    $scope.videoUpload={
      videoTitle:"",
      videoLink:"",
      description:""
    };


    //隐藏更多标志
    $scope.hideMoreButton = true;
    $http.get("/products/getUserProducts").success(function(data){
        $scope.products=data;
    });


    /*$scope.testValue=;*/

    //渲染展示用modal，并显示
    $scope.openModal = function(item){
      modalGenerateSev($scope, item);
    };

    //渲染编辑用modal，并显示
    $scope.openEditModal = function(item){

      $scope.basicInfo = {};
      if(!item){
        item={};
        item.operationName="新增";
      }else{
        item.operationName="修改";
      }
      modalEditGenerateSev($scope, item);
      $scope.basicInfo = item;
    };

    //删除管理页面首页产品项目
    $scope.deleteItem = function(item){
      $http({
        url:"/products/deleteById",
        data:{"_id":item._id},
        method:"POST",
        headers:{'Content-Type':'application/json; charset=UTF-8'}
      }).success(function(data){
         console.log(data);
      });
      item.isdeleted=true;
      //$window.alert(item.name);
    };

  }]);

  /*********************产品类别管理********************/

  displayController.controller("productCategoryManage", ['$scope', '$window' , '$http', function($scope, $window, $http){
    /*$scope.categories=[
      {categoryName:'aaa',categoryOrderIndex:0},
      {categoryName:'bbbb',categoryOrderIndex:1},
      {categoryName:'ccc',categoryOrderIndex:2}
    ];*/
    $http.get("/product/allCategories").success(function(data){
      if(data.success)
      $scope.categories=data.categories;
    }).error(function(err){

    });
    //按排列的序号删除元素，按_id删除
    $scope.remove = function(category){
      //获取当前点击元素位置
      var itemPosition =  $scope.categories.indexOf(category);
      //删除该元素
      if(~itemPosition)$scope.categories.splice(itemPosition, 1);
    };
    //排序上升
    $scope.goUpside = function(category){
      var itemPosition =  $scope.categories.indexOf(category);
      var tmpEle = $scope.categories[itemPosition];
      if(itemPosition>0){
        $scope.categories[itemPosition]=$scope.categories[itemPosition-1];
        $scope.categories[itemPosition-1] = tmpEle;
        for (var i = 0; i < $scope.categories.length; i++) {
          $scope.categories[i].categoryOrderIndex = i;
        }
      }
    };

    //排序下降
    $scope.goDownside = function(category){
      var itemPosition =  $scope.categories.indexOf(category);
      var tmpEle = $scope.categories[itemPosition];
      if((itemPosition+1) < $scope.categories.length){
        $scope.categories[itemPosition]=$scope.categories[itemPosition+1];
        $scope.categories[itemPosition+1] = tmpEle;
        for (var i = 0; i < $scope.categories.length; i++) {
          $scope.categories[i].categoryOrderIndex = i;
        }
      }
    };

    $scope.addCategory = function(){
      $scope.categories.push({readonly:false, categoryOrderIndex:$scope.categories.length});
    };

    //保存category
    $scope.submitForm = function(){
      $http({
        url:"/product/category/save",
        data:$scope.categories,
        method:"POST",
        headers:"headers:{'Content-Type':'application/json; charset=UTF-8'}"
      }).success(function(data){
        console.log(data);
      }).error(function(data){
        console.log(data);
      });
    };

  }]);


  /***********************获取收藏列表***********************/
  displayController.controller('storagedProductCtrl', ['$scope','$http', '$compile', '$window', 'modalGenerateSev', '$routeParams', 'spinDelaySev', function ($scope, $http, $compile, $window, modalGenerateSev, $routeParams, spinDelaySev) {
    //隐藏更多标志
    $scope.hideMoreButton = true;
    $http.get("/user/getStoredProducts").success(function(data){
        $scope.data=data;
        if(data.length == 0){
          var overlay = spinDelaySev("载入中...");

          $window.setTimeout(function() {
            overlay.update({
              icon: "/vendors/iosOverlay/img/cross.png",
              text: "无内容！"
            });
          }, 100);

          $window.setTimeout(function() {
            overlay.hide();
          }, 2e3);

        }
        console.log(data);
    });

    //渲染展示用modal，并显示
    $scope.openModal = function(item){
      modalGenerateSev($scope, item);
    };
  }]);


})();




