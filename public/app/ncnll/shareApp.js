(function(){
	var ncnllApp=angular.module("ncnll", ["ngRoute", "componentDirective", "modalComponentDirective", 'shareProductCtrl', 'headAndFootCtl']);
    //全局的配置文件放这里！
    ncnllApp.run(function($rootScope) {
        $rootScope.globalConfig={
          tabImagePath : "http://192.168.1.105:8091/images/"
        };
    })
	ncnllApp.config(["$routeProvider", "$locationProvider", 
    function($routeProvider, $locationProvider) {
		    $routeProvider.when('/', {
            templateUrl: '/app/ncnll/views/share/share.html',
            controller: 'shareCtrl'
        }).otherwise({
            redirectTo: '/'
        });
        $locationProvider.html5Mode(false);
        $locationProvider.hashPrefix('!');
	}]);

})();


