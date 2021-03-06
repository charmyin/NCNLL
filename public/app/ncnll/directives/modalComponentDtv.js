(function(){
	var modalComponentDirective=angular.module("modalComponentDirective", ["ui-rangeSlider"]);

	//按天计算的历史图片slider
	modalComponentDirective.directive('cmngHistoryImage', ["$http", function($http) {
		function link(scope, element, attrs) {

      //获取数据
       $http.post('/imageInfo/searchHistoryImageList', {"cameraSerialId":scope.$parent.item.cameraId,"startTime":scope.$parent.item.startTime,"endTime":scope.$parent.item.endTime}).success(function(data){
          if(data.success){
            scope.allData = data.rows;
            scope.imgName = data.rows[data.rows.length-1].path;
            scope.currentImageTime = data.rows[data.rows.length-1].createTime;
            scope.maxValueDate = scope.currentImageTime;
            scope.minValueDate = data.rows[0].createTime;
            scope.maxItemCount = data.rows.length;
            scope.sliderSetting = {
              valueA: data.rows.length-1,
              valueB: 3000,
              maxValue:data.rows.length-1,
              minValue:0,
              step:1
            };
            //上传时候，记录文件名称，即编号+日期+时分秒

            scope.jumpStep = 1;
            
            scope.gogogo = function(){
              var tmpCount = scope.sliderSetting.valueA+parseInt(scope.jumpStep);
              if(tmpCount<scope.sliderSetting.maxValue){
                scope.sliderSetting.valueA=tmpCount;
                scope.imgName = data.rows[tmpCount].path;
                scope.currentImageTime = data.rows[tmpCount].createTime;
              }
            };
            scope.changePic = function(){
              scope.imgName =data.rows[scope.sliderSetting.valueA].path;
              scope.currentImageTime = data.rows[scope.sliderSetting.valueA].createTime;
              scope.$apply();
            };
            scope.changePicLocal = function(){
              scope.imgName =data.rows[scope.sliderSetting.valueA].path;
              scope.currentImageTime = data.rows[scope.sliderSetting.valueA].createTime;
            };
            scope.backbackback = function(){
              var tmpCount = scope.sliderSetting.valueA-parseInt(scope.jumpStep);
              if(tmpCount>scope.sliderSetting.minValue){
                scope.sliderSetting.valueA=tmpCount;
                scope.imgName = data.rows[tmpCount].path;
                scope.currentImageTime = data.rows[tmpCount].createTime;
              }
            };

            scope.nextSlideImg  = function(){
              if(scope.sliderSetting.valueA>0){
                scope.sliderSetting.valueA--;
                scope.changePicLocal();
              }
            }

            scope.prevSlideImg = function(){
              if(scope.sliderSetting.valueA<(scope.maxItemCount-1)){
                scope.sliderSetting.valueA++;
                scope.changePicLocal();
              }
            }

          }
       });
       

	    
    }

		return {
			restrict: 'A',
			templateUrl:"/app/ncnll/views/partials/tabModal/historyImages.html",
			link:link
		};
	}]);


	modalComponentDirective.directive('cmngVideoShow', function () {
		function link(scope, element, attrs) {

	  }

		return {
			restrict: 'A',
			templateUrl:"/app/ncnll/views/partials/tabModal/videoShow.html",
			link:link
		};

	});


  //http://onehungrymind.com/demos/slider/#
	modalComponentDirective.directive('cmngImageShow',['$animate','$rootScope',function($animate, config, $rootScope) {
    this.rootScope = $rootScope;
		function link(scope, element, attrs) {
        scope.slides = [];
        for(var i=0; i<scope.item.picIds.length; i++){
          scope.slides.push({image: scope.$root.globalConfig.tabImagePath+scope.item.picIds[i], description: '图片'});
        }
       /* scope.slides = [
            {image: '/images/producers/1.jpg', description: 'Image 00'}
        ];*/
        scope.currentIndex = 0;

        scope.setCurrentSlideIndex = function (index) {
            scope.currentIndex = index;
        };

        scope.isCurrentSlideIndex = function (index) {
            return scope.currentIndex === index;
        };

        scope.prevSlide = function () {
            scope.currentIndex = (scope.currentIndex < scope.slides.length - 1) ? ++scope.currentIndex : 0;
        };

        scope.nextSlide = function () {
            scope.currentIndex = (scope.currentIndex > 0) ? --scope.currentIndex : scope.slides.length - 1;
        };
	  }

		return {
			restrict: 'A',
/*      scope:{
        isolateRealtimePics:"="
      },*/
			templateUrl:"/app/ncnll/views/partials/tabModal/imageShow.html",
			link:link
		};

	}]).animation('.cmScrollSlide-animation', function () {
        return {
            addClass: function (element, className, done) {
                if (className == 'ng-hide') {
                    TweenMax.to(element, 0.5, {left: -element.parent().width(), onComplete: done });
                }
                else {
                    done();
                }
            },
            removeClass: function (element, className, done) {
                if (className == 'ng-hide') {
                    element.removeClass('ng-hide');

                    TweenMax.set(element, { left: element.parent().width() });
                    TweenMax.to(element, 0.5, {left: 0, onComplete: done });
                }
                else {
                    done();
                }
            }
        };
    });

  modalComponentDirective.directive('cmngPraise',['$http','$window', '$rootScope', 'spinDelaySev', function($http, $window, $rootScope, spinDelaySev) {
    function link(scope, element, attrs) {

      scope.praisedUsersCount=scope.item.praisedUsers.length;

      //遍历user，如果本人存在，则：取消赞;否则：赞
      scope.praiseStr = "赞";
      scope.applauseImg = "praise";
      for(var i=0; i<scope.item.praisedUsers.length; i++){
        if(scope.item.praisedUsers[i].user == $rootScope.userInfo._id){
          scope.praiseStr = "消赞";
          scope.applauseImg = "praised";
        }
      }

      scope.praiseProduct = function(){
        if(scope.praiseStr == "赞"){
          //ajax请求，修改本人点赞状态
          $http.post('/product/praiseOrNot', {id:scope.item._id, isPraise:true}).success(function(msg){
            //如果未登录,提示但不进行操作
            if(!msg.success){
              var overlay = spinDelaySev(msg.message);
              $window.setTimeout(function() {
                overlay.update({
                  icon: "/vendors/iosOverlay/img/cross.png",
                  text: msg.message
                });
              }, 5);
              $window.setTimeout(function() {
                overlay.hide();
              }, 2e3);
              return;
            }
            //if(msg)
            scope.praiseStr = "消赞";
            scope.applauseImg = "praised";
            scope.praisedUsersCount++;
          }).error(function(data, status, headers, config) {
            //如果未登录,提示但不进行操作
              var overlay = spinDelaySev("内部错误");
              $window.setTimeout(function() {
                overlay.update({
                  icon: "/vendors/iosOverlay/img/cross.png",
                  text: "内部错误"
                });
              }, 5);
              $window.setTimeout(function() {
                overlay.hide();
              }, 2e3);

          });

        }else{
          //ajax请求，修改本人点赞状态
          $http.post('/product/praiseOrNot', {id:scope.item._id, isPraise:false}).success(function(msg){
            //如果未登录,提示但不进行操作
            if(!msg.success){
              var overlay = spinDelaySev(msg.message);
              $window.setTimeout(function() {
                overlay.update({
                  icon: "/vendors/iosOverlay/img/cross.png",
                  text: msg.message
                });
              }, 5);
              $window.setTimeout(function() {
                overlay.hide();
              }, 2e3);
              return;
            }
            scope.praisedUsersCount--;
            scope.praiseStr = "赞";
            scope.applauseImg = "praise";
          });

        }
      };


    }

    return {
      restrict: 'E',
      replace: true,
      template:'<a href="javascript:void(0);"  ng-click="praiseProduct();" class="praiseProductLink" style="float:left;min-width:50px;margin-left:10px;"><img ng-src="/images/productManage/{{applauseImg}}.png" style="height:20px;width:20px;float:left;" /> <span style="float:right;"> {{praiseStr}}(<strong>{{praisedUsersCount}}</strong>)</span></a>',
      link:link
    };

  }]);

  modalComponentDirective.directive('cmngStore',['$http','$window', '$rootScope','spinDelaySev', function($http,$window,$rootScope,spinDelaySev) {
    function link(scope, element, attrs) {
      //初始化
/*      scope.imagePathStore = "/images/productManage/store.png";
      scope.storedStr = "收藏";
      scope.productStored = false;

      if($rootScope.userInfo.storedProducts){
          for(var i=0; i<$rootScope.userInfo.storedProducts.length; i++){
            if($rootScope.userInfo.storedProducts[i]._id == scope.item._id){
                scope.productStored = true;
            }
          }
        }
*/
      $rootScope.$on('reloadStoredStatusEvent', function() {
         scope.productStored = false;
          if($rootScope.userInfo.storedProducts){
             for(var i=0; i<$rootScope.userInfo.storedProducts.length; i++){
                if($rootScope.userInfo.storedProducts[i]._id == scope.item._id){
                    scope.productStored = true;
                }
             }
           }
      });

      //初始化状态触发事件
      $rootScope.$emit('reloadStoredStatusEvent');

      scope.storeProduct = function(){
        $http.post('/user/storeProduct', scope.item).success(function(msg){
            //如果未登录,提示但不进行操作
            if(!msg.success){
              var overlay = spinDelaySev(msg.message);
              $window.setTimeout(function() {
                overlay.update({
                  icon: "/vendors/iosOverlay/img/cross.png",
                  text: msg.message
                });
              }, 5);
              $window.setTimeout(function() {
                overlay.hide();
              }, 2e3);
              return;
            }
            $rootScope.userInfo = msg.userInfo;
            //if(msg)
            if(msg.stored){
              /*scope.imagePathStore = "/images/productManage/stored.png";
              scope.storedStr = "已收藏";*/
              scope.productStored = true;
            }else{
       /*       scope.imagePathStore = "/images/productManage/store.png";
                scope.storedStr = "收藏";*/
              scope.productStored = false;
            }

            $rootScope.$emit('reloadStoredStatusEvent');

            /*scope.praiseStr = "取消赞";
            scope.praisedUsersCount++;*/
          }).error(function(data, status, headers, config) {
            //如果未登录,提示但不进行操作
              var overlay = spinDelaySev("内部错误");
              $window.setTimeout(function() {
                overlay.update({
                  icon: "/vendors/iosOverlay/img/cross.png",
                  text: "内部错误"
                });
              }, 5);
              $window.setTimeout(function() {
                overlay.hide();
              }, 2e3);
          });
        };
    }

    return {
      restrict: 'E',
      replace: true,
      template:'<a href="javascript:void(0);" ng-click="storeProduct();" class="praiseProductLink" style="float:left;min-width:50px;margin-left:10px;"><img ng-show="productStored" src="/images/productManage/stored.png" style="height:20px;width:20px;float:left;" /> <img ng-hide="productStored" src="/images/productManage/store.png" style="height:20px;width:20px;float:left;" /><span ng-show="productStored" style="float:right;">已收藏</span> <span ng-hide="productStored" style="float:right;">收藏</span></a>',
      link:link
    };

  }]);

})();




