angular.module('user-controllers', [])
    .controller('AccountCtrl', function($ionicHistory, $scope, $data, $rootScope, $state, $ionicLoading, $timeout, $stateParams, $ionicPopup, $ionicBackdrop, $ionicPopover, $stateParams) {
        $scope.getDetails = function() {
            $data.userInfo().success(function(data) {
                $scope.img = data.data.avatar + Math.random();
            });
            $data.vipInfoStatistics().success(function(data) {
                $scope.data = data;
            });
        };
        $scope.$on('$ionicView.beforeEnter', function() {
            //进入之前
        });
        $scope.getDetails();
        $rootScope.$on('img', function(event, data) {
            $scope.img = data;
        });
        $scope.jumpTo = function() {
            $state.go('tab.management')
        };
        $scope.goSetting = function() {
            $state.go('setting');
        };
        //更新我的首页
        $scope.doRefresh = function() {
            $data.vipInfoStatistics()
                .success(function(data) {
                    $scope.data = data;
                }).error(function() {
                    $data.loadingShow('更新失败');
                }).finally(function() {
                    $scope.$broadcast('scroll.refreshComplete');
                });
        }
    })

.controller('ManagementCtrl', function($scope, $data, $ionicScrollDelegate, $rootScope, $state, $timeout, $ionicPopup) {
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
            $scope.noMore = $data.isNoMore(data, $scope.size);
            Array.prototype.push.apply($scope.items, data.data);
            $ionicScrollDelegate.resize();
        }).finally(function() {
            $timeout(function() {
                $scope.$broadcast('scroll.infiniteScrollComplete');
            }, 100)
        });
    };
    $scope.checkMember = function(item, $index) {
        console.log(item);
        if (item.check == "0") {
            $ionicPopup.confirm({
                title: '提示信息',
                template: '是否审核通过？',
                scope: $scope,
                buttons: [{
                    text: '<b>确定</b>',
                    type: 'button-positive',
                    onTap: function(res) {
                        $data.checkMember({
                            uid: item.uid,
                            status: 1
                        }).success(function(data) {
                            console.log(data)
                            $data.loadingShow(data.info);
                            if (data.status == '1') {
                                $scope.items[$index].check = '1';
                            }
                        });
                    }
                }, {
                    text: '取消'
                }]
            })
        }
        if (item.check == "1") {
            $ionicPopup.confirm({
                title: '提示信息',
                template: '是否取消审核通过？',
                scope: $scope,
                buttons: [{
                    text: '<b>确定</b>',
                    type: 'button-positive',
                    onTap: function(res) {
                        $data.checkMember({
                            uid: item.uid,
                            status: 0
                        }).success(function(data) {
                            console.log(data)
                            $data.loadingShow(data.info);
                            if (data.status == '1') {
                                $scope.items[$index].check = '0';
                            }
                        });
                    }
                }, {
                    text: '取消'
                }]
            })
        }

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
    if ($scope.cardid) {
        $data.viewMPH({ id: $scope.cardid }).success(function(data) {
            $scope.details = data.data;
            $scope.cardgroups = data.groups;
            $scope.user = {
                id: $scope.cardid,
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
    } else {
        $data.personalDetails($scope.uid).success(function(data) {
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
                $scope.birthday = val;
                $scope.user.birthday = $filter('date')(val, 'yyyy-MM-dd');
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
        if ($scope.cardid) {
            $data.editMPH($scope.user).success(function(data) {
                $data.loadingShow(data.info)
                if (data.status == 1) {
                    $data.viewMPH({ id: $scope.cardid }).success(function(data) {
                        $scope.details = data.data;
                    })
                }
            })
        } else {
            $data.editMember($scope.user).success(function(data) {
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
    $scope.getDetails = function() {
        $data.userInfo().success(function(data) {
            $scope.dataInit = data.data;
            $scope.img = $scope.dataInit.avatar + Math.random();
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
    $scope.$on('$ionicView.beforeEnter', function() {});
    $scope.$on('$ionicView.beforeLeave', function() {});
    $scope.openCamera = function(type) {
        document.addEventListener("deviceready", function() {
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
                    var img = "data:image/jpeg;base64," + results;
                    $data.editPic({
                        avatar: img,
                        step: 'cropper',
                        thumb: 1
                    }).success(function(data) {
                        $data.loadingShow(data.info);
                        if (data.status == '1') {
                            $scope.img = data.data.avatar + Math.random();
                            $rootScope.$broadcast('img', $scope.img);
                        }
                    })
                }, function(err) {
                    // error
                });
        }, false);
        $scope.popover.hide();
    };
    /*cordova相册选择器*/
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
                    $data.editPic({
                        avatar: imgData[0]
                    }).success(function(data) {
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

    $scope.delText = function($event) {
        $($event.target).siblings('input').val('');
    };
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
    };
    $scope.nickname = function() {
        var value = $scope.dataInit.nickname;
        var template = '<input type="text" ng-model="profile.nickname" get-focus><i ng-if="profile.nickname.length>0" class="ion ion-close-circled Octopus" id="foucus" ng-click="delText($event)" ></i>';
        $scope.tanchu('昵称', template, 'popup-nickname', function(e) {
            $data.profile({
                nickname: $scope.profile.nickname
            }).success(function(data) {
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
            $scope.province = data;
        })
    }

    $scope.city_cn = function() {
        $scope.loadAddress();
        $scope.add = {};
        $scope.getProvince = function($index, level, id) {
            $scope.add.province = id;
            $scope.city = '';
            $('.add-checkbox').eq($index).addClass('add-checkbox-actived').siblings().removeClass('add-checkbox-actived');
            $data.getCityList($scope.add.province, 2).success(function(data) {
                $scope.city = data;
            });

        }
        $scope.getCity = function($index, level, id) {
            $scope.add.city = id;
            $scope.district = '';
            $('.add-checkbox').eq($index).addClass('add-checkbox-actived').siblings().removeClass('add-checkbox-actived');
            $data.getCityList($scope.add.city, 3).success(function(data) {
                $scope.district = data
                if (data.data.length == 0) {
                    $scope.flag = true;
                } else {
                    $scope.flag = false;
                }
            })
        }
        $scope.getDistrict = function($index, level, id) {
            $scope.add.district = id;
            $('.add-checkbox').eq($index).addClass('add-checkbox-actived').siblings().removeClass('add-checkbox-actived');
        }
        $scope.tanchu('所属地区', '', 'popup-city_cn', function(e) {
            $data.profile($scope.add).success(function(data) {
                $data.loadingShow(data.info);
                if (data.status == '1') {
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
    $scope.clearCache = function() {
        $ionicPopup.confirm({
            title: '提示信息',
            template: '清空缓存?',
            buttons: [{
                text: '<b>确定</b>',
                type: 'button-positive',
                onTap: function(event) {
                    var data = $data.storeData('userInfo');
                    var name = $data.storeData('username');
                    $data.clear();
                    $data.storeData("isLogin", "yes");
                    $data.storeData("userInfo", data);
                    $data.storeData("username", name);
                    $scope.bytesToSize();
                }
            }, {
                text: '取消'
            }]
        })
    }
    $scope.showCacheDialog = function() {
        $ionicPopup.confirm({
            title: '提示信息',
            template: '确认退出登录?',
            buttons: [{
                text: '<b>确定</b>',
                type: 'button-positive',
                onTap: function(event) {
                    $data.storeData('isLogin', 'no')
                    $state.go('login');
                }
            }, {
                text: '取消'
            }]
        })
    };
    /*计算缓存大小*/
    $scope.sizeof = function() {
        var total = 0,
            charCode,
            str,
            i,
            len;
        str = JSON.stringify(localStorage.valueOf());
        for (i = 0, len = str.length; i < len; i++) {
            charCode = str.charCodeAt(i);
            if (charCode <= 0x007f) {
                total += 1;
            } else if (charCode <= 0x07ff) {
                total += 2;
            } else if (charCode <= 0xffff) {
                total += 3;
            } else {
                total += 4;
            }
        }
        return total;
    };
    $scope.bytesToSize = function(bytes) {
        bytes = $scope.sizeof();
        if (bytes === 0) return '0 B';

        var k = 1024;

        sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

        i = Math.floor(Math.log(bytes) / Math.log(k));
        if (i == 0) {
            return "0KB";
        }
        return (bytes / Math.pow(k, i)).toFixed(1) + ' ' + sizes[i];
    };
})

.controller('AllNewsCtrl', function($scope, $data, $state, $rootScope, $timeout) {
    $scope.details = [];

    $scope.newValue; //搜索关键字
    var deregister;
    $scope.getDetails = function(searchs) {
        $scope.noMore = true;
        $scope.newValue = searchs;
        $data.allNews({
            kw: $scope.newValue
        }).success(function(data) {
            $scope.details = data.data;
        })
    };
    $scope.getDetails('');
    //根据报题提交 更新已阅视图
    $scope.$on('$ionicView.enter', function() {
        $rootScope.$on('is_baoti', function(event, data) {
            $timeout(function() {
                $scope.details[data.index].is_baoti = data.is_baoti;
                $scope.details[data.index].is_read = 1;
            }, 300)
        });
    });
    $scope.$on('$ionicView.enter', function() {

    });
    $scope.size = 10;
    $scope.page = 1;
    $scope.loadMore = function() {
        $scope.page++;
        $data.allNews({
            size: $scope.size,
            page: $scope.page,
            kw: $scope.newValue
        }).success(function(data) {
            $scope.noMore = $data.isNoMore(data, $scope.size);
            Array.prototype.push.apply($scope.details, data.data);
        }).finally(function() {
            $timeout(function() {
                $scope.$broadcast('scroll.infiniteScrollComplete');
            }, 300)
        });
    };
    $scope.toParticulars = function(id) {
        $state.go('tab.news-particulars', {
            id: id
        })
    };
    $scope.toBaoti = function(id, $index) {
        $state.go('baoti', {
            id: id,
            index: $index
        })
    };
})

.controller('BaotiCtrl', function($scope, $data, $state, $stateParams, $rootScope) {
    $scope.id = $stateParams.id;
    $scope.index = $stateParams.index;
    $scope.user = {
        note: '',
        status: '1',
        id: $scope.id
    };
    $data.BaotiHandle({
        id: $scope.id
    }).success(function(data) {
        var regRN = /\r\n/g;
        $scope.title = data.data.title;
        $scope.content = data.data.content.replace(regRN, "<br />　");
    });
    $scope.submit = function() {
        $scope.btnStatus = true; //按钮提交状态
        $data.BaotiHandlePass($scope.user).success(function(data) {
            $scope.btnStatus = false; //按钮提交状态
            $data.loadingShow(data.info);
            if (data.status == '1') {
                $rootScope.$ionicGoBack();
                $rootScope.$broadcast('is_baoti', { //发送已阅事件
                    index: $scope.index,
                    is_baoti: $scope.user.status
                });
            }
        })
    }
})

.controller('NewsParticularsCtrl', function($scope, $rootScope, $data, $state, $stateParams, $ionicSlideBoxDelegate, $sce) {
    $scope.id = $stateParams.id;
    $data.getAvatar({
        uid: $scope.id,
        type: 'small'
    }).success(function(data) {
        $scope.avatar = data.data.avatar;
    })
    $data.newParticulars({
        id: $scope.id,
        appkey: $rootScope.appkey
    }).success(function(data) {
        $scope.details = data;
        $scope.content = data.data.content.replace(/\r\n/g, "<br />　");
        if (data.data.videos) {
            $scope.videos = data.data.videos;
            angular.forEach($scope.videos, function(value) {
                value.config = {
                    sources: [{
                        src: $sce.trustAsResourceUrl(value.app_savepath),
                        type: "video/mp4"
                    }],
                    tracks: [{
                        src: "http://www.videogular.com/assets/subs/pale-blue-dot.vtt",
                        kind: "subtitles",
                        srclang: "en",
                        label: "English",
                        default: ""
                    }],
                    theme: "lib/videogular-themes-default/videogular.css"
                };
            })
        }

    })
    $scope.trustSrc = function(src) {
        return $sce.trustAsResourceUrl(src)
    }
    $scope.nextSlide = function() {
        $ionicSlideBoxDelegate.next();
    };
    $data.history({ id: $scope.id }).success(function(data) {
        $scope.historyData = data.data;
    })
})

.controller('AllChuanLianCtrl', function($scope, $rootScope, $data, $state, $ionicPopup, $timeout, $ionicListDelegate) {

    $scope.newValue; //搜索关键字
    $scope.getDetails = function(searchs) {
        $scope.noMore = true;
        $scope.newValue = searchs;
        $data.allChuanld({
            kw: $scope.newValue
        }).success(function(data) {
            console.log(data)
            $scope.items = data.data;
        })
    };
    $scope.getDetails('');
    //根据约稿提交 更新已阅视图
    $scope.$on('$ionicView.enter', function() {
        $rootScope.$on('yuegao', function(event, res) {
            $timeout(function() {
                $scope.items[res.index].is_baoti = res.is_baoti;
            }, 300)
        })
    });
    $scope.size = 10;
    $scope.page = 1;
    $scope.loadMore = function() {
        $scope.page++;
        $data.allChuanld({
                size: $scope.size,
                page: $scope.page,
                kw: $scope.newValue
            })
            .success(function(data) {
                $scope.noMore = $data.isNoMore(data, $scope.size);
                Array.prototype.push.apply($scope.items, data.data);
            }).finally(function() {
                $scope.$broadcast('scroll.infiniteScrollComplete');
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
        $data.batchBTG({
            ids: $scope.arr,
            status: 2,
            note: '串联单批量不通过操作'
        }).success(function(data) {
            $data.loadingShow(data.info);
        })

    };

    $scope.toApproximations = function(item, index) {
        $state.go('approximations', {
            id: item.id,
            title: item.title,
            uid: item.uid,
            index: index
        });
    };
    $scope.toNopass = function(item, index) {
        $state.go('nopass', {
            id: item.id,
            title: item.title,
            index: index
        });
    };
})

.controller('ApproximationsCtrl', function($stateParams, $scope, $rootScope, $data, $state) {
    $scope.id = $stateParams.id;
    $scope.uid = $stateParams.uid;
    $scope.title = $stateParams.title;
    $scope.index = $stateParams.index;
    $data.ChuanldStatus('GET', $scope.id).success(function(data) {
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
        $scope.btnStatus = true; //按钮提交状态
        $data.ChuanldStatus('POST', null, $scope.user).success(function(data) {
            $scope.btnStatus = false; //按钮提交状态
            $data.loadingShow(data.info);
            if (data.status == '1') {
                $rootScope.$ionicGoBack();
                $rootScope.$broadcast('yuegao', {
                    is_baoti: $scope.user.status,
                    index: $scope.index
                });
            }
        })
    }
})

.controller('NopassCtrl', function($rootScope, $scope, $data, $state, $stateParams) {
    $scope.id = $stateParams.id;
    $scope.index = $stateParams.index;
    $scope.title = $stateParams.title;
    $scope.user = {
        note: '',
        status: '2',
        id: $scope.id
    };
    $scope.submit = function() {
        $scope.btnStatus = true; //按钮提交状态
        $data.ChuanldStatus('POST', '', $scope.user).success(function(data) {
            $scope.btnStatus = false; //按钮提交状态
            $data.loadingShow(data.info);
            if (data.status == 1) {
                $rootScope.$ionicGoBack();
                $rootScope.$broadcast('yuegao', {
                    is_baoti: $scope.user.status,
                    index: $scope.index
                });
            }
        })
    }
})

.controller('AlreadyReportCtrl', function($rootScope, $scope, $data, $state, $timeout, $ionicPopup, $ionicListDelegate) {
    $scope.newValue; //搜索关键字
    $scope.size = 10;
    $scope.page = 1;
    $scope.getDetails = function(searchs) {
        $scope.noMore = true;
        $scope.page = 1;
        $scope.newValue = searchs;
        $data.yBaoti({
            kw: $scope.newValue
        }).success(function(data) {
            $scope.details = data.data;
        })
    };
    $scope.getDetails('');
    $scope.loadMore = function() {
        $scope.page++;
        $data.yBaoti({
                size: $scope.size,
                page: $scope.page,
                kw: $scope.newValue
            })
            .success(function(data) {
                $scope.noMore = $data.isNoMore(data, $scope.size);
                Array.prototype.push.apply($scope.details, data.data);
            }).finally(function() {
                $timeout(function() {
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                }, 500)
            });
    };
    //根据划题提交 更新已阅视图
    $scope.$on('$ionicView.enter', function() {
        $rootScope.$on('is_huati', function(event, res) {
            $timeout(function() {
                $scope.details[res.index].is_huati = res.is_huati;
            }, 300)
        })
    });
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
    $scope.toHuati = function(item, index, status) {
        $state.go('huati', {
            id: item.id,
            status: status + '-' + index
        })
    };
})

.controller('HuatiCtrl', function($scope, $data, $state, $stateParams, $rootScope) {
    $scope.id = $stateParams.id;
    $scope.status = $stateParams.status.split('-')[0];
    $scope.index = $stateParams.status.split('-')[1];
    $scope.user = {
        note: '',
        status: $scope.status,
        id: $scope.id
    };
    if ($scope.status == 2) {
        $scope.user.status = 2;
    };
    $data.BaotiHandle({
        id: $scope.id
    }).success(function(data) {
        var regRN = /\r\n/g;
        $scope.title = data.data.title;
        $scope.content = data.data.content.replace(regRN, "<br />　");
    });
    $scope.submit = function() {
        $scope.btnStatus = true; //按钮提交状态
        $data.BaotiCZ($scope.user).success(function(data) {
            $scope.btnStatus = false; //按钮提交状态
            $data.loadingShow(data.info);
            if (data.status == '1') {
                $rootScope.$ionicGoBack();
                $rootScope.$broadcast('is_huati', {
                    is_huati: $scope.user.status,
                    index: $scope.index
                });
            }
        })
    }
})

.controller('AlreadySweepCtrl', function($rootScope, $scope, $data, $state, $timeout, $ionicPopup, $ionicListDelegate) {
        $scope.newValue; //搜索关键字
        $scope.getDetails = function(searchs) {
            $scope.noMore = true;
            $scope.newValue = searchs;
            $data.yHuati({
                kw: $scope.newValue
            }).success(function(data) {
                $scope.details = data.data;
            })
        };
        $scope.getDetails('');
        //根据报题提交 更新已阅视图
        $scope.$on('$ionicView.enter', function() {
            $rootScope.$on('bochu', function(event, data) {
                $timeout(function() {
                    $scope.details[data.index].is_bochu = data.status;
                }, 300)
            });
        });
        $scope.size = 10;
        $scope.page = 1;
        $scope.loadMore = function() { //上拉刷新
            $scope.page++;
            $data.yHuati({
                    size: $scope.size,
                    page: $scope.page,
                    kw: $scope.newValue
                })
                .success(function(data) {
                    $scope.noMore = $data.isNoMore(data, $scope.size);
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
            $data.down({
                id: id
            }).success(function(data) {})
        };

        $scope.toAddReb = function(item, index) {
            $state.go('tab.rebroadcast', {
                id: item.id,
                index: index
            });
        }
        $scope.toDontBroadcast = function(item, index) {
            $state.go('tab.DontBroadcast', {
                id: item.id,
                index: index
            });
        }
    })
    .controller('DontBroadcastCtrl', function($scope, $data, $filter, $state, $stateParams, ionicDatePicker, $window, $rootScope) {
        $scope.id = $stateParams.id;
        $scope.index = $stateParams.index;
        $scope.user = {
            note: '',
            status: '2',
            id: $scope.id
        };
        $data.getHuatiCZ({
            id: $scope.id
        }).success(function(data) {
            $scope.title = data.data.title;
            $scope.uid = data.data.uid;
        });
        $scope.submit = function() {
            $scope.btnStatus = true; //按钮提交状态
            $data.HuatiCZ($scope.user).success(function(data) {
                $scope.btnStatus = false; //按钮提交状态
                $data.loadingShow(data.info);
                if (data.status == '1') {
                    $rootScope.$ionicGoBack();
                    $rootScope.$broadcast('bochu', {
                        index: $scope.index,
                        status: 2
                    })
                }
            });
        }
    })
    .controller('AddRebroadcastCtrl', function($scope, $data, $filter, $state, $stateParams, ionicDatePicker, $window, $rootScope) {
        $scope.id = $stateParams.id;
        $scope.index = $stateParams.index;
        $data.channelList().success(function(data) {
            $scope.channelList = data.data;
            $scope.user = {
                bochu_pindao: $scope.channelList[1].title,
                bochu_title: '',
                bochu_date: $filter('date')(new Date().getTime(), 'yyyy-MM-dd'),
                status: '1',
                id: $scope.id
            };
        });
        $data.getHuatiCZ({
            id: $scope.id
        }).success(function(data) {
            var regRN = /\r\n/g;
            $scope.content = data.data.content.replace(regRN, "<br />　");
            $scope.title = data.data.title;
            $scope.uid = data.data.uid;
        });
        /*$scope.$on('$ionicView.beforeEnter',function(){
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
            $scope.btnStatus = true; //按钮提交状态
            $data.HuatiCZ($scope.user).success(function(data) {
                $scope.btnStatus = false; //按钮提交状态
                $data.loadingShow(data.info);
                if (data.status == '1') {
                    $rootScope.$ionicGoBack();
                    $rootScope.$broadcast('bochu', {
                        index: $scope.index,
                        status: 1
                    })
                }
            });
        }
    })

.controller('OverPlayCtrl', function($scope, $rootScope, $data, $state, $stateParams, $timeout) {
    $scope.newValue;
    $scope.getDetails = function(searchs) {
        $scope.noMore = true;
        $scope.newValue = searchs;
        $data.BochuList({
            kw: $scope.newValue
        }).success(function(data) {
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
                kw: $scope.newValue
            })
            .success(function(data) {
                $scope.noMore = $data.isNoMore(data, $scope.size);
                Array.prototype.push.apply($scope.details, data.data);
            }).finally(function() {
                $timeout(function() {
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                }, 1000)
            });
    };
})

.controller('CardCaseCtrl', function($scope, $data, $state, $stateParams, $ionicSlideBoxDelegate, $timeout) {
    $scope.toPersonalPage = function(uid, cardid) {
        $state.go('tab.personal-page', {
            uid: uid,
            cardid: cardid
        });
    };
    $scope.$on('$ionicView.beforeEnter', function() {
        $ionicSlideBoxDelegate.enableSlide(false);
    });
    //待改
    // $data.mingPH({
    // 	type: 3
    // }).success(function(data) {
    // 	$scope.details_b = data.data;
    // });
    // $data.mingPH({
    // 	type: 1
    // }).success(function(data) {
    // 	$scope.details_c = data.data;
    // });
    // $data.mingPH({
    // 	type: 2
    // }).success(function(data) {
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
            $scope.noMore_a = $scope.isNoMore(data);
            Array.prototype.push.apply($scope.details_a, data.data);
        }).finally(function() {
            $timeout(function() {
                $scope.$broadcast('scroll.infiniteScrollComplete');
            }, 500)
        });
    };
    //是否还有数据加载（上拉）
    $scope.isNoMore = function(d) {
        if (d.data.length < 6) {
            return false;
        } else {
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
            $scope.noMore_b = $scope.isNoMore(data);
            Array.prototype.push.apply($scope.details_b, data.data);
        }).finally(function() {
            $timeout(function() {
                $scope.$broadcast('scroll.infiniteScrollComplete');
            }, 300)
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
            $scope.noMore_c = $scope.isNoMore(data);
            Array.prototype.push.apply($scope.details_c, data.data);
        }).finally(function() {
            $timeout(function() {
                $scope.$broadcast('scroll.infiniteScrollComplete');
            }, 300)
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
            $scope.noMore_d = $scope.isNoMore(data);
            Array.prototype.push.apply($scope.details_d, data.data);
        }).finally(function() {
            $timeout(function() {
                $scope.$broadcast('scroll.infiniteScrollComplete');
            }, 300)
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
            $scope.noMore_e = $scope.isNoMore(data);
            Array.prototype.push.apply($scope.details_e, data.data);
        }).finally(function() {
            $timeout(function() {
                $scope.$broadcast('scroll.infiniteScrollComplete');
            }, 300)
        });
    };
})

.controller('RevisePasswordCtrl', function($scope, $data, $state, $stateParams) {
    $scope.$on('$ionicView.beforeLeave', function() {
        $scope.user = {};
    })
    $scope.user = {
        oldpassword: '',
        password: '',
        cpassword: ''
    }
    $scope.submit = function() {
        $scope.btnStatus = true; //按钮提交状态
        $data.revisePassword($scope.user).success(function(data) {
            $scope.btnStatus = false; //按钮提交状态
            $data.loadingShow(data.info);
            if (data.status == 1) {
                $state.go('login');
            } else {
                $data.loadingShow(data.info);
            }
        })
    }
})

.controller('InboxCtrl', function($scope, $data, $state, $stateParams, $ionicPopup, $timeout, $ionicSlideBoxDelegate, $ionicLoading) {
    $scope.msgIndexInit = $stateParams.index;
    $timeout(function() {
            $ionicSlideBoxDelegate.$getByHandle('importance').slide($scope.msgIndexInit);
        }, 400)
        /*
         **禁止选项卡滑动
         */
    $scope.$on('$ionicView.beforeEnter', function() {
        $ionicSlideBoxDelegate.enableSlide(false);
    });

    $data.getMessage().success(function(data) {
        $scope.sysMesg = data.data;
    });
    $data.getMessage({
        type: 3
    }).success(function(data) {
        $scope.pactMesg = data.data;
    });
    $scope.selectAll = false; //全选按钮
    $scope.selectedId = []; //复选框id
    $scope.selectedIndex = []; //复选框下标数组
    /*全选遍历*/
    $scope.selectAllChange = function(checked) {
        var id;
        for (var i = 0; i < $scope.pactMesg.length; i++) {
            id = $scope.pactMesg[i].msg_id;
            if (checked && $scope.selectedId.indexOf(id) == -1) {
                $scope.pactMesg[i].state = true;
                $scope.selectedId.push(id);
            }
            if (!checked && $scope.selectedId.indexOf(id) != -1) {
                $scope.pactMesg[i].state = false;
                $scope.selectedId.splice($scope.selectedId.indexOf(id), 1);
            }
        }
        for (var i = 0; i < $scope.sysMesg.length; i++) {
            id = $scope.sysMesg[i].msg_id;
            if (checked && $scope.selectedId.indexOf(id) == -1) {
                $scope.sysMesg[i].state = true;
                $scope.selectedId.push(id);
            }
            if (!checked && $scope.selectedId.indexOf(id) != -1) {
                $scope.sysMesg[i].state = false;
                $scope.selectedId.splice($scope.selectedId.indexOf(id), 1);
            }
        }
    };



    $scope.cancel = function() { //关闭编辑视图
        $scope.showCheckbox = false;
    };
    $scope.toInboxContent = function(id) { //查看消息内容
        $state.go('tab.inbox-content', {
            id: id
        })
    };
    $scope.pageStatus = function(index) {
        $ionicSlideBoxDelegate.$getByHandle('importance').slide(index);
    };
    $scope.slideHasChanged = function($index) {
        $('.inbox-head').children().eq($index).addClass('selected').siblings().removeClass('selected');
    };
})

.controller('InboxPactCtrl', function($scope, $data, $state, $rootScope, $stateParams, $ionicPopup, $timeout, $ionicSlideBoxDelegate, $ionicLoading) {
        $scope.size = 10;
        $scope.page = 1;
        $scope.noMore = true;
        $scope.loadMore = function() {
            $scope.page++;
            $data.getMessage({
                size: $scope.size,
                page: $scope.page,
                type: 3
            }).success(function(data) {
                $scope.noMore = $data.isNoMore(data, $scope.size);
                Array.prototype.push.apply($scope.pactMesg, data.data);
            }).finally(function() {
                $timeout(function() {
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                }, 200)
            });
        };
        //消息删除确认框
        $scope.deleteMsg = function($index, id, items) {
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
                                items.splice($index, 1);
                            }
                        })
                    }
                }, {
                    text: '取消'
                }]
            })
        };



        $scope.updateSelection = function($event, id, $index) {
            var checkbox = $event.target;
            var status = checkbox.checked;
            updateSelected(status, checkbox.value, $index);
        };
        /*单选*/
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
            /*是否全部选中了*/
            if ($scope.selectedId.length == $scope.pactMesg.length) {
                $rootScope.selectAll = true;
            } else {
                $rootScope.selectAll = false;
            }
        };


        //批量删除 更新视图以及数据
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
        var render = function() { //批量删除 更新页面视图，但不更新数据
            angular.forEach($scope.selectedIndex, function(data, index, array) {
                $scope.pactMesg.splice(data, 1);
            })
        };
    })
    .controller('InboxSysCtrl', function($scope, $rootScope, $data, $state, $stateParams, $ionicPopup, $timeout, $ionicSlideBoxDelegate, $ionicLoading) {
        $scope.size = 10;
        $scope.page = 1;
        $scope.noMore = true;
        $scope.loadMore = function() {
            $scope.page++;
            $data.getMessage({
                size: $scope.size,
                page: $scope.page,
            }).success(function(data) {
                $scope.noMore = $data.isNoMore(data, $scope.size);
                Array.prototype.push.apply($scope.sysMesg, data.data);
            }).finally(function() {
                $timeout(function() {
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                }, 200)
            });
        };
        //消息删除确认框
        $scope.deleteMsg = function($index, id, items) {
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
                                items.splice($index, 1);
                            }
                        })
                    }
                }, {
                    text: '取消'
                }]
            })
        };
        $scope.updateSelection = function($event, id, $index) {
            var checkbox = $event.target;
            var status = checkbox.checked;
            updateSelected(status, checkbox.value, $index);
        };
        /*单选*/
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
            /*是否全部选中了*/
            if ($scope.selectedId.length == $scope.sysMesg.length) {
                $rootScope.selectAll = true;
            } else {
                $rootScope.selectAll = false;
            }
        };

        //批量删除 更新视图以及数据
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
        var render = function() { //批量删除 更新页面视图，但不更新数据
            angular.forEach($scope.selectedIndex, function(data, index, array) {
                $scope.sysMesg.splice(data, 1);
            })
        };
    })

.controller('InboxContentCtrl', function($scope, $data, $state, $stateParams, $ionicPopup, $timeout, $ionicSlideBoxDelegate) {
    $scope.id = $stateParams.id;
    $data.getMessageInfo({
        id: $scope.id
    }).success(function(data, status) {
        if (data.status == 0) {

        }
    }).error(function(data, status) {
        $scope.html = data;
        $scope.status = status;
        $scope.showError = true;
    });

    $scope.pageStatus = function(index) {
        $ionicSlideBoxDelegate.$getByHandle('importance').slide(index);
    }
    $scope.slideHasChanged = function($index) {
        $('.inbox-head').children().eq($index).addClass('selected').siblings().removeClass('selected');
    }
})