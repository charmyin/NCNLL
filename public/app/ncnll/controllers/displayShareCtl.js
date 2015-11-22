(function(){
  var displayController=angular.module("shareProductCtrl", ["modalSev", 'spinDelayMod', 'ngTouch']);

  /************************分享页面*******************************/
  displayController.controller("shareCtrl",['$scope','$http', 'modalGenerateSev', function($scope,$http, $modalGenerateSev){
  	$scope.dataType="shareType";

    $http.get("/product/id/5415a1ecf210cd5c13884242").success(function(data){
   
      if(data.success){
      	$modalGenerateSev($scope, data.product);
      	$scope.product =  data.product;
      }

    }).error(function(err){
    });
  }]);
})();




 

