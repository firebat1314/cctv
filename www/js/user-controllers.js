angular.module('user-controllers',[])

.controller('AccountCtrl', function($ionicHistory,$scope, $data, $rootScope, $state, $ionicLoading, $timeout, $stateParams, $ionicPopup, $ionicBackdrop, $ionicPopover, $stateParams) {
	$scope.jumpTo = function(){
		$state.go('tab.management')
	}
	$scope.goBack1 = function() {
		console.log(1);
    	$ionicHistory.goBack();
  	}
})

.controller('ManagementCtrl',function($scope, $data, $rootScope, $state, $ionicLoading, $timeout, $stateParams, $ionicPopup, $ionicBackdrop, $ionicPopover, $stateParams){

})