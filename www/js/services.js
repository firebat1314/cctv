angular.module('starter.services', [])
  .service('$data', function($rootScope, $http, $window, $ionicLoading, $timeout,$ionicPopup) {
    var ip = 'http://cctvnnn.ivtime.net';
    return {
      //登录请求
      login: function(data) {
        return $http({
          method: "POST",
          url: ip + "/Login/index",
          data: data
        });
      },
      //注册信息提交接口(第二步)
      registerSecond: function(data) {
        return $http({
          method: 'POST',
          url: ip + "/Login/registerInfo",
          data: data
        })
      },
      //地区列表
      getCityList: function(data) {
        return $http({
          method: 'get',
          url: ip + '、Public/public_getRegion',
          data: data
        })
      },
      //找回密码
      findPassword: function(data) {
        return $http({
          method: 'GET',
          url: ip + "/Login/findPwd",
          data: data
        })
      },
      //个人资料
      selfInfo: function(data) {
        return $http({
          method: 'GET',
          url: ip + "/User/info",
          data: data
        })
      },
      //提示框
      loadingShow: function(str) {
        $ionicLoading.show({
          template: str,
          showBackdrop: false
        });
        $timeout(function() {
          $ionicLoading.hide();
        }, 1500);
      },
      //数据存储与获取
      storeData: function(key, data) {
        if (data) {
          return $window.localStorage[key] = angular.toJson(data);
        } else {
          return (key && angular.fromJson($window.localStorage[key])) || {};
        }
      },
      //删除某个
      remove: function(key) {
        $window.localStorage.removeItem(key);
      },
      //清空
      clear: function() {
        $window.localStorage.clear();
      }
    }
  });