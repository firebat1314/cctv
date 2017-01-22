angular.module('user-controllers', [])
.controller('AccountCtrl', function($ionicHistory, $scope, $data, $rootScope, $state, $ionicLoading, $timeout, $stateParams, $ionicPopup, $ionicBackdrop, $ionicPopover, $stateParams) {
	$scope.getDetails = function(){
		$data.userInfo().success(function(data) {
			// console.log(data);
			$scope.img = data.data.avatar;
		});
		$data.vipInfoStatistics().success(function(data) {
			// console.log(data);
			$scope.data = data;
		});
	};
	$scope.$on('$ionicView.beforeEnter',function(){
		$scope.getDetails();
		var deregister = $rootScope.$on('img',function(event,data){
			// console.log(data);
			$scope.img = data;
		});
	});
	$scope.jumpTo = function() {
		$state.go('tab.management')
	};
	$scope.goSetting = function() {
		$state.go('setting');
	};
	//更新我的首页
	$scope.doRefresh = function(){
		$data.vipInfoStatistics()
		.success(function(data) {
			// console.log(data);
			$scope.data = data;
		}).error(function(){
			$data.loadingShow('更新失败');
		}).finally(function() {
        	$scope.$broadcast('scroll.refreshComplete');
      	});   
	}
})

.controller('ManagementCtrl', function($scope, $data, $rootScope, $state, $timeout, $ionicPopup) {
	$scope.size = 10;
	$scope.page = 0;
	$scope.noMore = true;
	$scope.items = [];
	$scope.loadMore = function() {
		$scope.page++;
		$data.userCtrl({
			size: $scope.size,
			page: $scope.page
		}).success(function(data) {
			// console.log(data);
			$scope.noMore = $data.isNoMore(data,$scope.size);
			Array.prototype.push.apply($scope.items, data.data);
			// console.log($scope.items);
		}).finally(function() {
			$timeout(function() {
				$scope.$broadcast('scroll.infiniteScrollComplete');
			},100)
		});
	};
	$scope.checkMember = function(uid, $index) {
		// console.log($index);
		$ionicPopup.confirm({
			title: '提示信息',
			template: '是否审核通过？',
			scope: $scope,
			buttons: [{
				text: '<b>确定</b>',
				type: 'button-positive',
				onTap: function(res) {
					$data.checkMember({
						uid: uid,
						status: 1
					}).success(function(data) {
						$data.loadingShow(data.info);
						$scope.items[$index].check = '1';
					});
				}
			}, {
				text: '取消'
			}]
		})
	}
	$scope.toPersonalPage = function(uid) {
		$state.go('tab.personal-page', {
			uid: uid
		})
	}
})

.controller('PersonalPageCtrl', function($ionicPopup, $ionicHistory, $scope, $data, $rootScope, $state, $stateParams, ionicDatePicker, $filter) {
	$scope.uid = $stateParams.uid;
	$scope.cardid = $stateParams.cardid;
	$scope.status = false;
	$scope.details;
	if($scope.cardid){
		// console.log('编辑名片盒');
		$data.viewMPH({
			id:$scope.cardid
		}).success(function(data){
			// console.log(data);
			$scope.details = data.data;
			$scope.cardgroups = data.groups;
			$scope.user = {
				id:$scope.cardid,
				uid: $scope.uid || '',
				realname: $scope.details.name || '',
				nickname: $scope.details.nick_name || '',
				birthday: $scope.details.birthday || '',
				mobile: $scope.details.mobile || '',
				sex: $scope.details.sex || '',
				groupid: $scope.details.group_id || '',
				company: $scope.details.company || '',
				department: $scope.details.department || '',
				position: $scope.details.position || '',
				province: $scope.details.province || '',
				city: $scope.details.city || '',
				district: $scope.details.area || ''
			}
			$scope.getAddress();
			$scope.provinceChange($scope.details.province);
			$scope.cityChange($scope.details.city);
		})
	}else{
		$data.personalDetails($scope.uid).success(function(data) {
			// console.log(data);
			$scope.details = data.data;
			$scope.usergroups = data.usergroups;
			$scope.user = {
				uid: $scope.uid || '',
				realname: $scope.details.name || '',
				nickname: $scope.details.nick_name || '',
				birthday: $scope.details.birthday || '',
				mobile: $scope.details.mobile || '',
				sex: $scope.details.sex || '',
				groupid: $scope.details.groupid || '',
				company: $scope.details.company || '',
				department: $scope.details.department || '',
				position: $scope.details.position || '',
				province: $scope.details.province || '',
				city: $scope.details.city || '',
				district: $scope.details.area || ''
			};
			$scope.getAddress();
			$scope.provinceChange($scope.details.province);
			$scope.cityChange($scope.details.city);
		});
	};
	$scope.getAddress = function() {
		$data.getCityList(0, 1).success(function(data) {
			$scope.provinceList = data.data;
		});
	};
	$scope.provinceChange = function(prov) {
		$data.getCityList(prov, 2).success(function(data) {
			$scope.cityList = data.data;
		});
		$scope.districtList = null;
	};
	$scope.cityChange = function(city) {
		$data.getCityList(city, 3).success(function(data) {
			$scope.districtList = data.data;
		})
	};
	$scope.datapicker = function() {
		var ipObj1 = {
			callback: function(val) { //Mandatory
				// console.log('the date is :' + val);
				$scope.birthday = val;
				$scope.user.birthday = $filter('date')(val, 'yyyy-MM-dd');
				// console.log($scope.user);
			},
			disabledDates: [ //Optional
				// new Date(2015, 5, 16),
				// new Date('Wednesday, August 12, 2015'),
				// new Date("08-16-2016"),
				// new Date(1439676000000)
			],
			from: new Date(1950, 1, 1), //Optional
			to: new Date(), //Optional
			inputDate: new Date(), //Optional
			mondayFirst: false, //Optional
			disableWeekdays: [], //Optional [0,6]
			closeOnSelect: false, //Optional
			templateType: 'popup' //Optional
		};

		ionicDatePicker.openDatePicker(ipObj1);

	};
	$('.pp-button').on('click', function(e) {
		$(this).parent().find('.pp-backdrop').css('opacity', '.3');
		$(this).find('.pp-backdrop').css('opacity', '0');
	});

	$scope.edit = function() {
		if ($scope.status) {
			$scope.saveCountersign();
		} else {
			$scope.status = true;
		}
	};
	$scope.submit = function() {
		console.log($scope.user);
		if($scope.cardid){
			$data.editMPH($scope.user).success(function(data) {
				console.log(data);
				$data.loadingShow(data.info)
				if (data.status == 1) {
					$data.viewMPH($scope.uid).success(function(data) {
						$scope.details = data.data;
					})
				}
			})
		}else{
			$data.editMember($scope.user).success(function(data) {
				console.log(data);
				$data.loadingShow(data.info)
				if (data.status == 1) {
					$data.personalDetails($scope.uid).success(function(data) {
						$scope.details = data.data;
					})
				}
			})
		}
	};
	$scope.saveCountersign = function() {
		$ionicPopup.confirm({
			title: '提示信息',
			template: '是否保存？',
			scope: $scope,
			buttons: [{
				text: '<b>确定</b>',
				type: 'button-positive',
				onTap: function(res) {
					$scope.submit();
					$scope.status = false;
				}
			}, {
				text: '取消',
				onTap: function(res) {
					$scope.status = false;
				}
			}]
		})
	};
})

