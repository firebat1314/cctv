angular.module('starter.services', [])
  .service('$data', function($rootScope, $http, $window, $ionicLoading, $timeout, $ionicPopup) {
    var ip = 'http://cctvnnn.ivtime.net';
    //http://cctvnnn.ivtime.net/ManageApp/Login/index
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
          url: ip + "/ManageApp/Login/index",
          data: data,
          timeout: 5000
        });
      },
      //注册信息提交接口(第二步)
      registerSecond: function(data) {
        return $http({
          method: 'POST',
          url: ip + "/ManageApp/Login/registerInfo",
          data: data,
          timeout: 5000
        })
      },
      //地区列表
      getCityList: function(parent, type) {
        return $http({
          method: 'get',
          url: ip + '/ManageApp/Public/public_getRegion?parent=' + parent + '&type=' + type,
          timeout: 5000
        })
      },
      //获取资讯
      getMessage: function(data) {
        return $http({
          method: 'GET',
          url: ip + '/ManageApp/Index/lists?catid=' + data,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa(storeData('userInfo').data.token+':')
          }
        })
      },
      //首页数据
      getHomeData: function(data) {
        return $http({
          method: 'GET',
          url: ip,
          headers: {
            'Authorization': 'Basic ' + btoa(storeData('userInfo').data.token+':')
          }
        })
      },
      //新闻详情
      getNewsDetails: function(data) {
        return $http({
          method: 'GET',
          url: ip + '/ManageApp/Index/view?id=' + data,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa(storeData('userInfo').data.token+':')
          }
        })
      },
      //找回密码
      findPassword: function(data) {
        return $http({
          method: 'GET',
          url: ip + "/ManageApp/Login/findPwd",
          timeout: 5000
        })
      },
      //会员数据统计
      vipInfoStatistics:function(){
        return $http({
          method:'GET',
          url:ip+'/ManageApp/User/userCount',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa(storeData('userInfo').data.token+':')
          },
          timeout: 5000
        })     
      },
      //个人资料
      selfInfo: function(data) {
        return $http({
          method: 'GET',
          url: ip + "/ManageApp/User/info",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa(storeData('userInfo').data.token+':')
          },
          timeout: 5000
        })
      },
      //报题详情
      getTitleDetails: function(data) {
        return $http({
          method: 'get',
          url: ip + '/ManageApp/Baoti/view',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa(storeData('userInfo').data.token+':')
          },
          timeout: 5000
        })
      },
      //添加新闻
      addNews:function(data){
         return $http({
          method: 'POST',
          url: ip + '/ManageApp/Baoti/add',
          data:data,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa(storeData('userInfo').data.token+':')
          },
          timeout: 5000
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