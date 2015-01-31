angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $timeout) {

  $scope.appToken = '4acb4443-bfbc-4c95-bea0-8cafee513a19';

  $scope.test = 'HERP DERP';

  function success() {

    $scope.test = 'SUCCESS FOR API SHIT';
    alert('BlueCats SDK is purring');

  }

  function error() {
    $scope.test = 'There is an error';
    alert('BlueCats SDK is purring');
  }

  var sdkOptions = {
      useLocalStorage:true
  };

  $scope.refresh = function() {

      $scope.test = 'REFRESH';
      com.bluecats.beacons.startPurringWithAppToken($scope.appToken, success, error, sdkOptions);
  }

  $timeout(function() {

    if (com) {

    }
  }, 500)


})

.controller('ChatsCtrl', function($scope, Chats) {
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('FriendsCtrl', function($scope, Friends) {
  $scope.friends = Friends.all();
})

.controller('FriendDetailCtrl', function($scope, $stateParams, Friends) {
  $scope.friend = Friends.get($stateParams.friendId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
