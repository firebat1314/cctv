// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform, $ionicPopup, $state, $data) {
  if ($data.storeData('isLogin') == 'yes') {
    console.log('初始化...');
    $state.go('tab.news')
  };
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
  $ionicPlatform.registerBackButtonAction(function(e) {
    var current_state_name = $state.current.name;
    if (current_state_name == 'tab.account' || current_state_name == 'start-page' || current_state_name == 'tab.news' || current_state_name == 'tab') {
      $ionicPopup.confirm({
        title: '退出应用',
        template: '您确定要退出吗?',
        buttons: [{
          text: '取消'
        }, {
          text: '<b>确定</b>',
          type: 'button-positive',
          onTap: function(event) {
            //ionic.Platform.exitApp();
            navigator.app.exitApp();
          }
        }]
      });
      e.preventDefault();
      return false;
    } else {
      navigator.app.backHistory();
    }
  }, 100);
})

.config(function($httpProvider, $stateProvider, $urlRouterProvider, $ionicConfigProvider) {
  $ionicConfigProvider.platform.ios.tabs.style('standard');
  $ionicConfigProvider.platform.ios.tabs.position('bottom');
  $ionicConfigProvider.platform.android.tabs.style('standard');
  $ionicConfigProvider.platform.android.tabs.position('bottom');

  $ionicConfigProvider.platform.ios.navBar.alignTitle('center');
  $ionicConfigProvider.platform.android.navBar.alignTitle('center');

  $ionicConfigProvider.platform.ios.backButton.previousTitleText('').icon('ion-ios-arrow-thin-left');
  $ionicConfigProvider.platform.android.backButton.previousTitleText('').icon('ion-android-arrow-back');

  $ionicConfigProvider.platform.ios.views.transition('ios');
  $ionicConfigProvider.platform.android.views.transition('android');

  $urlRouterProvider.otherwise('/start-page');
  $stateProvider

    .state('start-page', {
    url: '/start-page',
    templateUrl: 'templates/start-page.html',
    controller: 'StartCtrl'
  })

  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl'
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
    views: {
      'tab-news': {
        templateUrl: 'templates/tab-news.html',
        controller: 'NewsCtrl'
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

  .state('tab.management', {
    url: '/account/management',
    views: {
      'tab-account': {
        templateUrl: 'templates/management.html',
        controller: 'ManagementCtrl'
      }
    }
  })
});