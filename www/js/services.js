angular.module('starter.services', [])
  .factory('AuthInterceptor', function($rootScope, $q, $location) {
    return {
      request: function(config) {
        /*if($localstorage.userInfo.data.token){
          config.headers['Authorization'] = 'Basic ' + btoa(storeData('userInfo').data.token + ':');
        }*/
        return config;
      },
      requestError: function(err) {

        return $q.reject(err);
      },
      response: function(res) {

        return res;
      },
      responseError: function(err) {
        if (-1 === err.status) {
          // 远程服务器无响应

        } else if (500 === err.status) {
          // 处理各类自定义错误
        } else if (501 === err.status) {
          // ...
        } else if (err.status == 401 || err.status == 403) {
          $location.path('/start-page');

        }
        return $q.reject(err);
      }
    };
  })
  .service('$data', function($rootScope, $http, $window, $ionicLoading, $timeout, $ionicPopup) {
    var ip = 'http://cctvadmin.ivtime.net';
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
          // url: "http://cctvad nnn.ivtime.net/App/Login/index",
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
      revisePassword: function(data) {
        return $http({
          method: 'POST',
          url: ip + '/ManageApp/User/editPwd',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa(storeData('userInfo').data.token + ':')
          },
          data: data,
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
      profile: function(data) {
        return $http({
          method: 'POST',
          url: ip + '/ManageApp/User/profile',
          headers: {
            'Authorization': 'Basic ' + btoa(storeData('userInfo').data.token + ':')
          },
          data: data
        })
      },
      //编辑会员信息
      editMember:function(data){
          return $http({
            method: 'POST',
            url: ip + '/ManageApp/User/editMember',
            headers: {
              'Authorization': 'Basic ' + btoa(storeData('userInfo').data.token + ':')
            },
            data: data
          })
      },
      //17.所有报题新闻
      allNews: function(data) {
        return $http({
          method: 'GET',
          url: ip + '/ManageApp/Baoti/index',
          headers: {
            'Authorization': 'Basic ' + btoa(storeData('userInfo').data.token + ':')
          },
          params: data
        })
      },
      //18、 报题新闻详情
      newParticulars:function(data){
        return $http({
          method: 'GET',
          url: ip + '/ManageApp/Baoti/view',
          headers: {
            'Authorization': 'Basic ' + btoa(storeData('userInfo').data.token + ':')
          },
          params: data
        })
      },
      //19、所有串联单
      allChuanld:function(data){
        return $http({
          method: 'POST',
          url: ip + '/ManageApp/Chuanld/index',
          headers: {
            'Authorization': 'Basic ' + btoa(storeData('userInfo').data.token + ':')
          },
          data: data
        })
      },
      //20、收件箱
      getMessage:function(data){
        return $http({
          method: 'GET',
          url: ip + '/ManageApp/User/getMessage',
          headers: {
            'Authorization': 'Basic ' + btoa(storeData('userInfo').data.token + ':')
          },
          params: data
        })
      },
      //21、消息详情
      getMessageInfo:function(data){
        return $http({
          method: 'GET',
          url: ip + '/ManageApp/User/getMessageInfo',
          headers: {
            'Authorization': 'Basic ' + btoa(storeData('userInfo').data.token + ':')
          },
          params: data
        })
      },
      //22、批量删除消息
      delMessages:function(data){
        return $http({
          method: 'POST',
          url: ip + '/ManageApp/User/delMessage',
          headers: {
            'Authorization': 'Basic ' + btoa(storeData('userInfo').data.token + ':')
          },
          data: data
        })
      },
      //23、 删除消息
      delMessage:function(data){
        return $http({
          method: 'GET',
          url: ip + '/ManageApp/User/delMessage',
          headers: {
            'Authorization': 'Basic ' + btoa(storeData('userInfo').data.token + ':')
          },
          params: data
        })
      },
      //24、 获取资讯
      getInformationLists: function(data) {
        return $http({
          method: 'GET',
          url: ip + '/ManageApp/Index/lists?catid=' + data,
          headers: {
            'Authorization': 'Basic ' + btoa(storeData('userInfo').data.token + ':')
          }
        })
      },
      //28、 上传接口
      upload:function(data){
        return $http({
          method: 'POST',
          url: ip + '/ManageApp/Public/upload',
          headers: {
            'Authorization': 'Basic ' + btoa(storeData('userInfo').data.token + ':')
          },
          params: data
        })
      },
      //29、 会员管理
      members:function(data){
        return $http({
          method: 'GET',
          url: ip + '/ManageApp /User/members',
          headers: {
            'Authorization': 'Basic ' + btoa(storeData('userInfo').data.token + ':')
          },
          params: data
        })
      },
      //30、 查看会员
      viewMember:function(data){
        return $http({
          method: 'GET',
          url: ip + '/ManageApp/User/viewMember',
          headers: {
            'Authorization': 'Basic ' + btoa(storeData('userInfo').data.token + ':')
          },
          params: data
        })
      },
      //31、 会员组
      userGroup:function(data){
        return $http({
          method: 'GET',
          url: ip + '/ManageApp/User/userGroup',
          headers: {
            'Authorization': 'Basic ' + btoa(storeData('userInfo').data.token + ':')
          },
          params: data
        })
      },
      //32、 审核会员
      checkMember:function(data){
        return $http({
          method: 'POST',
          url: ip + '/ManageApp/User/checkMember',
          headers: {
            'Authorization': 'Basic ' + btoa(storeData('userInfo').data.token + ':')
          },
          data: data
        })
      },
      //33、 名片盒
      mingPH:function(data){
        return $http({
          method: 'GET',
          url: ip + '/ManageApp/User/mingPH',
          headers: {
            'Authorization': 'Basic ' + btoa(storeData('userInfo').data.token + ':')
          },
          params: data
        })
      },
      //34、 查看名片盒
      mingPHG:function(data){
        return $http({
          method: 'GET',
          url: ip + '/ManageApp/User/mingPHG',
          headers: {
            'Authorization': 'Basic ' + btoa(storeData('userInfo').data.token + ':')
          },
          params: data
        })
      },
      //35、 名片盒组
      userGroup:function(data){
        return $http({
          method: 'GET',
          url: ip + '/ManageApp/User/userGroup',
          headers: {
            'Authorization': 'Basic ' + btoa(storeData('userInfo').data.token + ':')
          },
          params: data
        })
      },
      //36、 已报题单
      yBaoti:function(data){
        return $http({
          method: 'GET',
          url: ip + '/ManageApp/Baoti/ybaoti',
          headers: {
            'Authorization': 'Basic ' + btoa(storeData('userInfo').data.token + ':')
          },
          params: data
        })
      },
      //37、 已划题单
      yHuati:function(data){
        return $http({
          method: 'GET',
          url: ip + '/ManageApp/Huati/index',
          headers: {
            'Authorization': 'Basic ' + btoa(storeData('userInfo').data.token + ':')
          },
          params: data
        })
      },
      //38、 播出单
      yBochu:function(data){
        return $http({
          method: 'GET',
          url: ip + '/ManageApp/Bochu/index',
          headers: {
            'Authorization': 'Basic ' + btoa(storeData('userInfo').data.token + ':')
          },
          params: data
        })
      },
      //39、 （1）报题操作（获取报题标题和内容）
      BaotiHandle:function(data){
        return $http({
          method: 'GET',
          url: ip + '/ManageApp/Baoti/baoti',
          headers: {
            'Authorization': 'Basic ' + btoa(storeData('userInfo').data.token + ':')
          },
          params: data
        })
      },
      //（2）报题操作（报题和不通过）
      BaotiHandlePass:function(data){
        return $http({
          method: 'POST',
          url: ip + '/ManageApp/Baoti/baoti',
          headers: {
            'Authorization': 'Basic ' + btoa(storeData('userInfo').data.token + ':')
          },
          data: data
        })
      },

      //（3）报题操作（约视频）
      BaotiHandleVideo:function(data){
        return $http({
          method: 'GET',
          url: ip + '/ManageApp/Baoti/yuesp',
          headers: {
            'Authorization': 'Basic ' + btoa(storeData('userInfo').data.token + ':')
          },
          params: data
        })
      },
      //40、 （1）串联单操作（约稿和不通过）
      ChuanldStatus:function(type,params,data){
        return $http({
          method: type,
          url: ip + '/ManageApp/Chuanld/status',
          headers: {
            'Authorization': 'Basic ' + btoa(storeData('userInfo').data.token + ':')
          },
          params: params,
          data:data
        })
      },
      //(2)串联单批量不通过操作
      batchBTG: function(data) {
        return $http({
          method: 'POST',
          url: ip + '/ManageApp/Chuanld/batchBTG',
          headers: {
            'Authorization': 'Basic ' + btoa(storeData('userInfo').data.token + ':')
          },
          data: data
        })
      },
      //已报题单操作（划题和不通过）
      BaotiCZ:function(data){
        return $http({
          method: 'POST',
          url: ip + '/ManageApp/Baoti/huati',
          headers: {
            'Authorization': 'Basic ' + btoa(storeData('userInfo').data.token + ':')
          },
          data: data
        })     
      },
      GetBaotiContent:function(data){
        return $http({
          method: 'get',
          url: ip + '/ManageApp/Baoti/huati',
          headers: {
            'Authorization': 'Basic ' + btoa(storeData('userInfo').data.token + ':')
          },
          params: data
        })     
      },
      //已报题单批量不通过操作
      batchHT:function(data){
        return $http({
          method: 'POST',
          url: ip + '/ManageApp/Baoti/batchHT',
          headers: {
            'Authorization': 'Basic ' + btoa(storeData('userInfo').data.token + ':')
          },
          data: data
        })     
      },
      //42、 （1）已划题单操作（添加播出和不通过）
      HuatiCZ:function(data){
        return $http({
          method: 'POST',
          url: ip + '/ManageApp/Huati/bochu',
          headers: {
            'Authorization': 'Basic ' + btoa(storeData('userInfo').data.token + ':')
          },
          data: data
        })     
      },
      getHuatiCZ:function(data){
        return $http({
          method: 'GET',
          url: ip + '/ManageApp/Huati/bochu',
          headers: {
            'Authorization': 'Basic ' + btoa(storeData('userInfo').data.token + ':')
          },
          params: data
        })     
      },
      //下载
      down:function(data){
        return $http({
          method: 'POST',
          url: ip + '/ManageApp/Huati/down',
          headers: {
            'Authorization': 'Basic ' + btoa(storeData('userInfo').data.token + ':')
          },
          data: data
        })     
      },
      //（2）已划题单批量不通过操作
      batchBC:function(data){
        return $http({
          method: 'POST',
          url: ip + '/ManageApp/Huati/batchBC',
          headers: {
            'Authorization': 'Basic ' + btoa(storeData('userInfo').data.token + ':')
          },
          data: data
        })     
      },
      //43、 播出频道
      channelList:function(data){
        return $http({
          method: 'get',
          url: ip + '/ManageApp/Huati/pindao',
          headers: {
            'Authorization': 'Basic ' + btoa(storeData('userInfo').data.token + ':')
          },
          params: data
        })     
      },
      //38、 播出单
      BochuList:function(data){
        return $http({
          method: 'GET',
          url: ip + '/ManageApp/Bochu/index',
          headers: {
            'Authorization': 'Basic ' + btoa(storeData('userInfo').data.token + ':')
          },
          params: data
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
          timeout: 5000,
          parmas:data
        })
      },
      //用户管理
      userCtrl: function(data) {
        return $http({
          method: 'GET',
          url: ip + '/ManageApp/User/members',
          headers: {
            'Authorization': 'Basic ' + btoa(storeData('userInfo').data.token + ':')
          },
          params:data,
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
          return (key && angular.fromJson($window.localStorage[key])) || null;
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