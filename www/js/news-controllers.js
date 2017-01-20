angular.module('news-controllers',[])

.controller('NewsCtrl', function($ionicHistory,$scope, $data, $rootScope, $state, $ionicLoading, $timeout, $stateParams, $ionicPopup, $ionicBackdrop, $ionicPopover, $window, $ionicScrollDelegate, $ionicPosition,$ionicSlideBoxDelegate) {
  if ($data.storeData('homedata')) {
    $scope.Items = $data.storeData('homedata');
  };
  $scope.addClass = function(e, name) {
    $(e.target).addClass('selected').siblings().removeClass('selected');
    $ionicScrollDelegate.scrollTo(0, $ionicPosition.offset($(name)).top-50, true)
  };

  $data.getHomeData().success(function(data) {
    console.log(data);
    $scope.Items = data;
    $data.storeData('homedata', data)
  });
  $data.getBanner().success(function(data){
    console.log(data);
    $scope.bannerList = data.data;  
    $ionicSlideBoxDelegate.update();
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
        $scope.Items = newItems;
      })
      .error(function() {
        $data.loadingShow('刷新失败');
      })
      .finally(function() {
        $scope.$broadcast('scroll.refreshComplete');
      });     
    },100)
  };
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