/*  //按今天时间来获取图片slider
  modalComponentDirective.directive('cmngTodayImage', function () {
    function link(scope, element, attrs) {
      scope.initSrc = "images/index/3.jpg";
      //初始图片
        //时间轴选中日期提示
        var customToolTip = $.Link({
          target: '-tooltip-<div class="noUiSliderTooltip"></div>',
          method: function ( value ) {
            // The tooltip HTML is 'this', so additional
            // markup can be inserted here.

            $(this).html(
              '<span>2014-12-' + Math.floor(value) + '&nbsp;12:23:33</span>'
            );
          }
        });
        //TODO 通过第一次录入照片的时间和当前时间来获取差值，作为时间轴的范围

        //生成时间轴
        var slider = $(element).find("div");
        slider.noUiSlider({
          start: 1,
          behaviour: 'tap-drag',
          connect: "lower",
          step: 1,
          range: {
            'min': 1,
            'max': 3
          },
          serialization: {
            lower: [ customToolTip ]
          },
          format: {
            encoder: function( value ){
              return Math.floor(value);
            }
          }
        }).change(function(){
        //  var now = new Date();
          var nameValue = Math.floor(slider.val());
          //scope.initSrc = "/images/index/"+nameValue+".jpg";
          $(element).find("img").attr("src","/images/index/"+nameValue+".jpg");
        });
      //slider.attr("src","images/producers/dp2.jpg");
    }

    return {
      restrict: 'A',
      templateUrl:"/app/ncnll/views/partials/historyImages.html",
      link:link
    };

  });
*/
