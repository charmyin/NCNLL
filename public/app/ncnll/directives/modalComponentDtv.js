(function(){
	var modalComponentDirective=angular.module("modalComponentDirective", []);

	//按天计算的历史图片slider
	modalComponentDirective.directive('cmngHistoryImage', function () {
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
			templateUrl:"/app/ncnll/views/partials/tabModal/historyImages.html",
			link:link
		};
	});


	modalComponentDirective.directive('cmngVideoShow', function () {
		function link(scope, element, attrs) {

	  }

		return {
			restrict: 'A',
			templateUrl:"/app/ncnll/views/partials/tabModal/videoShow.html",
			link:link
		};

	});

	modalComponentDirective.directive('cmngImageShow', function () {
		function link(scope, element, attrs) {

	  }

		return {
			restrict: 'A',
			templateUrl:"/app/ncnll/views/partials/tabModal/imageShow.html",
			link:link
		};

	});



  /*******************Edit modal Directive********************/
  //轮播图片上传模块
  modalComponentDirective.directive('cmngPicScrollUpload', function () {

    //移除Modal中的tab
    function removeMyself(element, scope){
      //$("#tabHead1").trigger("click");
     // angular.element('#tabHead1').trigger('click');
      var tabDivId = "tabHead"+$(element).attr("tabIndex");
      $("#"+tabDivId).parent().remove();
      //remove tab body
      $(element).remove();
      //默认选中1
      scope.$parent.selectedTab = 1;
    }

    function link(scope, element, attrs) {
      //获取到对应tabindex的tabItem
      var tabItemArray = scope.$parent.basicInfo.itemArray;
      if(tabItemArray)
        for (var i = 0; i < tabItemArray.length; i++) {
          if(tabItemArray[i].orderIndex == $(element).attr('tabIndex')){
            scope.isolatePicScrollModel = tabItemArray[i];
            break;
          }
        }
      /*var parentScopePicModel = scope.isolatePicScroll();
      scope.isolatePicScrollModel = {};
      //单独赋值
      scope.isolatePicScrollModel.description = parentScopePicModel.description;
      scope.isolatePicScrollModel.picsTitle = parentScopePicModel.picsTitle;*/
    }

    return {
      restrict: 'A',
      scope:{
        isolatePicScroll : "&",
      },
      controller:['$scope', '$http', '$element', '$window',function($scope,$http, $element, $window){
        $scope.tabIndex = $($element).attr("tabindex");

        $scope.submitForm = function(){
          $scope.isolatePicScrollModel._id = $scope.$parent.basicInfo._id;
          $scope.isolatePicScrollModel.orderIndex = $($element).attr("tabindex");
          $scope.isolatePicScrollModel.tabType = 0;
          $http({
            url:"/products/savePicsScroll",
            data:$scope.isolatePicScrollModel,
            method:"POST",
            headers:{'Content-Type':'application/json; charset=UTF-8'}
          }).success(function(data){
            console.log(data);
          }).error(function(){

          });
        };
        //通过id和tabindex删除图片gridfs，并清空轮播对象中数组中存储的内容
        $scope.deletePhotoInTab= function(picId){
          //$scope.isolatePicScrollModel._id = $scope.$parent.basicInfo._id;
          var orderIndex = $($element).attr("tabindex");
          var params = {};
          params.fileId = picId;
          params.tabIndex = orderIndex;
          params.productId = $scope.$parent.basicInfo._id;

          $http({
            url:"/product/deleteProductPhotoInTab",
            data:params,
            method:"POST",
            headers:{'Content-Type':'application/json; charset=UTF-8'}
          }).success(function(data){
            for(var i=0; i<$scope.isolatePicScrollModel.picIds.length; i++){
              if(picId == $scope.isolatePicScrollModel.picIds[i]){
                $scope.isolatePicScrollModel.picIds.splice(i, 1);
                //delete $scope.isolatePicScrollModel.picIds[i];
              }
            }
          }).error(function(){

          });
          //$scope.isolatePicScrollModel.picIds.pop();

        };

        //删除刚上传的轮播图片文件
        $scope.deleteNewUploadedPhotoInTab = function(file){
          if(file.chunks && file.chunks.length>0){

            var obj = eval("("+file.chunks[0].xhr.response+")");


            var orderIndex = $($element).attr("tabindex");
            var params = {};
            params.fileId = obj.picId;
            params.tabIndex = orderIndex;
            params.productId = $scope.$parent.basicInfo._id;

            $http({
              url:"/product/deleteProductPhotoInTab",
              data:params,
              method:"POST",
              headers:{'Content-Type':'application/json; charset=UTF-8'}
            }).success(function(data){
              //删除dom中的元素
              file.cancel();
            }).error(function(){

            });

          }

        };

        $scope.removePicsScroll = function(){
          var tempObj={};
          tempObj._id = $scope.$parent.basicInfo._id;
          tempObj.orderIndex = $($element).attr("tabindex");
          $http({
            url:"/products/removePicsScroll",
            data:tempObj,
            method:"POST",
            headers:{'Content-Type':'application/json; charset=UTF-8'}
          }).success(function(data){
            removeMyself($element, $scope);
            //移出原有数组中的item
            //var arrayPosition;
        /*    for (var i = 0; i < $scope.$parent.basicInfo.itemArray.length; i++) {
              if($scope.$parent.basicInfo.itemArray[i].orderIndex == i){
                arrayPosition=i;
              }
            }
            if ( ~arrayPosition ) $scope.$parent.basicInfo.itemArray.splice(arrayPosition, 1);
            */
            $scope.$parent.basicInfo = data.productInfo;
          }).error(function(){

          });
        };
      }],
      templateUrl:"/app/ncnll/views/productManage/partials/picScrollUploadDtv.html",
      link:link
    };
  });

  //视频上传模块
  modalComponentDirective.directive('cmngVideoUpload', function () {
      //移除Modal中的tab
      function removeMyself(element, scope){
        //$("#tabHead1").trigger("click");
       // angular.element('#tabHead1').trigger('click');
        var tabDivId = "tabHead"+$(element).attr("tabIndex");
        $("#"+tabDivId).parent().remove();
        //remove tab body
        $(element).remove();
        //默认选中1
        //scope.$parent.selectedTab = 1;
      }

      function link(scope, element, attrs){
        //获取到对应tabindex的tabItem
        var tabItemArray = scope.$parent.basicInfo.itemArray;
        if(tabItemArray)
          for (var i = 0; i < tabItemArray.length; i++) {
            if(tabItemArray[i].orderIndex == $(element).attr('tabIndex')){
              scope.videoUpload = tabItemArray[i];
              break;
            }
          }
      }
      return {
        restrict: 'A',
        controller:['$scope', '$http', '$element', '$window', function($scope,$http, $element, $window){
          $scope.submitForm = function(){
            $scope.videoUpload._id = $scope.$parent.basicInfo._id;
            $scope.videoUpload.orderIndex = $($element).attr("tabindex");
            $scope.videoUpload.tabType = 1;
            $http({
              url:"/products/saveVideoUpload",
              data:$scope.videoUpload,
              method:"POST",
              headers:{'Content-Type':'application/json; charset=UTF-8'}
            }).success(function(data){
              console.log(data);
            }).error(function(){

            });
          };
          $scope.removeVideoUpload = function(){
            var tempObj={};
            tempObj._id = $scope.$parent.basicInfo._id;
            tempObj.orderIndex = $($element).attr("tabindex");
            $http({
              url:"/products/removeVideoUpload",
              data:tempObj,
              method:"POST",
              headers:{'Content-Type':'application/json; charset=UTF-8'}
            }).success(function(data){

              removeMyself($element, $scope);
              //移出原有数组中的item
              /*var arrayPosition;
              for (var i = 0; i < $scope.$parent.basicInfo.itemArray.length; i++) {
                if($scope.$parent.basicInfo.itemArray[i].orderIndex == i){
                  arrayPosition=i;
                }
              }
              if ( ~arrayPosition ) $scope.$parent.basicInfo.itemArray.splice(arrayPosition, 1);*/
              $scope.$parent.basicInfo = data.productInfo;
            }).error(function(){

            });
          };
        }],
        scope:{
          isolateVideoUpload:"&"
        },
        templateUrl:"/app/ncnll/views/productManage/partials/videoUploadDtv.html",
        link:link
      };
  });

  //实时照片配置上传模块
  modalComponentDirective.directive('cmngRealtimePicsUpload', function () {

    //移除Modal中的tab
      function removeMyself(element, scope){
        //$("#tabHead1").trigger("click");
       // angular.element('#tabHead1').trigger('click');
        var tabDivId = "tabHead"+$(element).attr("tabIndex");
        $("#"+tabDivId).parent().remove();
        //remove tab body
        $(element).remove();
        //默认选中1
        scope.$parent.selectedTab = 1;
      }

    function link(scope, element, attrs) {
      //获取到对应tabindex的tabItem
      var tabItemArray = scope.$parent.basicInfo.itemArray;
      if(tabItemArray)
        for (var i = 0; i < tabItemArray.length; i++) {
          if(tabItemArray[i].orderIndex == $(element).attr('tabIndex')){
            scope.realtimePicsModel = tabItemArray[i];
            break;
          }
        }
    }

    return {
      restrict: 'A',
      controller:['$scope', '$http', '$element', '$window', function($scope,$http, $element, $window){

        //提交表单
        $scope.submitForm = function(){
          $scope.realtimePicsModel._id = $scope.$parent.basicInfo._id;
          $scope.realtimePicsModel.orderIndex = $($element).attr("tabindex");
          $scope.realtimePicsModel.tabType = 2;
          $http({
            url:"/products/saveRealtimePics",
            data:$scope.realtimePicsModel,
            method:"POST",
            headers:{'Content-Type':'application/json; charset=UTF-8'}
          }).success(function(data){
            console.log(data);
          }).error(function(err){
            console.log(err);
          });
        };


        //移除图片
        $scope.removeRealtimePics = function(){
          var tempObj={};
          tempObj._id = $scope.$parent.basicInfo._id;
          tempObj.orderIndex = $($element).attr("tabindex");
          $http({
            url:"/products/removeRealtimePics",
            data:tempObj,
            method:"POST",
            headers:{'Content-Type':'application/json; charset=UTF-8'}
          }).success(function(data){

            removeMyself($element, $scope);
            //移出原有数组中的item
            /*var arrayPosition;
            for (var i = 0; i < $scope.$parent.basicInfo.itemArray.length; i++) {
              if($scope.$parent.basicInfo.itemArray[i].orderIndex == i){
                arrayPosition=i;
              }
            }
            if ( ~arrayPosition ) $scope.$parent.basicInfo.itemArray.splice(arrayPosition, 1);*/
            $scope.$parent.basicInfo = data.productInfo;
          }).error(function(err){
            console.log(err);
          });
        };
      }],
      scope:{
        isolateRealtimePics:"&"
      },
      templateUrl:"/app/ncnll/views/productManage/partials/realtimePicsUploadDtv.html",
      link:link
    };

  });

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
