angular.module('starter.services', [])
  .service('$data', function($rootScope, $http, $window, $ionicLoading, $timeout, $ionicPopup) {
    var ip = 'http://cctvnnn.ivtime.net';
    $rootScope.token = btoa(storeData('userInfo').data.token+':');
    function storeData(key, data) {
      if (data) {
        return $window.localStorage[key] = angular.toJson(data);
      } else {
        return (key && angular.fromJson($window.localStorage[key])) || {};
      }
    };
    return {
      //登录请求
      login: function(data) {
        return $http({
          method: "POST",
          url: ip + "/Login/index",
          data: data,
          timeout: 5000
        });
      },
      //注册信息提交接口(第二步)
      registerSecond: function(data) {
        return $http({
          method: 'POST',
          url: ip + "/Login/registerInfo",
          data: data,
          timeout: 5000
        })
      },
      //地区列表
      getCityList: function(parent,type) {
        return $http({
          method: 'get',
          url: ip + '/Public/public_getRegion?parent='+parent+'&type='+type,
          timeout: 5000
        })
      },
      //获取资讯
      getMessage:function(data){
        return $http({
          method: 'GET',
          url: ip+'/Index/lists?catid='+data,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + $rootScope.token
          }
        })
      },
      //首页数据
      getHomeData: function(data) {
        return $http({
          method: 'GET',
          url: ip,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + $rootScope.token
          }
        })
      },
       //新闻详情
      getNewsDetails:function(data){
        return $http({
          method: 'GET',
          url: ip+'/Index/view?id='+data,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + $rootScope.token
          }
        })     
      },
      //找回密码
      findPassword: function(data) {
        return $http({
          method: 'GET',
          url: ip + "/Login/findPwd",
          data: data,
          timeout: 5000
        })
      },
      //个人资料
      selfInfo: function(data) {
        return $http({
          method: 'GET',
          url: ip + "/User/info",
          data: data,
          timeout: 5000
        })
      },
      //报题详情
      getTitleDetails:function(data){
        return $http({
          method:'get',
          url:ip+'/Baoti/view',
          data:data,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + $rootScope.token
          },
          timeout:5000
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