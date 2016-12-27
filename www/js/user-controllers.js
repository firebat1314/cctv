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
  	console.log(navigator);
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
  		});
  	}
})

.controller('PersonalPageCtrl',function($ionicHistory,$scope, $data, $rootScope, $state,$stateParams){
  	$scope.uid = $stateParams.uid;
	$data.personalDetails($scope.uid).success(function(data){
		console.log(data);	 	
	});
})

.controller('personalDataCtrl',function($ionicHistory,$scope,$cordovaCamera, $cordovaImagePicker,$data,$timeout, $rootScope, $state,$ionicPopup,$ionicPopover){
	$ionicPopover.fromTemplateUrl('my-popover.html', {
		scope: $scope
	}).then(function(popover) {
		$scope.popover = popover;
	});
	$data.userInfo().success(function(data){
		//console.log(data);
		$scope.dataInit = data.data;
	})

	$scope.editImg = function(){
		$scope.popover.show();

		
		/*var template = '<a class="item" href="" ng-click="myPopup.close()">Butterfinger</a><a class="item" href="">Butterfinger</a>';
		var myPopup = $ionicPopup.show({
						    template: template,
						    title: '更改头像',
						    scope: $scope
						});
		$timeout(function() {
			 myPopup.close(); //3秒后关闭弹窗
		}, 1000);*/
	};

	$scope.openCamera = function(){
		document.addEventListener("deviceready", function () {
			//console.log(Camera);
		    var options = {
				quality: 50,
				destinationType: Camera.DestinationType.DATA_URL,
				sourceType: Camera.PictureSourceType.CAMERA,
				allowEdit: true,
				encodingType: Camera.EncodingType.JPEG,
				targetWidth: 200,
				targetHeight: 200,
				popoverOptions: CameraPopoverOptions,
				saveToPhotoAlbum: true,
				correctOrientation:true
		    };

		    $cordovaCamera.getPicture(options)
		    .then(function(imageData) {
		    	var image = document.getElementById('myImage');
		      	$scope.img = "data:image/jpeg;base64," + imageData;
		      	image.src = imageData;
	    		$data.editPic({
	    			avatar:$scope.img,
	    			step:'cropper'
	    		}).success(function(data){
	    			console.log(data);
	    			$scope.items = data;
	    		})
		    }, function(err) {
		      	// error
		      	console.log(1);
		    });
	  	}, false);

		$scope.popover.hide();
	};
	$scope.openImagePicker = function(){
		console.log(1);
		document.addEventListener("deviceready", function () {
			var options = {
				maximumImagesCount: 10,
				width: 800,
				height: 800,
				quality: 80
			};

			$cordovaImagePicker.getPictures(options)
			  	.then(function (results) {
		      		$scope.img = results;
		    		var image = document.getElementById('myImage');
  			      	image.src = $scope.img;
			    	$data.loadingShow(results)
  		    		/*$data.editPic({
  		    			avatar:$scope.img,
  		    			step:'cropper'
  		    		}).success(function(data){
  		    			console.log(data);
	    				$scope.items = data;
  		    		})*/
			  	}, function(error) {
			    	// error getting photos
			    	$data.loadingShow('打开相册失败')
				});
	  	}, false);
	}
	
})

.controller('ChangePassword',function(){
	$data.revisePassword({

	})	 	
})

.controller('SettingCtrl',function($ionicHistory,$scope, $data, $rootScope, $state){
	
  	
})