.controller('PersonalDataCtrl', function($ionicHistory, $scope, $cordovaCamera, $cordovaImagePicker, $data, $timeout, $rootScope, $state, $ionicPopup, $ionicPopover, $ionicModal, $ionicActionSheet, $cordovaFileTransfer) {
	$ionicPopover.fromTemplateUrl('my-popover.html', {
		scope: $scope
	}).then(function(popover) {
		$scope.popover = popover;
	});

	$scope.editImg = function($event) {
		$scope.popover.show();

		// $ionicActionSheet.show({
  //           buttons: [
  //             { text: '拍照' },
  //             { text: '从相册中选择' }
  //           ],
  //           cancelText: '关闭',
  //           cancel: function() {
  //               return true;
  //           },
  //           buttonClicked: function(index) {
            	console.log(index);
  //               switch (index){
  //                   case 0:
  //                       $scope.openCamera();
  //                       break;
  //                   case 1:
  //                       $scope.openImagePicker();
  //                       break;
  //                   default:
  //                       break;
  //               }   
  //               return true;
  //           }
  //       });
	};
	$scope.$on('$ionicView.beforeEnter', function() {
		// console.log('进入个人中心...');
	});
	$scope.$on('$ionicView.beforeLeave', function() {
		// console.log('离开个人中心...');
	});
	$scope.openCamera = function(type) {
		document.addEventListener("deviceready", function() {
			// console.log(Camera);
			var options = {
				quality: 80,
				//相片质量0-100
				destinationType: Camera.DestinationType.DATA_URL,
				//返回类型：DATA_URL= 0，返回作为 base64 編碼字串。 FILE_URI=1，返回影像档的 URI。NATIVE_URI=2，返回图像本机URI (例如，資產庫)
				sourceType: type,
				//从哪里选择图片：PHOTOLIBRARY=0，相机拍照CAMERA=1，SAVEDPHOTOALBUM=2。0和1其实都是本地图库
				allowEdit: true,
				//在选择之前允许修改截图
				encodingType: Camera.EncodingType.JPEG,
				//保存的图片格式： JPEG = 0, PNG = 1
				targetWidth: 500,
				//照片宽度
				targetHeight: 500,
				//照片高度
				mediaType: 0,
				//可选媒体类型：圖片=0，只允许选择图片將返回指定DestinationType的参数。 視頻格式=1，允许选择视频，最终返回 FILE_URI。ALLMEDIA= 2，允许所有媒体类型的选择。
				cameraDirection: 0,
				//前后摄像头类型：Back= 0,Front-facing = 1
				popoverOptions: CameraPopoverOptions,
				saveToPhotoAlbum: true,
				//保存进手机相册
				correctOrientation: true
			};

			$cordovaCamera.getPicture(options)
				.then(function(results) {
					// console.log(results);
					$scope.dataInit.avatar = "data:image/jpeg;base64," + results;
					$data.editPic({
						avatar: "data:image/jpeg;base64," + results,
						step: 'cropper',
						thumb: 1
					}).success(function(data) {
						// console.log(data);
						$data.loadingShow(data.info)
						if (data.status == '1') {
							$rootScope.$broadcast('img',data.data.avatar);
							$scope.dataInit.avatar = data.data.avatar;
						}
					})
				}, function(err) {
					// error
					// console.log(1);
				});
		}, false);
		$scope.popover.hide();
	};

	$scope.openImagePicker = function() {
		document.addEventListener("deviceready", function() {
			var options = {
				maximumImagesCount: 1,
				width: 800,
				height: 800,
				quality: 80
			};
			$cordovaImagePicker.getPictures(options)
				.then(function(imgData) {
					// console.log(imgData);
					$data.editPic({
						avatar: imgData[0]
					}).success(function(data) {
						// console.log(data);
						$data.loadingShow(data.info)
						$scope.dataInit.avatar = imgData[0];
						if (data.status == '1') {
							$scope.dataInit.avatar = imgData[0];
						}
					})
				}, function(error) {
					$data.loadingShow('相册打开失败')
				});
		}, false);
		$scope.popover.hide();
	};
	$scope.getDetails = function() {
		$data.userInfo().success(function(data) {
			// console.log(data);
			$scope.dataInit = data.data;
			$scope.profile = {
				nickname: $scope.dataInit.nickname,
				sex: $scope.dataInit.sex,
				mobile: $scope.dataInit.mobile,
				email: $scope.dataInit.email,
				city_cn: $scope.dataInit.city_cn,
				type: $scope.dataInit.type,
				company: $scope.dataInit.company,
				department: $scope.dataInit.department,
				position: $scope.dataInit.position
			};
		})
	};
	$scope.getDetails();
	$scope.delText = function($event) {
		$($event.target).siblings('input').val('');
	}
	$scope.tanchu = function(str, template, cssClass, fun, templateUrl) {
		$ionicPopup.confirm({
			title: str,
			template: template,
			templateUrl: templateUrl,
			scope: $scope,
			cssClass: cssClass,
			buttons: [{
				text: '<b>确定</b>',
				type: 'button-positive',
				onTap: fun
			}, {
				text: '取消'
			}]
		})
	}
	$scope.nickname = function() {
		var value = $scope.dataInit.nickname;
		var template = '<input type="text" ng-model="profile.nickname" get-focus><i ng-if="profile.nickname.length>0" class="ion ion-close-circled Octopus" id="foucus" ng-click="delText($event)" ></i>';
		$scope.tanchu('昵称', template, 'popup-nickname', function(e) {
			$data.profile({
				nickname: $scope.profile.nickname
			}).success(function(data) {
				console.log(data);
				$data.loadingShow(data.info);
				if (data.status == 1) {
					$scope.getDetails();
				}
			})
		})
	};
	$scope.sex = function() {
		var template = '<ion-list><ion-radio ng-model="profile.sex" ng-value="1">男</ion-radio><ion-radio ng-model="profile.sex" ng-value="2">女</ion-radio></ion-list>';
		$scope.tanchu('性别', template, 'popup-sex', function(e) {

			$data.profile({
				sex: $scope.profile.sex
			}).success(function(data) {
				console.log(data);
				$data.loadingShow(data.info);
				if (data.status == 1) {
					$scope.getDetails();
				}
			})
		})
	};
	$scope.mobile = function() {
		var template = '<input type="text" ng-model="profile.mobile" get-focus><i ng-if="profile.mobile.length>0" class="ion ion-close-circled Octopus" ng-click="delText($event)"></i>';
		$scope.tanchu('手机号', template, '', function(e) {
			if ($scope.profile.mobile == '') {
				e.preventDefault();
			} else {
				$data.profile({
					mobile: $scope.profile.mobile
				}).success(function(data) {
					console.log(data);
					$data.loadingShow(data.info);
					if (data.status == 1) {
						$scope.getDetails();
					}
				})
			}
		})
	};
	$scope.email = function() {
		var template = '<input type="email" ng-model="profile.email" get-focus><i ng-if="profile.email.length>0" class="ion ion-close-circled Octopus" ng-click="delText($event)"></i>';
		$scope.tanchu('电子邮箱', template, '', function(e) {
			if ($scope.profile.email == '') {
				e.preventDefault();
			} else {
				$data.profile({
					email: $scope.profile.email
				}).success(function(data) {
					console.log(data);
					$data.loadingShow(data.info);
					if (data.status == 1) {
						$scope.getDetails();
					}
				})
			}
		})
	};


	$scope.loadAddress = function() {
		$data.getCityList(0, 1).success(function(data) {
			// console.log(data);
			$scope.province = data;
		})
	}
	
	$scope.city_cn = function() {
		$scope.loadAddress();
		$scope.add = {};
		$scope.getProvince = function($index, level, id) {
			$scope.add.province = id;
			$('.add-checkbox').eq($index).addClass('add-checkbox-actived').siblings().removeClass('add-checkbox-actived');
			$data.getCityList($scope.add.province, 2).success(function(data) {
				$scope.city = data;
				// console.log(data);
			});

		}
		$scope.getCity = function($index, level, id) {
			$scope.add.city = id;
			$('.add-checkbox').eq($index).addClass('add-checkbox-actived').siblings().removeClass('add-checkbox-actived');
			$data.getCityList($scope.add.city, 3).success(function(data) {
				$scope.district = data
				if(data.data.length == 0){
					$scope.flag = true;
				}else{
					$scope.flag = false;
				}
			})
		}
		$scope.getDistrict = function($index, level, id) {
			$scope.add.district = id;
			$('.add-checkbox').eq($index).addClass('add-checkbox-actived').siblings().removeClass('add-checkbox-actived');
		}
		$scope.tanchu('所属地区', '', 'popup-city_cn', function(e) {
					
			// console.log($scope.add);
			$data.profile($scope.add).success(function(data) {
				console.log(data);
				$data.loadingShow(data.info);
				if(data.status == '1'){
					$scope.getDetails();
				};
				
			})
			$scope.add = null;
		}, 'city_cn.html')
	};
	$scope.type = function() {
		var template = '<ion-list><ion-radio ng-model="profile.type" ng-value="0">电视台</ion-radio><ion-radio ng-model="profile.type" ng-value="1">非电视台</ion-radio><ion-radio ng-model="profile.type" ng-value="2">记者台</ion-radio></ion-list>';
		$scope.tanchu('公司性质', template, 'popup-type', function(e) {
			$data.profile({
				type: $scope.profile.type
			}).success(function(data) {
				$data.loadingShow(data.info);
				if (data.status == 1) {
					$scope.getDetails();
					$state.go('login');
				}
			})
		})
	};
	$scope.company = function() {
		var template = '<input type="text" ng-model="profile.company" get-focus><i ng-if="profile.company.length>0" class="ion ion-close-circled Octopus" ng-click="delText($event)"></i>';
		$scope.tanchu('电视台名称', template, '', function(e) {
			if ($scope.profile.company == '') {
				e.preventDefault();
			} else {
				$data.profile({
					company: $scope.profile.company
				}).success(function(data) {
					$data.loadingShow(data.info);
					if (data.status == 1) {
						$scope.getDetails();
					}
				})
			}
		})
	};
	$scope.department = function() {
		var template = '<input type="text" ng-model="profile.department" get-focus><i ng-if="profile.department.length>0" class="ion ion-close-circled Octopus" ng-click="delText($event)"></i>';
		$scope.tanchu('部门', template, '', function(e) {
			if ($scope.profile.department == '') {
				e.preventDefault();
			} else {
				$data.profile({
					department: $scope.profile.department
				}).success(function(data) {
					$data.loadingShow(data.info);
					if (data.status == 1) {
						$scope.getDetails();
					}
				})
			}
		})
	};
	$scope.position = function() {
		var template = '<input type="text" ng-model="profile.position" get-focus><i ng-if="profile.position.length>0" class="ion ion-close-circled Octopus" ng-click="delText($event)"></i>';
		$scope.tanchu('职务', template, '', function(e) {
			if ($scope.profile.position == '') {
				e.preventDefault();
			} else {
				$data.profile({
					position: $scope.profile.position
				}).success(function(data) {
					$data.loadingShow(data.info);
					if (data.status == 1) {
						$scope.getDetails();
					}
				})
			}
		})
	};
})

