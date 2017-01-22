angular.module('starter.controllers', ['user-controllers','news-controllers'])
  .controller('StartCtrl', function($scope, $data, $rootScope, $timeout, $state) {
      $scope.goLogin = function() {
        $state.go('login')
      };
      $rootScope.goRegister = function() {
        $state.go('register')
      }
  })
  .controller('LoginCtrl', function($scope, $rootScope, $state, $data, $ionicLoading, $timeout) {
    $scope.$on('$ionicView.beforeEnter',function(){
      if ($data.storeData('isLogin') == 'yes') {
        console.log('登录状态：'+$data.storeData('isLogin'));
        $state.go('tab.news')
      };
    })
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
      username: $data.storeData('username')||'',
      password: ''
    };
    $scope.deletesContents = function() {
      $scope.user.username = "";
    };
    $scope.deletePasswords = function() {
      $scope.user.password = '';
    };
    $scope.verification = function() {
      console.log($scope.user);
      if ($scope.user.username == null || $scope.user.username.length == 0 || $scope.user.password == null || $scope.user.password.length == 0) {
        $data.loadingShow("手机号用户名或密码不能为空");
        return;
      };
      $scope.status = true;//按钮提交状态 true为禁用
      $timeout(function(){
         $data.login($scope.user).success(function(data, status, headers, config,$ionicLoading) {
           $data.loadingShow(data.info);
           $scope.status = false;//按钮提交状态
           if (data.status == 1) {
             $data.storeData('userInfo', data);
             $data.storeData('isLogin', 'yes');
             $data.storeData('username', $scope.user.username);
             $state.go('tab.news');
           }
         }).error(function(data) {
           $data.loadingShow("网络连接错误");
         })
      },300)
    };
    $scope.findPassword = function(){
      $data.findPassword().success(function(data){
        alert(data.info);
      })     
    }
  })

.controller('RegisterCtrl', function($scope, $data, $rootScope, $state, $ionicLoading, $timeout) {
  $scope.verification = function() {
    $state.go('register-second');
    $rootScope.username = $('#first-username').val();
    $rootScope.password = $('#first-password').val();
    $rootScope.cpassword = $('#first-cpassword').val();
  }
})

.controller('registerSecondCtrl', function($scope, $data, $rootScope, $state, $ionicLoading, $timeout, $stateParams, $ionicPopup, $ionicBackdrop, $ionicPopover) {
  $scope.verification = function() {
    $scope.data = {
      username: /*$rootScope.username*/'sunshanshan',
      password: /*$rootScope.password*/'sss123456',
      cpassword: /*$scope.cpassword*/'sss123456',
      name: /*$('#username').val()*/'山',
      mobile:/* $('#phonenumber').val()*/'13100668641',
      sex: 1,
      province: '1',
      city: '37',
      district: '568',
      type: '1',
      company: '山东淄博台',
      department: '所属部门',
      position: '职位'
    };
    console.log($scope.data);
    $data.registerSecond($scope.data).success(function(data) {
      console.log(data);
      if(data.status==1){
        $scope.showCacheDialog();
      }else{
        $data.loadingShow('注册失败')
      }
      
    })
  };
  //弹出确认框
  $scope.showCacheDialog = function() {
    $ionicPopup.confirm({
      title: '注册成功',
      template: '是否确认提交?',
      buttons: [{
        text: '<b>确定</b>',
        type: 'button-positive',
        onTap: function(event) {
          $state.go('tab.news');
        }
      }, {
        text: '取消'
      }]
    })
  };
  
})



.controller('SubmissionCtrl', function($scope, $data, $rootScope, $state, $ionicLoading, $timeout, $stateParams, $ionicPopup, $ionicBackdrop, $ionicPopover, $ionicTabsDelegate) {
  //  当页面活动执行事件
  //  $scope.$on('$ionicView.enter', function(e) {});
  $data.addNews({}).success(function(data){
    console.log(data);
  })


})



