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


          //console.log(scope.allTabs)
          var html = '<div id="cmng-tab-modal" cmng-tab-modal></div>';

          // Step 1: parse HTML into DOM element
          var template = angular.element(html);
          // Step 2: compile the template and link the compiled template with the scope.
          var linkFnelement = $compile(template)(scope, function(clonedElement, scopeTmp) {
            //需要延时1毫秒，等待渲染成功
            setTimeout(function(){
              // Step 4: Append to DOM
              //attach the clone to DOM document at the right place
              $("body").append(clonedElement);
              $('#myModal').modal('show');

              //清除modal中的所有内容
              $('#myModal').on('hidden.bs.modal', function (e) {
                $(linkFnelement).remove();
                $(clonedElement).remove();
                delete linkFnelement;
                delete clonedElement;
                if($('#cmng-tab-modal')){
                  $('#cmng-tab-modal').remove();
                }
              });
              scope.$digest();
            },200);
          });
      };
    }]);

})();
