// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic',
    'starter.controllers',
    'starter.directives',
    'starter.services',
    'starter.filter',
    'ngCordova',
    'ionic-native-transitions',
    'ionic-datepicker',
    'tabSlideBox',
    "ngSanitize",
    "com.2fdevs.videogular",
    "com.2fdevs.videogular.plugins.controls",
    "com.2fdevs.videogular.plugins.overlayplay",
    "com.2fdevs.videogular.plugins.poster",
    "com.2fdevs.videogular.plugins.buffering"
])

.run(function($ionicPlatform, $ionicPopup, $state, $data, $rootScope, $ionicHistory, $cordovaKeyboard, $timeout, $ionicLoading, $cordovaDevice) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        $rootScope.appkey = $cordovaDevice.getDevice().uuid;
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
        if ($data.storeData('isLogin') == 'yes') {
            /*加载动画*/
            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0,
                duration: 1500
            });
            $timeout(function() {
                $state.go('tab.news');
            }, 1000)
        };
        $rootScope.goBack = function() {
            $rootScope.$ionicGoBack();
        };
        //硬件按钮返回注册及退出提示及键盘优先关闭
        $ionicPlatform.registerBackButtonAction(function(e) {
            var current_state_name = $state.current.name;
            if (current_state_name == 'tab.account' || current_state_name == 'start-page' || current_state_name == 'tab.news' || current_state_name == 'tab' || current_state_name == 'login') {
                $ionicPopup.confirm({
                    title: '退出应用',
                    template: '您确定要退出吗?',
                    buttons: [{
                        text: '取消'
                    }, {
                        text: '<b>确定</b>',
                        type: 'button-positive',
                        onTap: function(event) {
                            ionic.Platform.exitApp();
                            //navigator.app.exitApp();
                        }
                    }]
                });
            } else if ($ionicHistory.backView()) {
                if ($cordovaKeyboard.isVisible()) {
                    $cordovaKeyboard.close();
                } else {
                    $rootScope.$ionicGoBack();
                }
            }
            e.preventDefault();
            return false;
        }, 101);
    });
})