.controller('SettingCtrl', function($ionicHistory, $scope, $data, $state, $rootScope, $ionicPopup) {
	$scope.showCacheDialog = function() {
		$ionicPopup.confirm({
			title: '提示信息',
			template: '确认退出登录?',
			buttons: [{
				text: '<b>确定</b>',
				type: 'button-positive',
				onTap: function(event) {
					$data.storeData('isLogin','no')
					$state.go('login');
				}
			}, {
				text: '取消'
			}]
		})
	};
})

.controller('AllNewsCtrl', function($scope, $data, $state, $rootScope,$timeout) {
	$scope.details = [];
	$scope.size = 10;
	$scope.page = 1;
	$scope.newValue;//搜索关键字
	var deregister;
	$scope.getDetails = function(searchs) {
		$scope.noMore = true;
		$scope.newValue = searchs;
		$data.allNews({
			kw:$scope.newValue
		}).success(function(data) {
			// console.log(data);
			$scope.details = data.data;
		})
	};
	$scope.getDetails('');
	//根据报题提交 更新已阅视图
	$scope.$on('$ionicView.enter',function(){
		deregister = $rootScope.$on('is_read',function(event,data){
			// console.log(data.index);
			$timeout(function(){
				$scope.details[data.index].is_read = '1';
			},300)
		});
	});
	$scope.$on('$ionicView.enter',function(){

	});
	$scope.loadMore = function() {
		$scope.page++;
		$data.allNews({
			size: $scope.size,
			page: $scope.page,
			kw:$scope.newValue
		}).success(function(data) {
			// console.log(data);
			$scope.noMore = $data.isNoMore(data,$scope.size);
			Array.prototype.push.apply($scope.details, data.data);
		}).finally(function() {
			$scope.$broadcast('scroll.infiniteScrollComplete');
		});
	};
	$scope.toParticulars = function(id) {
		$state.go('tab.news-particulars', {
			id: id
		})
	};
	$scope.toBaoti = function(id,$index) {
		$state.go('baoti', {
			id: id,
			index:$index
		})
	};
})

