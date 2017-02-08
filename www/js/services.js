angular.module('starter.services', [])
    /*http拦截器*/
    .factory('AuthInterceptor', function($rootScope, $q, $location) {
        return {
            request: function(config) {
                config.headers = config.headers || {};
                if (localStorage.userInfo && angular.fromJson(localStorage.userInfo).data.token) {
                    config.headers.Authorization = 'Basic ' + btoa(angular.fromJson(localStorage.userInfo).data.token + ':');
                }
                return config;
            },
            requestError: function(err) {

                return $q.reject(err);
            },
            response: function(res) {

                return res;
            },
            responseError: function(err) {
                if (-1 === err.status) {
                    // 远程服务器无响应
                } else if (500 === err.status) {
                    // 处理各类自定义错误
                } else if (501 === err.status) {
                    // ...
                } else if (err.status == 401 || err.status == 403) {
                    $location.path('/login');
                }
                return $q.reject(err);
            }
        };
    })
    /*.service('loadData', function($rootScope, $data, $timeout) {
        this.moredata = true,
        this.items = [],
        this.keyValue = '',
        this.catid = '',
        this.pagination = {
            size: 10,
            page: 0
        },
        this.init = function(catid) {
            var that = this;
            that.catid = catid;
        },
        this.search = function(searchs) {
            var that = this;
            that.keyValue = searchs;
            that.pagination.page = 1;
            $data.getHomeDataList({
                size: that.pagination.size,
                page: that.pagination.page,
                kw: that.keyValue,
                catid: that.catid
            }).success(function(data) {
                console.log(data);
                that.items = data.data;
            })
        },
        this.doRefresh = function() {
            $timeout(function() {
                $rootScope.$broadcast('scroll.refreshComplete');
            }, 1000);
        },
        this.loadMore = function() {
            this.pagination.page += 1;
            var that = this;
            $data.getHomeDataList({
                size: that.pagination.size,
                page: that.pagination.page,
                kw: that.keyValue,
                catid: that.catid
            }).success(function(data) {
                console.log(data);
                that.items = that.items.concat(data.data);
                if (data.data.length < that.pagination.size) {
                    that.moredata = false;
                };
                $rootScope.$broadcast('scroll.infiniteScrollComplete');
            })
        }
    })*/
    .factory('$data', function($rootScope, $http, $window, $ionicLoading, $timeout, $ionicPopup) {
        var ip = 'http://cctvadmin.ivtime.net';
        return {
            //登录请求
            login: function(data) {
                return $http({
                    method: "POST",
                    url: ip + "/ManageApp/Login/index",
                    data: data,
                    timeout: 5000
                });
            },
            //注册信息提交接口(第二步)
            registerSecond: function(data) {
                return $http({
                    method: 'POST',
                    url: ip + "/ManageApp/Login/registerInfo",
                    data: data,
                    timeout: 5000
                })
            },
            //地区列表
            getCityList: function(parent, type) {
                return $http({
                    method: 'get',
                    cache: false,
                    url: ip + '/ManageApp/Public/public_getRegion?parent=' + parent + '&type=' + type,
                    timeout: 5000
                })
            },

            //首页数据
            getHomeData: function(data) {
                return $http({
                    method: 'GET',
                    url: ip + '/ManageApp/Index/index',
                })
            },
            getHomeDataList: function(data) {
                return $http({
                    method: 'GET',
                    url: ip + '/ManageApp/Index/lists',
                    params: data,
                })

            },
            //广告图
            getBanner: function(data) {
                return $http({
                    method: 'GET',
                    url: ip + '/ManageApp/Index/ads',
                    headers: {}
                })
            },
            //新闻详情
            getNewsDetails: function(data) {
                return $http({
                    method: 'GET',
                    url: ip + '/ManageApp/Index/view',
                    params: {
                        id: data
                    }
                })
            },
            //6.修改密码
            revisePassword: function(data) {
                return $http({
                    method: 'POST',
                    url: ip + '/ManageApp/User/editPwd',
                    data: data,
                    timeout: 5000
                })
            },
            //7.编辑头像
            editPic: function(data) {
                return $http({
                    method: 'POST',
                    url: ip + '/ManageApp/User/avatar',
                    data: data
                })
            },
            //8.资料修改
            profile: function(data) {
                return $http({
                    method: 'POST',
                    url: ip + '/ManageApp/User/profile',
                    data: data
                })
            },
            //编辑会员信息
            editMember: function(data) {
                return $http({
                    method: 'POST',
                    url: ip + '/ManageApp/User/editMember',
                    data: data
                })
            },
            //17.所有报题新闻
            allNews: function(data) {
                return $http({
                    method: 'GET',
                    url: ip + '/ManageApp/Baoti/index',
                    params: data
                })
            },
            //18、 报题新闻详情
            newParticulars: function(data) {
                return $http({
                    method: 'GET',
                    url: ip + '/ManageApp/Baoti/view',
                    params: data
                })
            },
            //19、所有串联单
            allChuanld: function(data) {
                return $http({
                    method: 'GET',
                    url: ip + '/ManageApp/Chuanld/index',
                    params: data
                })
            },
            //20、收件箱
            getMessage: function(data) {
                return $http({
                    method: 'GET',
                    url: ip + '/ManageApp/User/getMessage',
                    params: data
                })
            },
            //21、消息详情
            getMessageInfo: function(data) {
                return $http({
                    method: 'GET',
                    url: ip + '/ManageApp/User/getMessageInfo',
                    params: data
                })
            },
            //22、批量删除消息
            delMessages: function(data) {
                return $http({
                    method: 'POST',
                    url: ip + '/ManageApp/User/delMessage',
                    data: data
                })
            },
            //23、 删除消息
            delMessage: function(data) {
                return $http({
                    method: 'GET',
                    url: ip + '/ManageApp/User/delMessage',
                    params: data
                })
            },
            //24、 获取资讯
            getInformationLists: function(data) {
                return $http({
                    method: 'GET',
                    url: ip + '/ManageApp/Index/lists?catid=' + data,
                    headers: {}
                })
            },
            //28、 上传接口
            upload: function(data) {
                return $http({
                    method: 'POST',
                    url: ip + '/ManageApp/Public/upload',
                    params: data
                })
            },
            //29、 会员管理
            members: function(data) {
                return $http({
                    method: 'GET',
                    url: ip + '/ManageApp /User/members',
                    params: data
                })
            },
            //30、 查看会员
            viewMember: function(data) {
                return $http({
                    method: 'GET',
                    url: ip + '/ManageApp/User/viewMember',
                    params: data
                })
            },
            //31、 会员组
            userGroup: function(data) {
                return $http({
                    method: 'GET',
                    url: ip + '/ManageApp/User/userGroup',
                    params: data
                })
            },
            //32、 审核会员
            checkMember: function(data) {
                return $http({
                    method: 'POST',
                    url: ip + '/ManageApp/User/checkMember',
                    data: data
                })
            },
            //33、 名片盒
            mingPH: function(data) {
                return $http({
                    method: 'GET',
                    url: ip + '/ManageApp/User/mingPH',
                    params: data
                })
            },
            //34、 查看名片盒
            viewMPH: function(data) {
                return $http({
                    method: 'GET',
                    url: ip + '/ManageApp/User/viewMPH',
                    params: data
                })
            },
            //编辑名片盒
            editMPH: function(data) {
                return $http({
                    method: 'POST',
                    url: ip + '/ManageApp/User/editMPH',
                    data: data
                })
            },
            //35、 名片盒组
            userGroup: function(data) {
                return $http({
                    method: 'GET',
                    url: ip + '/ManageApp/User/userGroup',
                    params: data
                })
            },
            //36、 已报题单
            yBaoti: function(data) {
                return $http({
                    method: 'GET',
                    url: ip + '/ManageApp/Baoti/ybaoti',
                    params: data
                })
            },
            //37、 已划题单
            yHuati: function(data) {
                return $http({
                    method: 'GET',
                    url: ip + '/ManageApp/Huati/index',
                    params: data
                })
            },
            //38、 播出单
            yBochu: function(data) {
                return $http({
                    method: 'GET',
                    url: ip + '/ManageApp/Bochu/index',
                    params: data
                })
            },
            //39、 （1）报题操作（获取报题标题和内容）
            BaotiHandle: function(data) {
                return $http({
                    method: 'GET',
                    url: ip + '/ManageApp/Baoti/baoti',
                    params: data
                })
            },
            //（2）报题操作（报题和不通过）
            BaotiHandlePass: function(data) {
                return $http({
                    method: 'POST',
                    url: ip + '/ManageApp/Baoti/baoti',
                    data: data
                })
            },

            //（3）报题操作（约视频）
            BaotiHandleVideo: function(data) {
                return $http({
                    method: 'GET',
                    url: ip + '/ManageApp/Baoti/yuesp',
                    params: data
                })
            },
            //40、 （1）串联单操作（约稿和不通过）
            ChuanldStatus: function(type, id, data) {
                return $http({
                    method: type,
                    url: ip + '/ManageApp/Chuanld/status',
                    params: {
                        id: id
                    },
                    data: data
                })
            },
            //(2)串联单批量不通过操作
            batchBTG: function(data) {
                return $http({
                    method: 'POST',
                    url: ip + '/ManageApp/Chuanld/batchBTG',
                    data: data
                })
            },
            //已报题单操作（划题和不通过）
            BaotiCZ: function(data) {
                return $http({
                    method: 'POST',
                    url: ip + '/ManageApp/Baoti/huati',
                    data: data
                })
            },
            GetBaotiContent: function(data) {
                return $http({
                    method: 'get',
                    url: ip + '/ManageApp/Baoti/huati',
                    params: data
                })
            },
            //已报题单批量不通过操作
            batchHT: function(data) {
                return $http({
                    method: 'POST',
                    url: ip + '/ManageApp/Baoti/batchHT',
                    data: data
                })
            },
            //42、 （1）已划题单操作（添加播出和不通过）
            HuatiCZ: function(data) {
                return $http({
                    method: 'POST',
                    url: ip + '/ManageApp/Huati/bochu',
                    data: data
                })
            },
            getHuatiCZ: function(data) {
                return $http({
                    method: 'GET',
                    url: ip + '/ManageApp/Huati/bochu',
                    params: data
                })
            },
            //下载
            down: function(data) {
                return $http({
                    method: 'POST',
                    url: ip + '/ManageApp/Huati/down',
                    data: data
                })
            },
            //（2）已划题单批量不通过操作
            batchBC: function(data) {
                return $http({
                    method: 'POST',
                    url: ip + '/ManageApp/Huati/batchBC',
                    data: data
                })
            },
            //43、 播出频道
            channelList: function(data) {
                return $http({
                    method: 'get',
                    url: ip + '/ManageApp/Huati/pindao',
                    params: data
                })
            },
            //38、 播出单
            BochuList: function(data) {
                return $http({
                    method: 'GET',
                    url: ip + '/ManageApp/Bochu/index',
                    params: data
                })
            },
            //找回密码
            findPassword: function(data) {
                return $http({
                    method: 'GET',
                    url: ip + "/ManageApp/Login/findPwd",
                    timeout: 5000
                })
            },
            //会员数据统计
            vipInfoStatistics: function() {
                return $http({
                    method: 'GET',
                    url: ip + '/ManageApp/User/userCount',
                    timeout: 5000
                })
            },
            //个人资料
            userInfo: function(data) {
                return $http({
                    method: 'GET',
                    url: ip + "/ManageApp/User/info",
                    timeout: 5000,
                    parmas: data
                })
            },
            //用户管理
            userCtrl: function(data) {
                return $http({
                    method: 'GET',
                    url: ip + '/ManageApp/User/members',
                    params: data,
                    timeout: 5000
                })
            },
            //查看会员
            personalDetails: function(data) {
                return $http({
                    method: 'GET',
                    url: ip + '/ManageApp/User/viewMember?uid=' + data,
                    timeout: 5000
                })
            },
            //报题详情
            getTitleDetails: function(data) {
                return $http({
                    method: 'get',
                    url: ip + '/ManageApp/Baoti/view',
                    timeout: 5000
                })
            },
            //添加新闻
            addNews: function(data) {
                return $http({
                    method: 'POST',
                    url: ip + '/ManageApp/Baoti/add',
                    data: data,
                    timeout: 5000
                })
            },
            //提示框
            loadingShow: function(str) {
                $ionicLoading.show({
                    template: str,
                    showBackdrop: false
                });
                $timeout(function() {
                    $ionicLoading.hide();
                }, 1500);
            },
            //数据存储与获取
            storeData: function(key, data) {
                if (data) {
                    return $window.localStorage[key] = angular.toJson(data);
                } else {
                    return (key && angular.fromJson($window.localStorage[key])) || null;
                }
            },
            //删除某个储存
            remove: function(key) {
                $window.localStorage.removeItem(key);
            },
            //清空
            clear: function() {
                $window.localStorage.clear();
            },
            isNoMore: function(d, size) {
                //是否还有数据加载（上拉）
                if (d.data.length < size) {
                    return false;
                } else {
                    return true;
                }
            }
        }
    })