.config(function($httpProvider, $stateProvider, $urlRouterProvider, $ionicConfigProvider, $ionicNativeTransitionsProvider, ionicDatePickerProvider) {
    $ionicConfigProvider.platform.ios.tabs.style('standard');
    $ionicConfigProvider.platform.ios.tabs.position('bottom');
    $ionicConfigProvider.platform.android.tabs.style('standard');
    $ionicConfigProvider.platform.android.tabs.position('bottom');

    $ionicConfigProvider.platform.ios.navBar.alignTitle('center');
    $ionicConfigProvider.platform.android.navBar.alignTitle('center');

    $ionicConfigProvider.platform.ios.backButton.previousTitleText('').icon('ion-ios-arrow-back');
    $ionicConfigProvider.platform.android.backButton.previousTitleText('').icon('ion-android-arrow-back');

    $ionicConfigProvider.platform.ios.views.transition('ios');
    $ionicConfigProvider.platform.android.views.transition('android');

    $ionicConfigProvider.views.transition('no');
    $ionicNativeTransitionsProvider.setDefaultOptions({
        duration: 200, // in milliseconds (ms), default 400,
        slowdownfactor: 4, // overlap views (higher number is more) or no overlap (1), default 4
        iosdelay: -1, // ms to wait for the iOS webview to update before animation kicks in, default -1
        androiddelay: -1, // same as above but for Android, default -1
        winphonedelay: -1, // same as above but for Windows Phone, default -1,
        fixedPixelsTop: 0, // the number of pixels of your fixed header, default 0 (iOS and Android)
        fixedPixelsBottom: 0, // the number of pixels of your fixed footer (f.i. a tab bar), default 0 (iOS and Android)
        triggerTransitionEvent: '$ionicView.afterEnter', // internal ionic-native-transitions option
        backInOppositeDirection: true // Takes over default back transition and state back transition to use the opposite direction transition to go back
    });
    $ionicNativeTransitionsProvider.setDefaultTransition({
        type: 'slide',
        direction: 'left'
    });
    $ionicNativeTransitionsProvider.setDefaultBackTransition({
        type: 'slide',
        direction: 'right'
    });
    //日期选择器默认配置
    var datePickerObj = {
        inputDate: new Date(),
        titleLabel: 'Select a Date',
        setLabel: '确定',
        todayLabel: '今天',
        closeLabel: '关闭',
        mondayFirst: true,
        weeksList: ["日", "一", "二", "三", "四", "五", "六"],
        monthsList: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
        templateType: 'popup',
        from: new Date(1950, 8, 1),
        to: new Date(),
        showTodayButton: true,
        dateFormat: 'yyyy-MM-dd',
        closeOnSelect: false,
        disableWeekdays: []
    };
    ionicDatePickerProvider.configDatePicker(datePickerObj);

    $httpProvider.interceptors.push('AuthInterceptor');

    $urlRouterProvider.otherwise('/login');
    $stateProvider

    /*  .state('start-page', {
        url: '/start-page',
        templateUrl: 'templates/start-page.html',
        controller: 'StartCtrl',
        nativeTransitions: {
            type: "fade"
        }
      })*/

        .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl',
        nativeTransitions: {
            type: "fade"
        }
    })

    .state('register', {
        url: '/register',
        templateUrl: 'templates/register.html',
        controller: 'RegisterCtrl',
    })

    .state('register-second', {
        url: '/register-second',
        templateUrl: 'templates/register-second.html',
        controller: 'registerSecondCtrl'
    })

    .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html'
    })

    .state('tab.news', {
        url: '/news',
        cache: true,
        nativeTransitions: {
            "type": "fade",
        },
        views: {
            'tab-news': {
                templateUrl: 'templates/tab-news.html',
                controller: 'NewsCtrl'
            }
        }
    })

    .state('tab.news-importance', {
        url: '/news/news-importance',
        views: {
            'tab-news': {
                templateUrl: 'templates/tab-news-importance.html',
                controller: 'NewsImportanceCtrl'
            }
        }
    })

    .state('tab.news-plan', {
        url: '/news/news-plan',
        views: {
            'tab-news': {
                templateUrl: 'templates/tab-news-plan.html',
                controller: 'NewsPlanCtrl'
            }
        }
    })

    .state('tab.news-interflow', {
        url: '/news/news-interflow',
        views: {
            'tab-news': {
                templateUrl: 'templates/tab-news-interflow.html',
                controller: 'NewsInterflowCtrl'
            }
        }
    })

    .state('tab.new-detail', {
        url: '/news/:chatId',
        views: {
            'tab-news': {
                templateUrl: 'templates/new-detail.html',
                controller: 'NewDetailCtrl'
            }
        }
    })

    .state('tab.account', {
        url: '/account',
        cache: true,
        nativeTransitions: {
            "type": "fade",
        },
        views: {
            'tab-account': {
                templateUrl: 'templates/tab-account.html',
                controller: 'AccountCtrl'
            }
        }
    })

    .state('submission', {
        url: '/submission',
        templateUrl: 'templates/submission-newspage.html',
        controller: 'SubmissionCtrl'
    })

    .state('setting', {
        url: '/account/setting',
        templateUrl: 'templates/setting.html',
        controller: 'SettingCtrl'
    })

    .state('tab.management', {
        url: '/account/management',
        views: {
            'tab-account': {
                templateUrl: 'templates/management.html',
                controller: 'ManagementCtrl'
            }
        }
    })

    .state('tab.personal-page', {
        url: '/account/management/:uid/:cardid/:index',
        views: {
            'tab-account': {
                templateUrl: 'templates/personal-page.html',
                controller: 'PersonalPageCtrl'
            }
        }
    })

    .state('tab.personal-data', {
        url: '/account/personal-data',
        views: {
            'tab-account': {
                templateUrl: 'templates/personal-data.html',
                controller: 'PersonalDataCtrl'
            }
        }
    })

    .state('tab.allnews', {
        url: '/account/allnews',
        views: {
            'tab-account': {
                templateUrl: 'templates/allnews.html',
                controller: 'AllNewsCtrl'
            }
        }
    })

    .state('tab.news-particulars', {
        url: '/account/allnews/new-particulars/:id',
        views: {
            'tab-account': {
                templateUrl: 'templates/news-particulars.html',
                controller: 'NewsParticularsCtrl'
            }
        }
    })

    .state('baoti', {
        url: '/account/allnews/baoti/:id/:index',
        templateUrl: 'templates/baoti.html',
        controller: 'BaotiCtrl'
    })

    .state('tab.allchuanlian', {
        url: '/account/allchuanlian',
        views: {
            'tab-account': {
                templateUrl: 'templates/allchuanlian.html',
                controller: 'AllChuanLianCtrl'
            }
        }
    })

    .state('approximations', {
        url: '/account/allchuanlian/approximations/:id/:uid/:title',
        templateUrl: 'templates/approximations.html',
        controller: 'ApproximationsCtrl'
    })

    .state('nopass', {
        url: '/account/allchuanlian/nopass/:id/:title',
        templateUrl: 'templates/nopass.html',
        controller: 'NopassCtrl'
    })

    .state('tab.alreadyreport', {
        url: '/account/alreadyreport',
        views: {
            'tab-account': {
                templateUrl: 'templates/alreadyreport.html',
                controller: 'AlreadyReportCtrl'
            }
        }
    })

    .state('huati', {
        url: '/account/alreadyreport/huati/:id/:status',
        templateUrl: 'templates/huati.html',
        controller: 'HuatiCtrl'
    })

    .state('tab.alreadysweep', {
        url: '/account/alreadysweep',
        views: {
            'tab-account': {
                templateUrl: 'templates/alreadysweep.html',
                controller: 'AlreadySweepCtrl'
            }
        }
    })

    .state('tab.rebroadcast', {
        url: '/account/alreadysweep/rebroadcast/:id',
        views: {
            'tab-account': {
                templateUrl: 'templates/add-rebroadcast.html',
                controller: 'AddRebroadcastCtrl'
            }
        }
    })

    .state('tab.overplay', {
        url: '/account/overplay',
        views: {
            'tab-account': {
                templateUrl: 'templates/overplay.html',
                controller: 'OverPlayCtrl'
            }
        }
    })

    .state('tab.cardcase', {
        url: '/account/cardcase',
        views: {
            'tab-account': {
                templateUrl: 'templates/cardcase.html',
                controller: 'CardCaseCtrl'
            }
        }
    })

    .state('tab.inbox', {
        url: '/account/inbox/:index',
        views: {
            'tab-account': {
                templateUrl: 'templates/inbox.html',
                controller: 'InboxCtrl'
            }
        }
    })

    .state('tab.inbox-content', {
        url: '/account/inbox/inbox-content/:id',
        views: {
            'tab-account': {
                templateUrl: 'templates/inbox-content.html',
                controller: 'InboxContentCtrl'
            }
        }
    })

    .state('revisepassword', {
        url: '/account/revisepassword',
        templateUrl: 'templates/revisepassword.html',
        controller: 'RevisePasswordCtrl'
    })



});