.controller('BaotiCtrl',function($scope, $data, $state, $stateParams, $rootScope){
	$scope.id = $stateParams.id;
	$scope.index = $stateParams.index;
	$scope.user = {
		note: '',
		status: '1',
		id: $scope.id
	};
	$data.BaotiHandle({
		id:$scope.id
	}).success(function(data){
		// console.log(data);
		var regRN = /\r\n/g;
		$scope.title = data.data.title;
		$scope.content = data.data.content.replace(regRN, "<br />　");
	});
	$scope.submit = function() {
		$scope.btnStatus = true;//按钮提交状态
		$data.BaotiHandlePass($scope.user).success(function(data) {
			// console.log(data);
			$scope.btnStatus = false;//按钮提交状态
			$data.loadingShow(data.info);
			$rootScope.$ionicGoBack();
			
			if (data.status == '1') {
				$rootScope.$broadcast('is_read',{//发送已阅事件
					index: $scope.index
				});
			}
		})
	}	 	
})
.controller('NewsParticularsCtrl', function($scope, $rootScope, $data, $state, $stateParams, $ionicSlideBoxDelegate, $sce) {
	$scope.id = $stateParams.id;
	$data.newParticulars({
		id: $scope.id
	}).success(function(data) {
		// console.log(data);
		$scope.details = data;
		$scope.content = data.data.content.replace(/\r\n/g, "<br />　");
		if (data.data.videos && data.data.videos[0]) {
			$scope.video = data.data.videos[0].savepath;
		}
	})
	$scope.nextSlide = function() {
		$ionicSlideBoxDelegate.next();
	};
	$scope.config = {
		sources: [{
			src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.mp4"),
			type: "video/mp4"
		}, {
			src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.webm"),
			type: "video/webm"
		}, {
			src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.ogg"),
			type: "video/ogg"
		}],
		tracks: [{
			src: "http://www.videogular.com/assets/subs/pale-blue-dot.vtt",
			kind: "subtitles",
			srclang: "en",
			label: "English",
			default: ""
		}],
		theme: "lib/videogular-themes-default/videogular.css",
		plugins: {
			poster: "http://www.videogular.com/assets/images/videogular.png"
		}
	};
})

