angular.module('starter.services', [])
  .service('$data', function($rootScope, $http, $window, $ionicLoading, $timeout, $ionicPopup) {
    var ip = 'http://cctvnnn.ivtime.net';

    function storeData(key, data) {
      if (data) {
        return $window.localStorage[key] = angular.toJson(data);
      } else {
        return (key && angular.fromJson($window.localStorage[key])) || {};
      }
    };
    function toBase(data) {
      var toBase64Table = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
      var base64Pad = '=';
      var result = '';
      var length = data.length;
      var i;
      // Convert every three bytes to 4 ascii characters.                                                 
      for (i = 0; i < (length - 2); i += 3) {
        result += toBase64Table[data.charCodeAt(i) >> 2];
        result += toBase64Table[((data.charCodeAt(i) & 0x03) << 4) + (data.charCodeAt(i + 1) >> 4)];
        result += toBase64Table[((data.charCodeAt(i + 1) & 0x0f) << 2) + (data.charCodeAt(i + 2) >> 6)];
        result += toBase64Table[data.charCodeAt(i + 2) & 0x3f];
      }
      // Convert the remaining 1 or 2 bytes, pad out to 4 characters.                                     
      if (length % 3) {
        i = length - (length % 3);
        result += toBase64Table[data.charCodeAt(i) >> 2];
        if ((length % 3) == 2) {
          result += toBase64Table[((data.charCodeAt(i) & 0x03) << 4) + (data.charCodeAt(i + 1) >> 4)];
          result += toBase64Table[(data.charCodeAt(i + 1) & 0x0f) << 2];
          result += base64Pad;
        } else {
          result += toBase64Table[(data.charCodeAt(i) & 0x03) << 4];
          result += base64Pad + base64Pad;
        }
      }
      return result;
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
      getCityList: function(data) {
        return $http({
          method: 'get',
          url: ip + '/Public/public_getRegion',
          data: data,
          timeout: 5000
        })
      },
      getHomeData: function(data) {
        return $http({
          method: 'GET',
          url: ip,
          headers: {
            'Content-Type': 'application/json, text/plain, */*',
            'Authorization': 'Basic ' + storeData('userInfo').data.token
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