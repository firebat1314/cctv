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
	$scope.items = [];
	$scope.size = 10;
	$scope.page = 1;
  	$data.userCtrl($scope.size,$scope.page).success(function(details){
  		console.log(details.data);
  		$scope.items = details.data;
  	})
  	//$data.loadingShow(navigator.connection.type);
  	//console.log(navigator);
	$scope.loadMore = function () {
		$scope.page++;
        $data.userCtrl($scope.size,$scope.page)
        	.success(function (data) {
                Array.prototype.push.apply($scope.items, data.data);
            }).finally(function () {
                $scope.$broadcast('scroll.infiniteScrollComplete');
            });
    };
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
	});
})

.controller('personalDataCtrl',function($ionicHistory,$scope, $data, $rootScope, $state,$ionicPopup,$ionicPopover){
	$scope.popover = $ionicPopover.fromTemplate('<ion-popover-view><ion-header-bar> <h1 class="title">My Popover Title</h1> </ion-header-bar> <ion-content> Hello! </ion-content></ion-popover-view>', {
	    scope: $scope
	  });
	$scope.editImg = function(){
		
		var template = '<a class="item" href="">Butterfinger</a><a class="item" href="">Butterfinger</a>';
		var myPopup = $ionicPopup.show({
		    template: template,
		    title: '更改头像',
		    scope: $scope
		  });
	}
})

.controller('SettingCtrl',function($ionicHistory,$scope, $data, $rootScope, $state){
	$scope.goBack = function() {
    	$ionicHistory.goBack();
  	}
  	
})