.controller('AllChuanLianCtrl', function($scope, $rootScope, $data, $state, $ionicPopup, $timeout, $ionicListDelegate) {

	$scope.newValue;//搜索关键字
	$scope.getDetails = function(searchs) {
		$scope.noMore = true;
		$scope.newValue = searchs;
		$data.allChuanld({
			kw:$scope.newValue
		}).success(function(data) {
			// console.log(data);
			$scope.items = data.data;
		})
	};
	$scope.getDetails('');

	$scope.size = 10;
	$scope.page = 1;
	$scope.loadMore = function() {
		$scope.page++;
		$timeout(function() {
			$data.allChuanld({
					size: $scope.size,
					page: $scope.page,
					kw:$scope.newValue
				})
				.success(function(data) {
					// console.log(data);
					$scope.noMore = $data.isNoMore(data,$scope.size);
					Array.prototype.push.apply($scope.items, data.data);
				}).finally(function() {
					$scope.$broadcast('scroll.infiniteScrollComplete');
				});
		}, 1000)
	};
	$scope.arr = [];
	$scope.status = false;
	$scope.edit = function() {
		$ionicListDelegate.closeOptionButtons();
		if ($scope.status) {
			$scope.noPass();
		} else {
			$scope.status = true;
		}
	}
	$scope.noPass = function() {
		$ionicPopup.confirm({
			title: '提示信息',
			template: '是否保存？',
			scope: $scope,
			buttons: [{
				text: '<b>确定</b>',
				type: 'button-positive',
				onTap: function(res) {
					$scope.submit();
					$scope.status = false;
				}
			}, {
				text: '取消',
				onTap: function(res) {
					$scope.status = false;
				}
			}]
		})
	};
	$scope.submit = function() {
		$data.batchBTG({
			ids: $scope.arr,
			status: 2,
			note: '串联单批量不通过操作'
		}).success(function(data) {
			// console.log('成功');
			$data.loadingShow(data.info);
		})

	};

	$scope.toApproximations = function(item) {
		$state.go('approximations', {
			id: item.id,
			title: item.title,
			uid: item.uid
		});
	};
	$scope.toNopass = function(item) {
		$state.go('nopass', {
			id: item.id,
			title: item.title
		});
	};
})

.controller('ApproximationsCtrl', function($stateParams, $scope, $rootScope, $data, $state) {
	$scope.id = $stateParams.id;
	$scope.uid = $stateParams.uid;
	$scope.title = $stateParams.title;
	$data.ChuanldStatus('GET',$scope.id).success(function(data) {
		// console.log(data);
		$scope.details = data.data;
		$scope.user = {
			id: $scope.details.id,
			uid: $scope.details.uid,
			mobile: $scope.details.mobile,
			title: '约稿：' + $scope.details.title,
			content: '',
			status: 1,
			is_sms: '0'
		};
	});
	$scope.submit = function() {
		$scope.btnStatus = true;//按钮提交状态
		$data.ChuanldStatus('POST', null, $scope.user).success(function(data) {
			// console.log(data);
			$scope.btnStatus = false;//按钮提交状态
			$data.loadingShow(data.info);
			if (data.status == '1') {
				$rootScope.$ionicGoBack();
			}
		})
	}
})

.controller('NopassCtrl', function($rootScope,$scope, $data, $state, $stateParams) {
	$scope.id = $stateParams.id;
	$scope.title = $stateParams.title;
	$scope.user = {
		note: '',
		status: '2',
		id: $scope.id
	};
	$scope.submit = function() {
		$scope.btnStatus = true;//按钮提交状态
		$data.ChuanldStatus('POST', '', $scope.user).success(function(data) {
			$scope.btnStatus = false;//按钮提交状态
			// console.log(data);
			$data.loadingShow(data.info);
			if (data.status == 1) {
				$rootScope.$ionicGoBack();
			}
		})
	}
})

.controller('AlreadyReportCtrl', function($scope, $data, $state, $timeout, $ionicPopup ,$ionicListDelegate) {
	$scope.newValue;//搜索关键字
	$scope.size = 10;
	$scope.page = 1;
	$scope.getDetails = function(searchs) {
		$scope.noMore = true;
		$scope.page = 1;
		$scope.newValue = searchs;
		$data.yBaoti({
			kw:$scope.newValue
		}).success(function(data) {
			// console.log(data);
			$scope.details = data.data;
		})
	};
	$scope.getDetails('');
	$scope.loadMore = function() {
		$scope.page++;
		$data.yBaoti({
			size: $scope.size,
			page: $scope.page,
			kw:$scope.newValue
		})
		.success(function(data) {
			// console.log(data);
			$timeout(function() {
				$scope.noMore = $data.isNoMore(data,$scope.size);
				Array.prototype.push.apply($scope.details, data.data);
			})
		}).finally(function() {
			$timeout(function() {
				$scope.$broadcast('scroll.infiniteScrollComplete');
			}, 500)
		});
	};

	$scope.arr = [];
	$scope.status = false;
	$scope.edit = function() {
		$ionicListDelegate.closeOptionButtons();
		if ($scope.status) {
			$scope.noPass();
		} else {
			$scope.status = true;
		}
	}
	$scope.noPass = function() {
		$ionicPopup.confirm({
			title: '提示信息',
			template: '是否保存？',
			scope: $scope,
			buttons: [{
				text: '<b>确定</b>',
				type: 'button-positive',
				onTap: function(res) {
					$scope.submit();
					$scope.status = false;
				}
			}, {
				text: '取消',
				onTap: function(res) {
					$scope.status = false;
				}
			}]
		})
	};
	$scope.submit = function() {
		$data.batchHT({
			ids: $scope.arr,
			status: 2,
			note: '已报题单批量不通过操作'
		}).success(function(data) {
			$data.loadingShow(data.info);
		})
	};
	$scope.toHuati = function(item,status) {
		$state.go('huati', {
			id: item.id,
			status:status
		})
	};
})

