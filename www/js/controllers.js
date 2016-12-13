angular.module('starter.controllers', [])
  .controller('StartCtrl', function($scope, $data, $rootScope, $timeout, $state) {
    $scope.init = function() {
      if ($data.storeData('isLogin') == 'yes') {
        console.log(1);
        return;
      }
    };
    $scope.init();
    $scope.goLogin = function() {
      $state.go('login')
    };
    $rootScope.goRegister = function() {
      $state.go('register')
    }
  })
  .controller('LoginCtrl', function($scope, $rootScope, $state, $data, $ionicLoading, $timeout) {
    $scope.init = function() {
      $scope.LoseFocus = function() {
        $("#Contents").hide();
      };
      $scope.PasswordLoseFocus = function() {
        $("#Passwords").hide();
      };
      $scope.ObtainFocus = function() {
        $("#Contents").show();
      };
      $scope.PasswordFocus = function() {
        $("#Passwords").show();
      };
    };
    $scope.init();
    $scope.user = {
      username: '',
      password: ''
    };
    $scope.deletesContents = function() {
      $scope.user.username = "";
    };
    $scope.deletePasswords = function() {
      $scope.user.password = '';
    };
    $scope.verification = function() {
      $scope.user.username = $('#login-username').val();
      $scope.user.password = $('#login-password').val();
      if ($scope.user.username == null || $scope.user.username.length == 0 || $scope.user.password == null || $scope.user.password.length == 0) {
        $data.loadingShow("手机号用户名或密码不能为空");
        return;
      }
      console.log($scope.user);
      $data.login($scope.user).success(function(data, status, headers, config) {
        console.log(data);
        if (data.status == 1) {
          $data.loadingShow("成功登录");
          $data.storeData('userInfo', data);
          $data.storeData('isLogin', 'yes');
          $data.storeData('username', $scope.user.username);
          $state.go('tab.dash');
        } else if (data.status == 0) {
          $data.loadingShow("用户名或密码错误");
        } else {
          $data.loadingShow("登录失败，请重试");
        }
      }).error(function(data) {
        $data.loadingShow("网络连接错误");
      })
    }
  })

.controller('RegisterCtrl', function($scope, $data, $rootScope, $state, $ionicLoading, $timeout) {
  $scope.verification = function() {
    $state.go('register-second', {
      username: $('#first-username').val(),
      password: $('#first-password').val(),
      cpassword: $('#first-cpassword').val()
    });
    $rootScope.username = $('#first-username').val();
    $rootScope.password = $('#first-password').val();
    $rootScope.cpassword = $('#first-cpassword').val();
  }
})

.controller('registerSecondCtrl', function($scope, $data, $rootScope, $state, $ionicLoading, $timeout, $stateParams) {
  $scope.verification = function() {
    $scope.data = {};
    $scope.data.username = $rootScope.username;
    $scope.data.password = $rootScope.password;
    $scope.data.cpassword = $scope.cpassword;
    $scope.data.name = $('#username').val();
    $scope.data.phone = $('#phonenumber').val();
    $scope.data.sex = 1;
    $scope.data.province = '';
    $scope.data.city = '';
    $scope.data.district = '';
    $scope.data.type = 3;
    $scope.data.company = '山东淄博台';
    $scope.data.department = '所属部门';
    $scope.data.position = '职位';
    $data.registerSecond($scope.data).success(function(data) {
      console.log(data);
      $state.go('tab.dash');
    })
  }
  $data.getCityList({
    parent: 3
  }).success(function(data) {
    console.log(data);
  })
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