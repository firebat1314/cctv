// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform) {
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
})

.factory('BearerAuthInterceptor', function($window, $q) {
  return {
    request: function(config) {
      config.headers = config.headers || {};
      if ($window.localStorage.getItem('token')) {
        // may also use sessionStorage
        config.headers.Authorization = 'Bearer ' + $window.localStorage.getItem('token');
      }
      return config || $q.when(config);
    },
    response: function(response) {
      if (response.status === 401) {
        //  Redirect user to login page / signup Page.
      }
      return response || $q.when(response);
    }
  };
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
  //https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
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

  .state('submission',{
    url:'/submission',
    templateUrl: 'templates/submission-newspage.html',
    controller: 'SubmissionCtrl'
  })

});