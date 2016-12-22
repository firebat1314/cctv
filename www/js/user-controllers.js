angular.module('user-controllers',[])

.controller('AccountCtrl', function($ionicHistory,$scope, $data, $rootScope, $state, $ionicLoading, $timeout, $stateParams, $ionicPopup, $ionicBackdrop, $ionicPopover, $stateParams) {
	$scope.jumpTo = function(){
		$state.go('tab.management')
	};
	$scope.goBack1 = function() {
    	$ionicHistory.goBack();
  	};
  	$scope.goSetting = function(){
  		$state.go('setting');	 	
  	};
  	$data.vipInfoStatistics().success(function(data){
  		console.log(data);
  		$scope.data = data;	
  	});
})

.controller('ManagementCtrl',function($ionicHistory,$scope, $data, $rootScope, $state, $ionicLoading, $timeout, $stateParams, $ionicPopup, $ionicBackdrop, $ionicPopover, $stateParams){
	$scope.goBack1 = function() {
    	$ionicHistory.goBack();
  	}
  	
  	//$data.loadingShow(navigator.connection.type);
  	//console.log(navigator);
})

.controller('SettingCtrl',function($ionicHistory,$scope, $data, $rootScope, $state, $ionicLoading, $timeout, $stateParams, $ionicPopup, $ionicBackdrop, $ionicPopover, $stateParams){
	$scope.goBack = function() {
    	$ionicHistory.goBack();
  	}
  	
})