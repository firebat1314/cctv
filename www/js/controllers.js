angular.module('starter.controllers', ['user-controllers', 'news-controllers'])
    .controller('StartCtrl', function($scope, $data, $rootScope, $timeout, $state) {
        $scope.goLogin = function() {
            $state.go('login')
        };

    })
    .controller('LoginCtrl', function($scope, $rootScope, $state, $data, $ionicLoading, $timeout, $ionicPopup) {
        $scope.$on('$ionicView.beforeEnter', function() {

        })
        $rootScope.goRegister = function() {
            $state.go('register')
        }
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
            username: $data.storeData('username') || '',
            password: ''
        };
        $scope.deletesContents = function() {
            $scope.user.username = "";
        };
        $scope.deletePasswords = function() {
            $scope.user.password = '';
        };
        $scope.verification = function() {
            //console.log($scope.user);
            if ($scope.user.username == null || $scope.user.username.length == 0 || $scope.user.password == null || $scope.user.password.length == 0) {
                $data.loadingShow("手机号用户名或密码不能为空");
                return;
            };
            $scope.status = true; //按钮提交状态 true为禁用
            $timeout(function() {
                $data.login($scope.user).success(function(data, status, headers, config, $ionicLoading) {
                    $data.loadingShow(data.info);
                    $scope.status = false; //按钮提交状态
                    if (data.status == 1) {
                        $data.storeData('userInfo', data);
                        $data.storeData('isLogin', 'yes');
                        $data.storeData('username', $scope.user.username);
                        $state.go('tab.news');
                    }
                }).error(function(data) {
                    $data.loadingShow("网络连接错误");
                    $scope.status = false; //按钮提交状态
                })
            }, 300)
        };
        $scope.findPassword = function() {
            $data.findPassword().success(function(data) {
                var alertPopup = $ionicPopup.alert({
                    title: '提示信息',
                    template: data.info
                });
                alertPopup.then(function(res) {
                    //console.log('Thank you for click');
                });
            })
        }
    })

.controller('RegisterCtrl', function($scope, $data, $ionicPopup, $rootScope, $state, $ionicLoading, $timeout) {
    $scope.verification = function() {
        // $state.go('register-second');
        $scope.username = $('#first-username').val();
        $scope.password = $('#first-password').val();
        $scope.cpassword = $('#first-cpassword').val();
        if (!$scope.username || !$scope.password || !$scope.cpassword) {
            $data.loadingShow('填写信息有误，请正确填写');
            return
        }
        $data.registerSecond({
            name: $scope.username,
            password: $scope.username,
            cpassword: $scope.cpassword
        }).success(function(data) {
            $data.findPassword().success(function(data) {
                var alertPopup = $ionicPopup.alert({
                    title: '提示信息',
                    template: '提交成功，' + data.info.slice(6) + '开通账号'
                });
                alertPopup.then(function(res) {
                    //console.log('Thank you for click');
                });
            })
        })
    }
})

.controller('registerSecondCtrl', function($scope, $data, $rootScope, $state, $ionicLoading, $timeout, $stateParams, $ionicPopup, $ionicBackdrop, $ionicPopover) {
    $scope.verification = function() {
        $scope.data = {
            username: /*$rootScope.username*/ 'sunshanshan',
            password: /*$rootScope.password*/ 'sss123456',
            cpassword: /*$scope.cpassword*/ 'sss123456',
            name: /*$('#username').val()*/ '山',
            mobile: /* $('#phonenumber').val()*/ '13100668641',
            sex: 1,
            province: '1',
            city: '37',
            district: '568',
            type: '1',
            company: '山东淄博台',
            department: '所属部门',
            position: '职位'
        };
        //console.log($scope.data);
        $data.registerSecond($scope.data).success(function(data) {
            //console.log(data);
            if (data.status == 1) {
                $scope.showCacheDialog();
            } else {
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
    $data.addNews({}).success(function(data) {
        //console.log(data);
    })


})