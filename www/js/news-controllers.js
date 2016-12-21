angular.module('news-controllers',[])

.controller('NewsCtrl', function($scope, $data, $rootScope, $state, $ionicLoading, $timeout, $stateParams, $ionicPopup, $ionicBackdrop, $ionicPopover, $window, $ionicScrollDelegate, $ionicPosition) {
  $scope.mySwiper = new Swiper('.swiper-container', {
    autoplay: 2000,
    loop: true,
  });
  $scope.addClass = function(e, name) {
    $(e.target).addClass('selected').siblings().removeClass('selected');
    $ionicScrollDelegate.scrollTo(0, $ionicPosition.offset($(name)).top - 50, true)
  };
  if ($data.storeData('homedata')) {
    $scope.Items = $data.storeData('homedata');
  }
  $data.getHomeData().success(function(data) {
    $scope.Items = data;
    $data.storeData('homedata', data)
  });
  $scope.goNewDetailPage = function(catid) {
    $state.go('tab.new-detail', {
      chatId: catid
    })
  }
  $scope.doRefresh = function() {
    $data.getHomeData()
      .success(function(newItems) {
        $scope.Items = newItems;
      })
      .error(function() {
        $data.loadingShow('刷新失败');
      })
      .finally(function() {
        $scope.$broadcast('scroll.refreshComplete');
      });
  };
})

.controller('NewDetailCtrl', function($scope, $data, $rootScope, $state, $ionicLoading, $timeout, $stateParams, $ionicPopup, $ionicBackdrop, $ionicPopover, $window, $ionicScrollDelegate, $ionicPosition, $ionicHistory) {
  $scope.chatIdName = $stateParams.chatId;
  $data.getNewsDetails($scope.chatIdName).success(function(res) {
    console.log(res);
    $scope.details = res;
  });
  $rootScope.goBack = function() {
    $ionicHistory.goBack();
  }
})