angular.module('starter.services', [])
  .factory('AuthInterceptor', function($rootScope, $q,$state) {
      return {
          request: function(config){
            /*if($localstorage.userInfo.data.token){
              config.headers['Authorization'] = 'Basic ' + btoa(storeData('userInfo').data.token + ':');
            }*/
            return config;
          },
          requestError: function(err){
            console.log(err);
            return $q.reject(err);
          },
          response: function(res){
            console.log(res);
              $state.go('/login');
            return res;

          },
          responseError: function(err){
            if(-1 === err.status) {
              // 远程服务器无响应

            } else if(500 === err.status) {
              // 处理各类自定义错误
            } else if(501 === err.status) {
              // ...
            } else if (status == 401||status == 403) {
              $state.go('/login');
            }
            return $q.reject(err);
          }
        };     
  })
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
            'Authorization': 'Basic ' + btoa(storeData('userInfo').data.token + ':')
          }
        })
      },
      //首页数据
      getHomeData: function(data) {
        return $http({
          method: 'GET',
          url: ip,
          headers: {
            'Authorization': 'Basic ' + btoa(storeData('userInfo').data.token + ':')
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
            'Authorization': 'Basic ' + btoa(storeData('userInfo').data.token + ':')
          }
        })
      },
      //6.修改密码
      revisePassword:function(data){
        return $http({
          method: 'POST',
          url: ip + '/ManageApp/User/editPwd',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa(storeData('userInfo').data.token + ':')
          },
          data:data,
          timeout: 5000
        })
      },
      //7.编辑头像
      editPic: function(data) {
        return $http({
          method: 'POST',
          url: ip + '/ManageApp/User/avatar',
          headers: {
            'Authorization': 'Basic ' + btoa(storeData('userInfo').data.token + ':')
          },
          data: data
        })
      },
      //8.资料修改
      profile:function(data){
         return $http({
          method: 'POST',
          url: ip + '/ManageApp/User/profile',
          headers: {
            'Authorization': 'Basic ' + btoa(storeData('userInfo').data.token + ':')
          },
          data: data
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
      vipInfoStatistics: function() {
        return $http({
          method: 'GET',
          url: ip + '/ManageApp/User/userCount',
          headers: {
            'Authorization': 'Basic ' + btoa(storeData('userInfo').data.token + ':')
          },
          timeout: 5000
        })
      },
      //个人资料
      userInfo: function(data) {
        return $http({
          method: 'GET',
          url: ip + "/ManageApp/User/info",
          headers: {
            'Authorization': 'Basic ' + btoa(storeData('userInfo').data.token + ':')
          },
          timeout: 5000
        })
      },
      //用户管理
      userCtrl: function(size, page) {
        return $http({
          method: 'GET',
          url: ip + '/ManageApp/User/members?size=' + size + '&page=' + page,
          headers: {
            'Authorization': 'Basic ' + btoa(storeData('userInfo').data.token + ':')
          },
          timeout: 5000
        })
      },
      //查看会员
      personalDetails: function(data) {
        return $http({
          method: 'GET',
          url: ip + '/ManageApp/User/viewMember?uid=' + data,
          headers: {
            'Authorization': 'Basic ' + btoa(storeData('userInfo').data.token + ':')
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
            'Authorization': 'Basic ' + btoa(storeData('userInfo').data.token + ':')
          },
          timeout: 5000
        })
      },
      //添加新闻
      addNews: function(data) {
        return $http({
          method: 'POST',
          url: ip + '/ManageApp/Baoti/add',
          data: data,
          headers: {
            'Authorization': 'Basic ' + btoa(storeData('userInfo').data.token + ':')
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

      //删除某个储存
      remove: function(key) {
        $window.localStorage.removeItem(key);
      },
      //清空
      clear: function() {
        $window.localStorage.clear();
      }
    }
  });