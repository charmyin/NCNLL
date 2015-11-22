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

  /**************找回密码*****************/
  displayController.controller('getLostPasswordCtrl',['$scope', '$http', 'spinDelaySev', '$window', '$interval', function($scope, $http, spinDelaySev, $window, $interval){
    $scope.error = {"email":"","mobile":"","all":""};

    $scope.nextSendEmail = function(){
      //检验email
      var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      var isOk = re.test($scope.registEmail);
      if(!isOk){
        $scope.error.email="邮箱格式错误";
        return;
      }else{
        $scope.error.email="";
      }
      //发送邮箱
      var overlay = spinDelaySev("发送中...");
      //发送邮件
      $scope.resendTime=30;
      $interval(function(){
        $scope.resendTime--;
        if($scope.resendTime==0){
          $scope.resendTime = "";
        }
      }, 1000, 30);
      $http({
        url:"/getLostPassword",
        method:"POST",
        data: $.param({address:$scope.registEmail}),
        headers:{'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
      }).success(function(data){
        if(data.success){
          $window.setTimeout(function() {
            overlay.update({
              icon: "/vendors/iosOverlay/img/check.png",
              text: "发送成功！"
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
    }

    //重置密码
    $scope.user = {};
    $scope.postNewPwd = function(){
      var overlay = spinDelaySev("保存中...");
      if(!($scope.user.newPasswordRepeat)||!($scope.user.tempPassword)){
        $window.setTimeout(function() {
          overlay.update({
            icon: "/vendors/iosOverlay/img/cross.png",
            text: "密码不能为空！"
          });
        }, 1e3);
        $window.setTimeout(function() {
          overlay.hide();
        }, 2e3);
        return;
      }
      if($scope.user.newPasswordRepeat!=$scope.user.newPassword){
        $window.setTimeout(function() {
          overlay.update({
            icon: "/vendors/iosOverlay/img/cross.png",
            text: "密码不一致！"
          });
        }, 1e3);
        $window.setTimeout(function() {
          overlay.hide();
        }, 2e3);
        return;
      }
     
      
      $http({
        url:"/resetPassword",
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
        data.brandInfo.user.imgPath = $scope.$root.globalConfig.tabImagePath+data.brandInfo.user.userPhotoID;
        data.brandInfo.brandInfoPhotoPath = $scope.$root.globalConfig.tabImagePath+data.brandInfo.brandPhotoIds[0];
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
        //console.log(data);
    });

    //渲染展示用modal，并显示
    $scope.openModal = function(item){
      modalGenerateSev($scope, item);
    };
  }]);


})();




