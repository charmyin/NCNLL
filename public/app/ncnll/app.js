(function(){
	var ncnllApp=angular.module("ncnll", ["ngRoute", "componentDirective", "modalComponentDirective", 'displayCtl']);
    //全局的配置文件放这里！
    ncnllApp.run(function($rootScope) {
        $rootScope.globalConfig={
          tabImagePath : "http://localhost:8091/images/"
        };
    })
	ncnllApp.config(["$routeProvider", "$locationProvider", 
    function($routeProvider, $locationProvider) {
		    $routeProvider.when('/', {
            templateUrl: '/app/ncnll/views/categoriesBody.html',
            controller: 'allCategoryCtrl'
        }).when('/category', {
            templateUrl: '/app/ncnll/views/categoriesBody.html',
            controller: 'allCategoryCtrl'
        }).when('/producers', {
            templateUrl: '/app/ncnll/views/producers/producersIndexBody.html',
            controller: 'allProducersCtrl'
        }).when('/producer/products/:_id', {
            templateUrl: '/app/ncnll/views/producers/producerMainPage.html',
            controller: 'producerMainpageCtrl'
        }).when('/producerCategory/:categoryId', {
            templateUrl: '/app/ncnll/views/producers/producerCategoryBody.html',
            controller: 'producerCategoryCtrl'
        }).when('/producer/changePassword/:userid', {
            templateUrl: '/app/ncnll/views/producerInfo/changePassword.html'
        }).when('/producerRegist', {
            templateUrl: '/app/ncnll/views/producerInfo/userRegist.html'
        }).when('/getLostPassword', {
            templateUrl: '/app/ncnll/views/producerInfo/getLostPassword.html'
        }).when('/product/category/:_id', {
            templateUrl: '/app/ncnll/views/singleCategoryBody.html',
            controller:'singleCategoryCtrl'
        }).when('/products/storaged', {
            //我的收藏
            templateUrl: '/app/ncnll/views/users/storagedProducts.html',
            controller:'storagedProductCtrl'
        }).otherwise({
            redirectTo: '/'
        });
        $locationProvider.html5Mode(false);
        $locationProvider.hashPrefix('!');
	}]);

})();


