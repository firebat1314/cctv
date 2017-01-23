angular.module('news-controllers',[])

.controller('NewsCtrl', function($ionicHistory,$scope, $data, $rootScope, $state, $ionicLoading, $timeout, $stateParams, $ionicPopup, $ionicBackdrop, $ionicPopover, $window, $ionicScrollDelegate, $ionicPosition,$ionicSlideBoxDelegate) {

  $data.getBanner().success(function(data){
    console.log(data);
    $scope.bannerList = data.data;  
    $ionicSlideBoxDelegate.update();
     $ionicSlideBoxDelegate.$getByHandle("slideboximgs").loop(true);
  });     
  $scope.goNewDetailPage = function(catid) {
    if(catid != undefined){
      $state.go('tab.new-detail', {
        chatId: catid
      })
    }
  };
  $scope.doRefresh = function() {
    $timeout(function(){
      $data.getHomeData()
      .success(function(newItems) {
        console.log(newItems);
        if(newItems.status == '1'){
          $scope.Items = newItems;
          $data.storeData('homeData',newItems);
        }
      })
      .error(function() {
        $data.loadingShow('更新失败');
        $scope.Items = $data.storeData('homeData');
      })
      .finally(function() {
        $scope.$broadcast('scroll.refreshComplete');
      });     
    },100)
  };
  $scope.doRefresh();

  $scope.pageStatus = function(index){
      $ionicSlideBoxDelegate.$getByHandle('importance').slide(index);
  }
  $scope.slideHasChanged = function($index){
      $('.button-list-wrap').children().eq($index).addClass('selected').siblings().removeClass('selected');
  }
})

.controller('NewDetailCtrl', function($scope, $data, $rootScope, $state, $ionicLoading, $timeout, $stateParams, $ionicPopup, $ionicBackdrop, $ionicPopover, $window, $ionicScrollDelegate, $ionicPosition, $ionicHistory) {
  $scope.chatIdName = $stateParams.chatId;
  $data.getNewsDetails($scope.chatIdName).success(function(res) {
    console.log(res);
    $scope.details = res;
  });
  $scope.goBack = function() {
    $ionicHistory.goBack();
  }
})