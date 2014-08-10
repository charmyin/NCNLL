(function(){
	var ncnllApp=angular.module("ncnll", ["ngRoute", "componentDirective", "modalComponentDirective", 'displayCtl', 'flow']);
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
        }).when('/producerManage/:userId', {
            templateUrl: '/app/ncnll/views/productManage/productManageIndex.html',
            controller: 'productManageCtrl'
        }).when('/producer/brandManage/:userid', {
            templateUrl: '/app/ncnll/views/producerInfo/brandInfoManage.html'
        }).when('/producer/infoManage/:userId', {
            templateUrl: '/app/ncnll/views/producerInfo/infoManage.html',
            controller: 'userInfoUpdateCtrl'
        }).when('/producer/changePassword/:userid', {
            templateUrl: '/app/ncnll/views/producerInfo/changePassword.html'
        }).when('/producerRegist', {
            templateUrl: '/app/ncnll/views/producerInfo/userRegist.html'
        }).when('/getLostPassword', {
            templateUrl: '/app/ncnll/views/producerInfo/getLostPassword.html'
        }).when('/product/categoryManage', {
            templateUrl: '/app/ncnll/views/productManage/productCategoryManage.html',
            controller:'productCategoryManage'
        }).when('/product/category/:_id', {
            templateUrl: '/app/ncnll/views/singleCategoryBody.html',
            controller:'singleCategoryCtrl'
        }).otherwise({
            redirectTo: '/'
        });
       $locationProvider.html5Mode(false);
       $locationProvider.hashPrefix('!');
	}]);

})();


