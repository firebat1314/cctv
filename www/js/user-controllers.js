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

.controller('PersonalDataCtrl',function($ionicHistory,$scope,$cordovaCamera, $cordovaImagePicker,$data,$timeout, $rootScope, $state,$ionicPopup,$ionicPopover,$ionicModal){
	$ionicPopover.fromTemplateUrl('my-popover.html', {
		scope: $scope
	}).then(function(popover) {
		$scope.popover = popover;
	});
	$data.userInfo().success(function(data){
		console.log(data);
		$scope.dataInit = data.data;
	})
	$scope.editImg = function(){
		$scope.popover.show();
	};

	$scope.openCamera = function(){
		document.addEventListener("deviceready", function () {
			//console.log(Camera);
		    var options = {
				quality: 80,
				destinationType: Camera.DestinationType.DATA_URL,
				sourceType: Camera.PictureSourceType.CAMERA,
				allowEdit: true,
				encodingType: Camera.EncodingType.JPEG,
				targetWidth: 500,
				targetHeight: 500,
				popoverOptions: CameraPopoverOptions,
				saveToPhotoAlbum: true,
				correctOrientation:true
		    };

		    $cordovaCamera.getPicture(options)
		    .then(function(imageData) {
		    	var image = document.getElementById('myImage');
		      	$scope.img = imageData;
		      	if($scope.img){
		      		image.src = $scope.img;
		      		$data.editPic({
		      			avatar:$scope.img,
		      			step:'cropper'
		      		}).success(function(data){
		      			console.log(data);
		      			$scope.items = data;
		      		})
		      	}
	    		
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
  		    		$data.editPic({
  		    			avatar:$scope.img,
  		    			step:'cropper'
  		    		}).success(function(data){
  		    			console.log(data);
	    				$scope.items = data;
  		    		})
			  	}, function(error) {
			    	$data.loadingShow('打开相册失败')
				});
	  	}, false);
	};
	$scope.profile = {
		nickname: '',
		sex:1,
		mobile: '',
		email: '',
		city_cn: '',
		type: '',
		company: '',
		department: '',
		position: ''
	};
	$scope.delText = function($event){
		console.log($event);
		$($event.target).siblings('input').val('');
		$($event.target).siblings('input').blur();
		$($event.target).siblings('input').focus();
	}
	$scope.tanchu = function(str,template,cssClass,fun,templateUrl){
		$ionicPopup.confirm({
			title: str,
			template: template,
			templateUrl: templateUrl,
			scope:$scope,
			cssClass:cssClass,
			buttons: [{
			text: '<b>确定</b>',
			type: 'button-positive',
			onTap: fun
			}, {
				text: '取消'
			}]
		})
	}
	$scope.nickname = function(){
		var template = '<input type="text" ng-model="profile.nickname" autofocus><i ng-if="profile.nickname.length>0" class="ion ion-close-circled Octopus" id="foucus" ng-click="delText($event)" ></i>';
		$scope.tanchu('昵称',template,'popup-nickname',function(e){
			$data.profile({
				nickname:$scope.profile.nickname
			}).success(function(data){
				//console.log(data);
				$data.loadingShow(data.info);
			})
		})
	};
	$scope.sex = function(){
		var template = '<ion-list><ion-radio ng-model="profile.sex" ng-value="1">男</ion-radio><ion-radio ng-model="profile.sex" ng-value="0">女</ion-radio></ion-list>';
		$scope.tanchu('性别',template,'popup-sex',function(e){
			$data.profile({
				sex:$scope.profile.sex
			}).success(function(data){
				//console.log(data);
				$data.loadingShow(data.info);
			})
		})
	};
	$scope.mobile = function(){
		var template = '<input type="text" ng-model="profile.mobile" autofocus><i ng-if="profile.mobile.length>0" class="ion ion-close-circled Octopus" ng-click="delText($event)"></i>';
		$scope.tanchu('手机号',template,'',function(e){
			if($scope.profile.mobile == ''){
				e.preventDefault();
			}else{
				$data.profile({
					mobile:$scope.profile.mobile
				}).success(function(data){
					//console.log(data);
					$data.loadingShow(data.info);
				})
			}
		})
	};
	$scope.email = function(){
		var template = '<input type="text" ng-model="profile.email" autofocus><i ng-if="profile.email.length>0" class="ion ion-close-circled Octopus" ng-click="delText($event)"></i>';
		$scope.tanchu('电子邮箱',template,'',function(e){
			if($scope.profile.email == ''){
				e.preventDefault();
			}else{
				$data.profile({
					email:$scope.profile.email
				}).success(function(data){
					//console.log(data);
					$data.loadingShow(data.info);
				})
			}
		})
	};
	$scope.loadAddress = function(){
		$data.getCityList(0,1).success(function(data) {
		  console.log(data);
		  $scope.province = data;
		})
	}
	$scope.loadAddress();
	$scope.city_cn = function(){
		$scope.add = {};
		$scope.getProvince = function($event,level,id){
			$scope.add.province = id;
			$($event.currentTarget).addClass('add-checkbox-actived').siblings().removeClass('add-checkbox-actived');
			$data.getCityList($scope.add.province,2).success(function(data) {
		  		$scope.city = data;
			  	console.log(data);
			})
		}
		$scope.getCity= function($event,level,id){
			$scope.add.city = id;
			$($event.currentTarget).addClass('add-checkbox-actived').siblings().removeClass('add-checkbox-actived');
			$data.getCityList($scope.add.city,3).success(function(data) {
		  		$scope.district = data;
			  	console.log(data);
			})
		}
		$scope.getDistrict = function($event,level,id){
			$scope.add.district = id;
			$($event.currentTarget).addClass('add-checkbox-actived').siblings().removeClass('add-checkbox-actived');
		}
		$scope.tanchu('所属地区','','popup-city_cn',function(e){
			$data.profile({
				province:1,
				city:37,
				district:568
			}).success(function(data){
				//console.log(data);
				$data.loadingShow(data.info);
			})
		},'city_cn.html')
	};
	$scope.type = function(){
		var template = '<ion-list><ion-radio ng-model="profile.type" ng-value="0">电视台</ion-radio><ion-radio ng-model="profile.type" ng-value="1">非电视台</ion-radio><ion-radio ng-model="profile.type" ng-value="2">记者台</ion-radio></ion-list>';
		$scope.tanchu('公司性质',template,'popup-type',function(e){
			$data.profile({
				type:$scope.profile.type
			}).success(function(data){
				console.log(data);
				$data.loadingShow(data.info);
			})
		})
	};
	$scope.company = function(){
		var template = '<input type="text" ng-model="profile.company" autofocus><i ng-if="profile.company.length>0" class="ion ion-close-circled Octopus" ng-click="delText($event)"></i>';
		$scope.tanchu('电视台名称',template,'',function(e){
			if($scope.profile.company == ''){
				e.preventDefault();
			}else{
				$data.profile({
					company:$scope.profile.company
				}).success(function(data){
					console.log(data);
					$data.loadingShow(data.info);
				})
			}
		})
	};
	$scope.department = function(){
		var template = '<input type="text" ng-model="profile.department" autofocus><i ng-if="profile.department.length>0" class="ion ion-close-circled Octopus" ng-click="delText($event)"></i>';
		$scope.tanchu('部门',template,'',function(e){
			if($scope.profile.department == ''){
				e.preventDefault();
			}else{
				$data.profile({
					department:$scope.profile.department
				}).success(function(data){
					console.log(data);
					$data.loadingShow(data.info);
				})
			}
		})
	};
	$scope.position = function(){
		var template = '<input type="text" ng-model="profile.position" autofocus><i ng-if="profile.position.length>0" class="ion ion-close-circled Octopus" ng-click="delText($event)"></i>';
		$scope.tanchu('职务',template,'',function(e){
			if($scope.profile.position == ''){
				e.preventDefault();
			}else{
				$data.profile({
					position:$scope.profile.position
				}).success(function(data){
					console.log(data);
					$data.loadingShow(data.info);
				})
			}
		})
	};

})

.controller('RevisePassword',function($ionicHistory,$scope, $data, $rootScope, $state,$ionicPopup){
	$scope.user={
		oldpassword:'',
		password:'',
		cpassword:''
	};
	$scope.submit = function(){
		console.log($scope.user);
		$data.revisePassword($scope.user).success(function(data){
			console.log(data);
			$data.loadingShow(data.info); 
			if(data.status == 1){
				$state.go('login');
			}else{
				$data.loadingShow(data.info);
			}
		})	 	
	};

})

.controller('SettingCtrl',function($ionicHistory,$scope, $data, $rootScope, $state,$ionicPopup){
	$scope.showCacheDialog = function() {
	  $ionicPopup.confirm({
	    title: '确认退出登录?',
	    template: '',
	    buttons: [{
	      text: '<b>确定</b>',
	      type: 'button-positive',
	      onTap: function(event) {
	        $state.go('login');
	      }
	    }, {
	      text: '取消'
	    }]
	  })
	};
  	
})