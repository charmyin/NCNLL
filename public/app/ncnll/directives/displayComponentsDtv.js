(function(){
	var componentDirective=angular.module("componentDirective", []);
	/*componentDirective.directive('cmngThumbnail', function () {
		return {
			restrict: 'A',
			templateUrl:"/app/ncnll/views/partials/thumbnail.html"
		};
	});*/
	//种类中，单个产品的展示模块
	componentDirective.directive('cmngCategory', function () {
		return {
			restrict: 'A',
			templateUrl:"/app/ncnll/views/partials/category.html"
		};
	});

	//在用户单独产品介绍中，产品的展示模板
	componentDirective.directive('cmngSingleUserCategory', function () {
		return {
			restrict: 'A',
			templateUrl:"/app/ncnll/views/producers/productTemplate.html"
		};
	});

  //单个展示模块点击后，弹出的modal
	componentDirective.directive('cmngTabModal', function () {
		return {
			restrict: 'A',
			templateUrl:"/app/ncnll/views/partials/tabModal/tabModal.html"
		};
	});

	//种类中，单个产品的展示模块
	componentDirective.directive('cmngProducer', function () {
		return {
			restrict: 'A',
			templateUrl:"/app/ncnll/views/producers/producer.html"
		};
	});

	/****************用户产品管理模块*****************/
	componentDirective.directive("cmngProductManageItem", function(){
		return {
				restrict:"A",
				templateUrl:"/app/ncnll/views/productManage/partials/productManageItem.html"
		};
	});

	/*******************删除当前模块dtv********************/
	componentDirective.directive("cmngRemoveMe", function($rootScope){
		return {
				restrict:"A",
				scope: false,
				transclude: false,
				link:function(scope,element,attrs){
								element.bind("click",function() {
									//alert(scope.selectedTab);
								  //$("#tabHead1").remove();
								  //remove tab head
								  var tabDivId = "tabHead"+$(element).parent().parent().parent().attr("tabIndex");
                  $("#"+tabDivId).parent().remove();

                  //remove tab body
									$(element).parent().parent().parent().remove();

                  //默认选中1
                  $("#tabHead1").trigger("click");
                });
				}
		};
	});

	/*********************TabEditModal*******************************/
	//单个产品管理模块点击后，弹出的modal
	componentDirective.directive('cmngTabEditModal', function () {
		function link(scope,element,attrs){
			scope.selectedTab = 1;
		}
		return {
			restrict: 'A',
			controller:['$scope', '$http', '$element', '$window', 'spinDelaySev', 'addTabInModalSev', function($scope,$http, $element, $window, spinDelaySev, addTabInModalSev){

					$http.get("/product/allCategories").success(function(data){
			      if(data.success)
			      $scope.categories=data.categories;
			    }).error(function(err){

			    });


			    //改变上传路径，带上产品信息
			    $scope.beforeUploadImg = function(flow){
			    	flow.opts.target = '/prodouct/uploadProductPhoto/' + $scope.productBasicInfoAttr._id;

			    };

					  //保存基本信息
				    $scope.submitForm = function(){
				      console.log($scope.productBasicInfoAttr);
				      var overlay = spinDelaySev("保存中...");
				      $http({
				        url:"/products/saveProductBasicInfo",
				        data:$scope.productBasicInfoAttr,
				        method:"POST",
				        headers:{'Content-Type':'application/json; charset=UTF-8'}
				      }).success(function(data){
				        $window.setTimeout(function() {
				          overlay.update({
				            icon: "/vendors/iosOverlay/img/check.png",
				            text: "保存成功！"
				          });
				        }, 1e3);
				        $scope.productBasicInfoAttr = data.productInfo;
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
			}],
			scope:{
				productBasicInfoAttr : "=",
				addTabInModalSevAttr : "=",
				selectedTab : "=selectedTabAttr"
			},
			templateUrl:"/app/ncnll/views/productManage/partials/tabEditModal.html",
			link:link
		};
	});

})();
