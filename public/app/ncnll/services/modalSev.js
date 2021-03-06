(function(){
    var modalSev = angular.module('modalSev', []);
    modalSev.factory('modalGenerateSev', ["$compile", '$sce', "$http", function($compile, $sce, $http) {
      return function(scope, item){
          //渲染展示用modal，并显示
          //根据data生成modal

         //记录产品阅读次数
         $http.post('/productInfo/increaseBrowseCount', {"id":item._id}).success(function(data){
            if(data.success){
              if(item.browseCount){
                 item.browseCount= item.browseCount+1;
               }else{
                 item.browseCount=1;
               }
            }
         });

          scope.trustSrc = function(src) {
            return $sce.trustAsResourceUrl(src);
          };

          scope.item = item;
          scope.allTabs = [];
          //不改变原来的数组，返回一个副本
          scope.allTabs = scope.allTabs.concat(item.realtimePics);
          scope.allTabs=scope.allTabs.concat(item.timelapseVideos);
          scope.allTabs=scope.allTabs.concat(item.scrollPics);
          scope.selectedTab = 1;
          //Tab排序
          scope.allTabs = scope.allTabs.sort(function(a, b) {
              var x = a["orderIndex"];
              var y = b["orderIndex"];
              return ((x < y) ? -1 : ((x > y) ? 1 : 0));
          });

          //tab单击时候加载图片
          scope.doSomething = function(index){
            $($(".modalTabContent")[index-1]).find("img").each(function(){
              $(this).attr("src",$(this).attr("ng-srcd"));
            });
          }
          //
          if(scope.dataType=="shareType"){
            var html = '<div id="cmng-share-product-info" cmng-share-product-info></div>';
            var template = angular.element(html);
            var linkFnelement = $compile(template)(scope, function(clonedElement, scopeTmp) {
            //需要延时1毫秒，等待渲染成功
            $("#productInfoDiv").html(clonedElement);
          });
            return; 
          }
          //console.log(scope.allTabs)
          var html = '<div id="cmng-tab-modal" cmng-tab-modal></div>';
          // Step 1: parse HTML into DOM element
          var template = angular.element(html);
          // Step 2: compile the template and link the compiled template with the scope.
          var linkFnelement = $compile(template)(scope, function(clonedElement, scopeTmp) {
            //需要延时1毫秒，等待渲染成功
            $("#myModal").html(clonedElement);
            $('#myModal').modal('show');
          });
      };
    }]);

})();