.controller('HuatiCtrl', function($scope, $data, $state, $stateParams, $rootScope) {
	$scope.id = $stateParams.id;
	$scope.status = $stateParams.status;
	
	$scope.user = {
		note: '',
		status: $scope.status,
		id: $scope.id
	};
	if($scope.status==2){
		$scope.user.status = 2;
	};
	$data.BaotiHandle({
		id:$scope.id
	}).success(function(data){
		// console.log(data);
		var regRN = /\r\n/g;
		$scope.title = data.data.title;
		$scope.content = data.data.content.replace(regRN, "<br />　");
	});
	$scope.submit = function() {
      	$scope.btnStatus = true;//按钮提交状态
		$data.BaotiCZ($scope.user).success(function(data) {
      		$scope.btnStatus = false;//按钮提交状态
			$data.loadingShow(data.info);
			if (data.status == '1') {
				$rootScope.$ionicGoBack();
			}
		})
	}
})

.controller('AlreadySweepCtrl', function($scope, $data, $state, $timeout, $ionicPopup,$ionicListDelegate) {
	$scope.newValue;//搜索关键字
	$scope.getDetails = function(searchs) {
		$scope.noMore = true;
		$scope.newValue = searchs;
		$data.yHuati({
			kw:$scope.newValue
		}).success(function(data) {
			// console.log(data);
			$scope.details = data.data;
		})
	};
	$scope.getDetails('');


	$scope.size = 10;
	$scope.page = 1;
	$scope.loadMore = function() {//上拉刷新
		$scope.page++;
			$data.yHuati({
					size: $scope.size,
					page: $scope.page,
					kw:$scope.newValue
				})
				.success(function(data) {
					// console.log(data);
						$scope.noMore = $data.isNoMore(data,$scope.size);
						Array.prototype.push.apply($scope.details, data.data);
				}).finally(function() {
					$timeout(function() {
						$scope.$broadcast('scroll.infiniteScrollComplete');
					}, 500)
				});
	};

	$scope.arr = [];
	$scope.status = false;
	$scope.edit = function() {
		$ionicListDelegate.closeOptionButtons();
		if ($scope.status) {
			$scope.noPass();
		} else {
			$scope.status = true;
		}
	}
	$scope.noPass = function() {
		$ionicPopup.confirm({
			title: '提示信息',
			template: '所选不通过？',
			scope: $scope,
			buttons: [{
				text: '<b>确定</b>',
				type: 'button-positive',
				onTap: function(res) {
					$scope.submit();
					$scope.status = false;
				}
			}, {
				text: '取消',
				onTap: function(res) {
					$scope.status = false;
				}
			}]
		})
	};
	$scope.submit = function() {
		$data.batchBC({
			ids: $scope.arr,
			status: 2,
			note: '已划题单批量不通过操作'
		}).success(function(data) {
			$data.loadingShow(data.info);
		})
	};

	$scope.down = function(id) {
		// console.log(id);
		$data.down({
			id: id
		}).success(function(data) {
			// console.log(data);
		})
	};

	$scope.toAddReb = function(item) {
		$state.go('tab.rebroadcast', {
			id: item.id,
			title: item.title
		});
	}
})

.controller('AddRebroadcastCtrl', function($scope, $data, $filter, $state, $stateParams, ionicDatePicker, $window,$rootScope) {
	$scope.id = $stateParams.id;
	$data.channelList().success(function(data) {
		$scope.channelList = data.data;
		$scope.user = {
			bochu_pindao: $scope.channelList[1].title,
			bochu_title: '',
			bochu_date: $filter('date')(new Date().getTime(),'yyyy-MM-dd'),
			status: '1',
			id: $scope.id
		};
	});
	$data.getHuatiCZ({
		id: $scope.id
	}).success(function(data) {
		// console.log(data);
		var regRN = /\r\n/g;
		$scope.content = data.data.content.replace(regRN, "<br />　");
		$scope.title = data.data.title;
		$scope.uid = data.data.uid;
	});
	/*  	$scope.$on('$ionicView.beforeEnter',function(){
		  	$window.myIscroll = new IScroll('.text_content', {
				scrollbars: true,
				bounce: true,
				preventDefault: true, //让点击事件得以执行
				probeType: 2, //让滚动条滚动正常
				interactiveScrollbars: false,
				shrinkScrollbars: 'scale',
				mouseWheel: true,
				fadeScrollbars: true
			}); 	
	  	})*/

	$scope.datapicker = function() {
		var ipObj1 = {
			callback: function(val) { //Mandatory
				$scope.user.bochu_date = $filter('date')(val, 'yyyy-MM-dd');
			},
			disabledDates: [ //Optional
				// new Date(2015, 5, 16),
				// new Date('Wednesday, August 12, 2015'),
				// new Date("08-16-2016"),
				// new Date(1439676000000)
			],
			from: new Date(), //Optional
			to: new Date(2018, 1, 1), //Optional
			inputDate: new Date(), //Optional
			mondayFirst: false, //Optional
			disableWeekdays: [], //Optional [0,6]
			closeOnSelect: false, //Optional
			templateType: 'popup' //Optional
		};
		ionicDatePicker.openDatePicker(ipObj1);
	};
	$scope.submit = function() {
		$scope.btnStatus = true;//按钮提交状态
		// console.log($scope.user);
		$data.HuatiCZ($scope.user).success(function(data) {
			$scope.btnStatus = false;//按钮提交状态
			$data.loadingShow(data.info);
			if(data.status == '1'){
				$rootScope.$ionicGoBack();
			}
		});
	}
})

