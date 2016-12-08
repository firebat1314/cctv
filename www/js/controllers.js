angular.module('starter.controllers', [])
.controller('StartCtrl',function($scope,$rootScope,$timeout,$state){
  $scope.goLogin = function(){
    $state.go('login')
  };
  $rootScope.goRegister = function(){
    $state.go('register')
  }
})
.controller('LoginCtrl',function($scope,$rootScope,$state,$data, $ionicLoading, $timeout){
    $scope.user = {
      username:'',
      password:''
    };
    $scope.deletesContents = function () {
      $scope.user.username = "";
    };
    $scope.deletePasswords = function(){
      $scope.user.password = ''; 
    };
    $scope.loadingShow = function (str) {
      $ionicLoading.show({
          template: str,
          showBackdrop: false
      });
      $timeout(function () {
          $ionicLoading.hide();
      }, 1500);
    };
    $scope.verification = function(){
      $scope.user.username = $('#login-username').val();
      $scope.user.password = $('#login-password').val();
      if ($scope.user.username == null || $scope.user.username.length == 0 || $scope.user.password == null || $scope.user.password.length == 0) {
          $scope.loadingShow("手机号用户名或密码不能为空");
          return;
      }
      console.log($scope.user);
      $data.login($scope.user).success(function(data,status,headers,config){
          console.log(data)
      }).error(function(data){
          console.log(1);
      })
    }
})

.controller('RegisterCtrl',function($scope, $rootScope, $state, $ionicLoading,$timeout){
    $scope.goBack = function(){
           
    }
})

.controller('DashCtrl', function($scope) {
    

})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
