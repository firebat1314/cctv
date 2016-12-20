angular.module('starter.controllers', [])
  .controller('StartCtrl', function($scope, $data, $rootScope, $timeout, $state) {
    $scope.init = function() {
      if ($data.storeData('isLogin') == 'yes') {
        console.log('初始化...');
        $state.go('tab.news')
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
          $state.go('tab.news');
        } else if (data.info == "您的账户未审核") {
          $data.loadingShow("您的账户未审核");
        } else if(data.status == 0){
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
  $data.getCityList(0,1).success(function(data) {
    console.log(data);
  })
   $data.getCityList(1,2).success(function(data) {
    console.log(data);
  })
   $data.getCityList(37,3).success(function(data) {
    console.log(data);
  })
})

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

.controller('SubmissionCtrl', function($scope, $data, $rootScope, $state, $ionicLoading, $timeout, $stateParams, $ionicPopup, $ionicBackdrop, $ionicPopover, $ionicTabsDelegate) {
  //  当页面活动执行事件
  //  $scope.$on('$ionicView.enter', function(e) {});
  $data.addNews({}).success(function(data){
    console.log(data);
  })


})



.controller('AccountCtrl', function($scope, $data, $rootScope, $state, $ionicLoading, $timeout, $stateParams, $ionicPopup, $ionicBackdrop, $ionicPopover, $stateParams) {


});