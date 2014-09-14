(function(){
    var modalSev = angular.module('modalSev', []);
    modalSev.factory('modalGenerateSev', ["$compile", function($compile) {
      return function(scope, item){
          //渲染展示用modal，并显示
          //根据data生成modal
         //console.log(item)
          scope.selectedItem = item;
          scope.allTabs = [];
          scope.allTabs = scope.allTabs.concat(item.realtimePics);
          scope.allTabs=scope.allTabs.concat(item.timelapseVideos);
          scope.allTabs=scope.allTabs.concat(item.scrollPics);
          scope.selectedTab = 1;
          console.log(scope.allTabs)
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
            },200);
          });
      };
    }]);

    /*******************新增，修改产品的modal***********************/
    modalSev.factory('modalEditGenerateSev',  ["$compile", '$window', 'addTabInModalSev', '$route', function($compile, $window, addTabInModalSev, $route) {
      return function(outScope, item){

          var html = '<div id="cmng-tab-edit-modal" selected-tab-attr="selectedTab" cmng-tab-edit-modal product-basic-info-attr="basicInfo" add-tab-in-modal-sev-attr="addTabInModalSev"></div>';

          // Step 1: parse HTML into DOM element
          var template = angular.element(html);
          // Step 2: compile the template and link the compiled template with the scope.

          var linkFnelement = $compile(template)(outScope, function(clonedElement, scope) {
            //按照item包含的tab内容添加tab项
            $("body").append(clonedElement);
            //需要延时1毫秒，等待渲染成功
            setTimeout(function(){
              //alert(scope.selectedItem.name);
              // Step 4: Append to DOM
              //attach the clone to DOM document at the right place

              $('#myEditModal').modal('show');

              //清除modal中的所有内容
              $('#myEditModal').on('hidden.bs.modal', function (e) {
                $(linkFnelement).remove();
                $(clonedElement).remove();
                /*delete linkFnelement;
                delete clonedElement;*/
                if($('#cmng-tab-edit-modal')){
                  $('#cmng-tab-edit-modal').remove();
                }
              });
              //Sort array by orderindex
              var itemArray = [];
              if(item.scrollPics && item.scrollPics[0]){
                itemArray=itemArray.concat(item.scrollPics);
              }
              if(item.realtimePics && item.realtimePics[0]){
                itemArray=itemArray.concat(item.realtimePics);
              }
              if(item.timelapseVideos && item.timelapseVideos[0]){
                itemArray=itemArray.concat(item.timelapseVideos);
              }
              itemArray = itemArray.sort(function(a, b) {
                  var x = a["orderIndex"];
                  var y = b["orderIndex"];
                  return ((x < y) ? -1 : ((x > y) ? 1 : 0));
              });
              //存入全局变量中
              outScope.basicInfo.itemArray = itemArray;

              for(var i = 0; i < itemArray.length ; i++){
                addTabInModalSev(outScope, itemArray[i].tabType, itemArray[i].orderIndex);
              }

              $("#myEditModal").on("hide.bs.modal", function(){
                /* $location.path("/producerManage/:userId");
                 console.log("-------------");*/
                 $route.reload();
              });
            },200);
          });
      };
    }]);
    /*******************新添新的tab页，templateIndex=0时-图片轮播，=1-视频，=2-实时图片, content:tab内容对象***********************/
    modalSev.factory('addTabInModalSev',  ["$compile", function($compile) {
      return function(scope, templateIndex, lastTabIndexPlusOne){
          //Tab index

          var tabTitleArray = ['轮播图片', '视频', '实时图像'];

          //获取最后一个tab标签头上的id编号,  并加上1
          if(!lastTabIndexPlusOne){
           lastTabIndexPlusOne =parseInt($(".tabHeadLink:last").attr('id').split("Head")[1])+1;
          }
          var html = '<li ng-class="{active: selectedTab == '+lastTabIndexPlusOne+'}" ><a style="cursor:pointer;" class="tabHeadLink" ng-click="selectedTab = '+lastTabIndexPlusOne+'" id="tabHead'+lastTabIndexPlusOne+'">'+tabTitleArray[templateIndex]+'</a></li>';
          //当前的index
          scope.currentIndex = lastTabIndexPlusOne;
          //var tabHtml = '<div class="tab-content" ng-show="selectedTab == 4" ><form style="text-align:center;"><p>标题:<input type="text"/></p><p>简要描述:<textarea type="text">44444 </textarea></p><p><span>上传多图:</span><input type="file" style="display:inline-block;" /></p></form><button type="button" class="btn btn-danger" cmng-remove-me id="tabHead4-btn">删除</button></div>';
          var tabHtmlArray = ['<div tabIndex="'+lastTabIndexPlusOne+'" cmng-pic-scroll-upload isolate-pic-scroll="picScrolls" class="tab-content" ng-show="selectedTab == '+lastTabIndexPlusOne+'"  ></div>', '<div tabIndex="'+lastTabIndexPlusOne+'" cmng-video-upload isolate-video-upload="videoUpload" class="tab-content" ng-show="selectedTab ==  '+lastTabIndexPlusOne+'"></div>', '<div tabIndex="'+lastTabIndexPlusOne+'" class="tab-content" ng-show="selectedTab == '+lastTabIndexPlusOne+'" cmng-realtime-pics-upload isolate-realtime-pics="realtimePicsModel"></div>'];

          // Step 1: parse HTML into DOM element
          var template = angular.element(html);
          var tabTemplate = angular.element(tabHtmlArray[templateIndex]);
          // Step 2: compile the template and link the compiled template with the scope.

          var linkFnelement = $compile(template)(scope, function(clonedElement, scope) {

            //需要延时1毫秒，等待渲染成功
            //setTimeout(function(){
              //alert(scope.selectedItem.name);
              // Step 4: Append to DOM
              //attach the clone to DOM document at the right place
              $("#editProductModalTab").append(clonedElement);
          //  },50);
          });

          var tabLinkFnelement = $compile(tabTemplate)(scope, function(clonedElement, scope) {
            //需要延时1毫秒，等待渲染成功
           // setTimeout(function(){
              //alert(scope.selectedItem.name);
              // Step 4: Append to DOM
              //attach the clone to DOM document at the right place
              $(clonedElement).insertAfter("#editProductModalTab");
              //$("#tabHead"+lastTabIndexPlusOne).trigger("click");
            //},50);
          });
      };
    }]);

})();
