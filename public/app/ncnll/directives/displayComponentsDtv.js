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

	//分享单个商品
	 //单个展示模块点击后，弹出的modal
	componentDirective.directive('cmngShareProductInfo', function () {
		return {
			restrict: 'A',
			templateUrl:"/app/ncnll/views/share/shareProductInfo.html"
		};
	});

})();
