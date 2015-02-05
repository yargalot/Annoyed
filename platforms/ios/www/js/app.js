// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
  .state('tab', {
    url: "/tab",
    abstract: true,
    templateUrl: "templates/tabs.html"
  })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })

  .state('tab.charity', {
    url: '/charity/:id',
    views: {
      'tab-charities': {
        templateUrl: 'templates/charity-detail.html',
        controller: 'CharityCtrl',
        resolve: {
          charity: function($stateParams, $http) {
            return $http.get('http://battlehack2015.azurewebsites.net/v1/charities/' + $stateParams.id)
            .success(function(data) {
              return data;
            })
          }
        }
      }
    }
  })

  .state('tab.dontate', {
    url: '/charity/:id/donate',
    views: {
      'tab-charities': {
        templateUrl: 'templates/charity-donate.html',
        controller: 'DonationCtrl',
        resolve: {
          braintreeKey: function($http) {
            return $http.get('http://battlehack2015.azurewebsites.net/v1/Payment/ClientToken?customerId=' + localStorage.customerKey)
              .success(function(key) {
                return key;
              })
          },
          charity: function($stateParams, $http) {
            return $http.get('http://battlehack2015.azurewebsites.net/v1/charities/' + $stateParams.id)
            .success(function(data) {
              return data;
            })
          }
        }
      }
    }
  })

  .state('tab.thanks', {
    url: '/charity/:id/thanks',
    views: {
      'tab-charities': {
        templateUrl: 'templates/charity-thanks.html',
        controller: 'ThanksCtrl',
        resolve: {
          donation: function($http) {
            return $http.get('http://battlehack2015.azurewebsites.net:80/v1/customers/'+ localStorage.customerKey +'/donations')
              .success(function(donations) {
                return donations;
              })
          }
        }
      }
    }
  })

  .state('tab.charities', {
      url: '/charities',
      views: {
        'tab-charities': {
          templateUrl: 'templates/tab-charities.html',
          controller: 'charitiesCtrl',
          resolve: {
            charities: function($stateParams, $http) {
              return $http.get('http://battlehack2015.azurewebsites.net/v1/charities/nearby')
              .success(function(data) {
                return data;
              })
            }
          }
        }
      }
    })
    .state('tab.chat-detail', {
      url: '/chats/:chatId',
      views: {
        'tab-chats': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      }
    })

  .state('tab.friends', {
      url: '/friends',
      views: {
        'tab-friends': {
          templateUrl: 'templates/tab-friends.html',
          controller: 'FriendsCtrl'
        }
      }
    })
    .state('tab.friend-detail', {
      url: '/friend/:friendId',
      views: {
        'tab-friends': {
          templateUrl: 'templates/friend-detail.html',
          controller: 'FriendDetailCtrl'
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
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/dash');

});
