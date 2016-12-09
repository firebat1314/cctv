angular.module('starter.controllers', [])
.controller('StartCtrl',function($scope,$data,$rootScope,$timeout,$state){
  $scope.init = function(){
    if($data.storeData('isLogin') == 'yes'){
      console.log(1);
      return;
    }
  };
  $scope.init();
  $scope.goLogin = function(){
    $state.go('login')
  };
  $rootScope.goRegister = function(){
    $state.go('register')
  }
})
.controller('LoginCtrl',function($scope,$rootScope,$state,$data, $ionicLoading, $timeout){
    $scope.init = function(){
      $scope.LoseFocus = function () {
          $("#Contents").hide();
      };
      $scope.PasswordLoseFocus = function () {
          $("#Passwords").hide();
      };
      $scope.ObtainFocus = function () {
          $("#Contents").show();
      };
      $scope.PasswordFocus = function () {
          $("#Passwords").show();
      };   
    };
    $scope.init();
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
          console.log(data);
          if(data.status == 1){
            $scope.loadingShow("成功登录");
            $data.storeData('userInfo',data);
            $data.storeData('isLogin','yes');
            $data.storeData('username',$scope.user.username);
            $state.go('tab.dash');
          }else if(data.status == 0){
            $scope.loadingShow("用户名或密码错误");
          }else {
            $scope.loadingShow("登录失败，请重试");
          }
      }).error(function(data){
          $scope.loadingShow("网络连接错误");
      })
    }
})

.controller('RegisterCtrl',function($scope,$data, $rootScope, $state, $ionicLoading,$timeout){
    $scope.verification = function(){
      $data.registerFirst({
        username:$scope.username,
        password:$scope.password,
        cpassword:$scope.repassword
      }).success(function(data,status,headers,config){
          console.log(data);
      })     
    }
})

.controller('DashCtrl', function($scope) {
    

})

.controller('ChatsCtrl', function($scope) {
  //  当页面活动执行事件
  //  $scope.$on('$ionicView.enter', function(e) {});

})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {

})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