.controller('OverPlayCtrl', function($scope,$rootScope, $data, $state, $stateParams, $timeout) {
	$scope.newValue;
	$scope.getDetails = function(searchs) {
		$scope.noMore = true;
		$scope.newValue = searchs;
		$data.BochuList({
			kw:$scope.newValue
		}).success(function(data) {
			// console.log(data);
			$scope.details = data.data;
		});
	};
	$scope.getDetails('');

	$scope.size = 10;
	$scope.page = 1;
	$scope.loadMore = function() {
		$scope.page++;
		$data.BochuList({
				size: $scope.size,
				page: $scope.page,
				kw:$scope.newValue
			})
			.success(function(data) {
				// console.log(data);
				$scope.noMore = $data.isNoMore(data,$scope.size);
				Array.prototype.push.apply($scope.details, data.data);
			}).finally(function() {
				$timeout(function() {
					$scope.$broadcast('scroll.infiniteScrollComplete');
				}, 1000)
			});
	};
		 	
})

.controller('CardCaseCtrl', function($scope, $data, $state, $stateParams,$ionicSlideBoxDelegate,$timeout) {
	$scope.toPersonalPage = function(uid,cardid) {
		$state.go('tab.personal-page', {
			uid:uid,
			cardid: cardid
		});
	};
	$scope.$on('$ionicView.beforeEnter',function(){
		$ionicSlideBoxDelegate.enableSlide(false);	 	
	});
	//待改
	// $data.mingPH({
	// 	type: 3
	// }).success(function(data) {
		// console.log(data);
	// 	$scope.details_b = data.data;
	// });
	// $data.mingPH({
	// 	type: 1
	// }).success(function(data) {
		// console.log(data);
	// 	$scope.details_c = data.data;
	// });
	// $data.mingPH({
	// 	type: 2
	// }).success(function(data) {
		// console.log(data);
	// 	$scope.details_d = data.data;
	// });

	$scope.details_a = [];
	$scope.details_b = [];
	$scope.details_c = [];
	$scope.details_d = [];
	$scope.details_e = [];
	$scope.noMore_a = true;
	$scope.noMore_b = true;
	$scope.noMore_c = true;
	$scope.noMore_d = true;
	$scope.noMore_e = true;
	$scope.size_a = 10;
	$scope.page_a = 0;
	$scope.loadMore_a = function() {
		$scope.page_a++;
		$data.mingPH({
			size: $scope.size_a,
			page: $scope.page_a,
			type: 0
		}).success(function(data) {
			// console.log(data);
			$scope.noMore_a = $scope.isNoMore(data);
			Array.prototype.push.apply($scope.details_a, data.data);
		}).finally(function() {
			$timeout(function(){
				$scope.$broadcast('scroll.infiniteScrollComplete');	 	
			},500)
		});
	};
	//是否还有数据加载（上拉）
	$scope.isNoMore = function(d){
		if(d.data.length<6){
			return false;
		}else{
			return true;
		}
	
	};
	$scope.size_b = 10;
	$scope.page_b = 0;
	$scope.loadMore_b = function() {
		$scope.page_b++;
		$data.mingPH({
			size: $scope.size_b,
			page: $scope.page_b,
			type: 3
		}).success(function(data) {
			// console.log(data);
			$scope.noMore_b = $scope.isNoMore(data);
			Array.prototype.push.apply($scope.details_b, data.data);
		}).finally(function() {
			$timeout(function(){
				$scope.$broadcast('scroll.infiniteScrollComplete');	 	
			},300)
		});
	};
	$scope.size_c = 10;
	$scope.page_c = 0;
	$scope.loadMore_c = function() {
		$scope.page_c++;
		$data.mingPH({
			size: $scope.size_c,
			page: $scope.page_c,
			type: 1
		}).success(function(data) {
			// console.log(data);
			$scope.noMore_c = $scope.isNoMore(data);
			Array.prototype.push.apply($scope.details_c, data.data);
		}).finally(function() {
			$timeout(function(){
				$scope.$broadcast('scroll.infiniteScrollComplete');	 	
			},300)
		});
	};
	$scope.size_d = 10;
	$scope.page_d = 0;
	$scope.loadMore_d = function() {
		$scope.page_d++;
		$data.mingPH({
			size: $scope.size_d,
			page: $scope.page_d,
			type: 2
		}).success(function(data) {
			console.log(data);
			$scope.noMore_d = $scope.isNoMore(data);
			Array.prototype.push.apply($scope.details_d, data.data);
		}).finally(function() {
			$timeout(function(){
				$scope.$broadcast('scroll.infiniteScrollComplete');	 	
			},300)
		});
	};
	$scope.size_e = 10;
	$scope.page_e = 0;
	$scope.loadMore_e = function() {
		$scope.page_e++;
		$data.mingPH({
			size: $scope.size_e,
			page: $scope.page_e,
			type: 4
		}).success(function(data) {
			// console.log(data);
			$scope.noMore_e = $scope.isNoMore(data);
			Array.prototype.push.apply($scope.details_e, data.data);
		}).finally(function() {
			$timeout(function(){
				$scope.$broadcast('scroll.infiniteScrollComplete');	 	
			},300)
		});
	};		
})

