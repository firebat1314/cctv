angular.module('starter.services', [])
.service('$data',function($rootScope,$http){
    $rootScope.ip = 'http://cctvnnn.ivtime.net/';
    return {
      login: function (data) {
          return $http({
              method: "POST",
              url: "/Login/index",
              data: data
          });
      }
    }
});
