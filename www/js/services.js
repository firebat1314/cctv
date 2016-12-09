angular.module('starter.services', [])
.service('$data',function($rootScope,$http,$window){
    $rootScope.ip = 'http://cctvnnn.ivtime.net/';
    return {
      //登录请求
      login: function (data) {
          return $http({
              method: "POST",
              url: "/Login/index",
              data: data
          });
      },
      //注册信息提交接口(第一步)
      registerFirst:function(data){
          return $http({
              method: "POST",
              url: "/Login/register",
              data: data
          }); 
      },
      //注册信息提交接口(第二步)
      registerSecond:function(data){
        return $http({
          method:'POST',
          url:"/Login/registerInfo",
          data:data
        })     
      },
      //找回密码
      findPassword:function(data){
        return $http({
          method:'GET',
          url:"/Login/findPwd"
        })
      },
      //个人资料
      selfInfo:function(data){
         return $http({
          method:'GET',
          url:"/User/info"
        })
      },


      //数据存储与获取
      storeData: function(key,data){
        if(data){
          return $window.localStorage[key] = angular.toJson(data);
        }else{
          return (key && angular.fromJson($window.localStorage[key])) || {};
        }
      },
      //删除某个
      remove: function (key) {
          $window.localStorage.removeItem(key);
      },
      //清空
      clear: function () {
          $window.localStorage.clear();
      }
    }
});