.controller('RevisePasswordCtrl', function($scope, $data, $state, $stateParams) {
	$scope.$on('$ionicView.beforeLeave',function(){
		console.log(1);
		$scope.user = {};
	})
	$scope.user = {
		oldpassword: '',
		password: '',
		cpassword: ''
	}
	$scope.submit = function() {
		// console.log($scope.user);
		$scope.btnStatus = true;//按钮提交状态
		$data.revisePassword($scope.user).success(function(data) {
			$scope.btnStatus = false;//按钮提交状态
			// console.log(data);
			$data.loadingShow(data.info);
			if (data.status == 1) {
				$state.go('login');
			} else {
				$data.loadingShow(data.info);
			}
		})
	}
})

.controller('InboxCtrl', function($scope, $data, $state, $stateParams, $ionicPopup, $timeout) {
	$data.getMessage().success(function(data) {
		console.log(data);
		$scope.sysMesg = data.data;
	});
	$data.getMessage({
		type:3
	}).success(function(data) {
		console.log(data);
		$scope.pactMesg = data.data;
	});
	$scope.size = 10;
	$scope.page = 1;
	$scope.noMore = true;
	$scope.loadMore = function(type) {
		$scope.page++;
		$timeout(function() {
			$data.getMessage({
				size: $scope.size,
				page: $scope.page
			}).success(function(data) {
				console.log(data);
				$scope.noMore = $data.isNoMore(data,$scope.size);
				// console.log($scope.noMore);
				Array.prototype.push.apply($scope.sysMesg, data.data);
			}).finally(function() {
				$scope.$broadcast('scroll.infiniteScrollComplete');
			});
		}, 100)
	};

	$scope.deleteMsg = function($index, id) {
		$ionicPopup.confirm({
			title: '提示信息',
			template: '确认删除',
			scope: $scope,
			buttons: [{
				text: '<b>确定</b>',
				type: 'button-positive',
				onTap: function(res) {
					$data.delMessage({
						id: id
					}).success(function(data) {
						$data.loadingShow(data.info);
						if (data.status == '1') {
							$scope.sysMesg.splice($index, 1);
						}
					})
				}
			}, {
				text: '取消'
			}]
		})
	};
	$scope.selectedId = [];
	$scope.selectedIndex = [];
	$scope.updateSelection = function($event, id, $index) {
		var checkbox = $event.target;
		var status = checkbox.checked;
		updateSelected(status, checkbox.value, $index);
	}
	var updateSelected = function(status, id, index) {
		if (status && $scope.selectedId.indexOf(id) == -1) {
			$scope.selectedId.push(id);
			$scope.selectedIndex.push(index);
		}
		if (!status && $scope.selectedId.indexOf(id) != -1) {
			var idx = $scope.selectedId.indexOf(id);
			$scope.selectedId.splice(idx, 1);
			$scope.selectedIndex.splice(idx, 1);
		}
		// console.log($scope.selectedId);
		// console.log($scope.selectedIndex);
	};
	var render = function() {
		angular.forEach($scope.selectedIndex, function(data, index, array) {
			console.log(data,index,array);
			$scope.sysMesg.splice(data, 1);
		})
	};
	$scope.delMessages = function() {
		if ($scope.selectedId.length != 0) {
			$ionicPopup.confirm({
				title: '提示信息',
				template: '确认删除？',
				scope: $scope,
				buttons: [{
					text: '<b>确定</b>',
					type: 'button-positive',
					onTap: function(res) {
						$data.delMessages({
							ids: $scope.selectedId
						}).success(function(data) {
							$data.loadingShow(data.info);
							if (data.status == '1') {
								render();
							}
						})
					}
				}, {
					text: '取消'
				}]
			})
		} else {
			$data.loadingShow('请选择消息');
		}
	};
	$scope.selectAll = false;
	$scope.all = function(m) {
		var id;
		for (var i = 0; i < $scope.sysMesg.length; i++) {
			id = $scope.sysMesg[i].msg_id;
			if (m && $scope.selectedId.indexOf(id) == -1) {
				$scope.sysMesg[i].state = true;
				$scope.selectedId.push(id);
			}
			if (!m && $scope.selectedId.indexOf(id) != -1) {
				$scope.sysMesg[i].state = false;
				$scope.selectedId.splice($scope.selectedId.indexOf(id), 1);
			}
		}
		// console.log($scope.selectedId);
	};
	$scope.cancel = function() {
		$scope.showCheckbox = false;
	}
	$scope.toInboxContent = function(id){
		$state.go('tab.inbox-content',{
			id:id
		})
	}



})

.controller('InboxContentCtrl',function($scope, $data, $state, $stateParams, $ionicPopup, $timeout){
	$scope.id = $stateParams.id;
	$data.getMessageInfo({
		id:$scope.id
	}).success(function(data){
		if(data.status == 0){

		}
		console.log(data);
	}).error(function(){
		$scope.showError = true;
	});

	$scope.xitongMsg = function(){
			 	
	};
	$scope.yuegaoMsg = function(){
	};

})