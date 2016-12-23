angular.module('user-controllers',[])

.controller('AccountCtrl', function($ionicHistory,$scope, $data, $rootScope, $state, $ionicLoading, $timeout, $stateParams, $ionicPopup, $ionicBackdrop, $ionicPopover, $stateParams) {
	$scope.jumpTo = function(){
		$state.go('tab.management')
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

  	$data.userCtrl().success(function(details){
  		console.log(details);	 	
  		$scope.details = details;	
  	})
/*  	$scope.loadMore = function() {
  		$data.userCtrl().success(function(details){
  			console.log(details);	 	
  			$scope.details = details;	
  	    });
	};*/
  	//$data.loadingShow(navigator.connection.type);
  	//console.log(navigator);
  	$scope.toPersonalPage = function(uid){
  		$state.go('tab.personal-page',{
  			uid:uid
  		})	 	
  	}
})

.controller('PersonalPageCtrl',function($ionicHistory,$scope, $data, $rootScope, $state){
  	$scope.uid = $stateParams.uid;
	$data.personalDetails(uid).success(function(data){
		console.log(data);	 	
	})
})

.controller('SettingCtrl',function($ionicHistory,$scope, $data, $rootScope, $state){
	$scope.goBack = function() {
    	$ionicHistory.goBack();
  	}
  	
})