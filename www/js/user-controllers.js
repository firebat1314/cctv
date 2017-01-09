angular.module('user-controllers',[])

.controller('AccountCtrl', function($ionicHistory,$scope, $data, $rootScope, $state, $ionicLoading, $timeout, $stateParams, $ionicPopup, $ionicBackdrop, $ionicPopover, $stateParams) {
	$data.userInfo().success(function(data){
		$scope.img = data.data.avatar;
	})
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

.controller('ManagementCtrl',function($scope, $data, $rootScope, $state){
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

.controller('PersonalPageCtrl',function($ionicPopup,$ionicHistory,$scope, $data, $rootScope, $state,$stateParams,ionicDatePicker,$filter){
  	$scope.uid = $stateParams.uid;
  	$scope.editbutton = '编辑';
  	$scope.buttonIcon = 'img/icon/ico_60.png';
  	$scope.status = false;
  	$scope.details;

	$data.personalDetails($scope.uid).success(function(data){
		console.log(data);
		$scope.details = data.data;
		$scope.usergroups = data.usergroups;
		$scope.cardgroups = data.cardgroups;
		$scope.user = {
			uid:$scope.uid||'',
			realname:$scope.details.name||'',
			nickname:$scope.details.nick_name||'',
			birthday:$scope.details.birthday||'',
			mobile:$scope.details.mobile||'',
			sex:$scope.details.sex||'',
			groupid:$scope.details.groupid||'',
			company:$scope.details.company||'',
			department:$scope.details.department||'',
			position:$scope.details.position||'',
			province:$scope.details.province||'',
			city:$scope.details.city||'',
			district:$scope.details.district||''
		}
		$scope.getAddress();
	});
	$scope.getAddress = function(){
		$data.getCityList(0,1).success(function(data){
			$scope.provinceList = data.data;
		})
	};
	$scope.provinceChange = function(prov){
		$data.getCityList(prov,2).success(function(data){
			$scope.cityList = data.data;
		})
	}
	$scope.cityChange = function(city){
		$data.getCityList(city,3).success(function(data){
			$scope.districtList = data.data;
		}) 	
	}
	$scope.datapicker = function(){
		var ipObj1 = {
			callback: function (val) {  //Mandatory
				console.log('the date is :'+val);
				$scope.birthday = val;
				$scope.user.birthday = $filter('date')(val, 'yyyy-MM-dd');
				console.log($scope.user);
			},
			disabledDates: [            //Optional
				// new Date(2016, 2, 16),
				// new Date(2015, 3, 16),
				// new Date(2015, 4, 16),
				// new Date(2015, 5, 16),
				// new Date('Wednesday, August 12, 2015'),
				// new Date("08-16-2016"),
				// new Date(1439676000000)
			],
			from: new Date(1950, 1, 1), //Optional
			to: new Date(), //Optional
			inputDate: new Date(),      //Optional
			mondayFirst: false,          //Optional
			disableWeekdays: [],       //Optional [0,6]
			closeOnSelect: false,       //Optional
			templateType: 'popup'       //Optional
	    };

	      ionicDatePicker.openDatePicker(ipObj1);

	}
	$('.pp-button').on('click',function(e){
		$(this).parent().find('.pp-backdrop').css('opacity','.3');
		$(this).find('.pp-backdrop').css('opacity','0');
	});

	$scope.edit = function(){
		if ($scope.status) {
			$scope.saveCountersign();
		}else{
			$scope.editbutton = '保存';
			$scope.buttonIcon = 'img/icon/ico_59.png';
			$scope.status = true;
		}
	};
	$scope.submit = function(){
		console.log($scope.user);
		$data.editMember($scope.user).success(function(data){
			console.log(data);
			$data.loadingShow(data.info)
			if(data.status == 1){
				$data.personalDetails($scope.uid).success(function(data){
					$scope.details = data.data;
				})
			}
		})
	};
	$scope.saveCountersign = function(){
		$ionicPopup.confirm({
			title: '退出编辑',
			template: '是否保存？',
			scope:$scope,
			buttons: [{
				text: '<b>确定</b>',
				type: 'button-positive',
				onTap: 	function(res){
							$scope.submit();
							$scope.editbutton = '编辑';
							$scope.buttonIcon = 'img/icon/ico_60.png';
							$scope.status = false;
						}
			}, {
				text: '取消',
				onTap: 	function(res){
							$scope.editbutton = '编辑';
							$scope.buttonIcon = 'img/icon/ico_60.png';
							$scope.status = false;
						}
			}]
		})
	};

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
		var value = $scope.dataInit.nickname;
		var template = '<input type="text" ng-model="profile.nickname" autofocus><i ng-if="profile.nickname.length>0" class="ion ion-close-circled Octopus" id="foucus" ng-click="delText($event)" ></i>';
		$scope.tanchu('昵称',template,'popup-nickname',function(e){
			$data.profile({
				nickname:$scope.profile.nickname
			}).success(function(data){
				//console.log(data);
				$data.loadingShow(data.info);
				if (data.status == 0) {
					$scope.profile.nickname = '';
				}
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
				if (data.status == 0) {
					$scope.profile.sex = '';
				}
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
					if (data.status == 0) {
						$scope.profile.mobile = '';
					}
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
					if (data.status == 0) {
						$scope.profile.email = '';
					}
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
				$data.loadingShow(data.info);
				if(data.status == 1){
					$state.go('login');
				}
				if (data.status == 0) {
					$scope.profile.type = '';
				}
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
					$data.loadingShow(data.info);
					if (data.status == 0) {
						$scope.profile.company = '';
					}
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
					$data.loadingShow(data.info);
					if (data.status == 0) {
						$scope.profile.department = '';
					}
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
					$data.loadingShow(data.info);
					if (data.status == 0) {
						$scope.profile.position = '';
					}
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

.controller('SettingCtrl',function($ionicHistory,$scope, $data, $state,$rootScope, $ionicPopup){
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

.controller('AllNewsCtrl',function($scope, $data, $state,$rootScope){
	$scope.details = [];
	$scope.size = 10;
	$scope.page = 1;
	$data.allNews().success(function(data){
		console.log(data);
  		$scope.details = data.data;
	})

	$scope.loadMore = function () {
		$scope.page++;
        $data.allNews({
        	size:$scope.size,
        	page:$scope.page
        }).success(function (data) {
    		console.log(data);
            Array.prototype.push.apply($scope.details, data.data);
        }).finally(function () {
            $scope.$broadcast('scroll.infiniteScrollComplete');
        });
    };
    $scope.toParticulars = function(id){
    	$state.go('tab.news-particulars',{
    		id:id
    	})
    }


})

.controller('NewsParticularsCtrl',function($scope,$rootScope, $data, $state,$stateParams,$ionicSlideBoxDelegate){
  	$scope.id = $stateParams.id;
	$data.newParticulars({
		id:$scope.id
	}).success(function(data,b,c,d){
		console.log(data);
		$scope.details = data;
		$scope.video = /*$scope.details.data.videos?$scope.details.data.videos[0].savepath:'http://bt.cctvnnn.cn/Uploads/video/2016/12/585ca4291ab3f.MOV'*/'http://bt.cctvnnn.cn/Uploads/video/2016/12/585ca4291ab3f.MOV';
		console.log($scope.video);
	})
	$scope.nextSlide = function() {
	   $ionicSlideBoxDelegate.next();
	}

})

.controller('AllChuanLianCtrl',function($scope, $data, $state,$ionicPopup){
	$data.allChuanld().success(function(data){
		console.log(data);
		$scope.items = data.data;
	});
	$scope.status = false;
	$scope.editbutton = '编辑';
	$scope.buttonIcon = 'img/icon/ico_53.png';
	$scope.edit = function(){
		if ($scope.status) {
			$scope.noPass();
		}else{
			$scope.editbutton = '不通过';
			$scope.buttonIcon = 'img/icon/ico_59.png';
			$scope.status = true;
		}
	}
	$scope.noPass = function(){
		$ionicPopup.confirm({
			title: '确认操作',
			template: '是否保存？',
			scope:$scope,
			buttons: [{
				text: '<b>确定</b>',
				type: 'button-positive',
				onTap: 	function(res){
							$scope.submit();
							$scope.editbutton = '编辑';
							$scope.buttonIcon = 'img/icon/ico_60.png';
							$scope.status = false;
						}
			}, {
				text: '取消',
				onTap: 	function(res){
							$scope.editbutton = '编辑';
							$scope.buttonIcon = 'img/icon/ico_60.png';
							$scope.status = false;
						}
			}]
		})
	};
	$scope.submit = function(){
		$data.loadingShow('操作成功')
	};

	$scope.toApproximations = function(uid){
		$state.go('approximations',{
			uid:uid
		});
	}

	$scope.items = [];
	$scope.size = 3;
	$scope.page = 1;
	$scope.loadMore = function () {
		$scope.page++;
        $data.allChuanld($scope.size,$scope.page)
        	.success(function (data) {
                Array.prototype.push.apply($scope.items, data.data);
            }).finally(function () {
                $scope.$broadcast('scroll.infiniteScrollComplete');
            });
    };
})
.controller('ApproximationsCtrl',function($stateParams,$scope, $data, $state){
  	$scope.uid = $stateParams.uid;
	
})
.controller('NopassCtrl',function($scope, $data, $state){
	
})
.controller('HuatiCtrl',function($scope, $data, $state){
	
})
.controller('AddRebroadcatCtrl',function($scope, $data, $state){
	
})
.controller('AlreadyReportCtrl',function($scope, $data, $state){
	
})
.controller('AlreadySweepCtrl',function($scope, $data, $state){
	
})
.controller('OverPlayCtrl',function($scope, $data, $state){
	
})
.controller('CardCaseCtrl',function($scope, $data, $state){
	
})
.controller('CorrectionCodeCtrl',function($scope, $data, $state){
	
})

