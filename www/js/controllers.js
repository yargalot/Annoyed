angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $timeout) {

  var blueCatsAppToken = '4acb4443-bfbc-4c95-bea0-8cafee513a19';

  var watchIdForEnterBeacon,watchIdForExitBeacon,watchIdForClosestBeacon = null;
  var beaconDisplayList = null;

  if(blueCatsAppToken == 'BLUECATS-APP-TOKEN'){
      //BlueCats app token hasn't been configured
      app.receivedEvent('apptokenrequired');
      return;
  }

  var sdkOptions = {
      useLocalStorage:true
  };

  var beaconWatchOptions = {
      filter:{
          //Configure additional filters here e.g.
          //sitesName:['BlueCats HQ', 'Another Site'],
          //categoriesNamed:['Entrance'],
          //maximumAccuracy:0.5
          //etc.
      }
  };

  document.addEventListener('deviceready', function() {

    com.bluecats.beacons.startPurringWithAppToken(
        blueCatsAppToken,
        purringSuccess, logError, sdkOptions);

  }, false);

  $scope.refresh = {

  }

  $timeout(function() {

  }, 2000);

  function purringSuccess() {
      console.log('Spurring')
      watchBeaconEntryAndExit();
      watchClosestBeacon();
  }

  function watchBeaconEntryAndExit(){
      if (watchIdForEnterBeacon != null) {
          com.bluecats.beacons.clearWatch(watchIdForEnterBeacon);
      };

      if (watchIdForExitBeacon != null) {
          com.bluecats.beacons.clearWatch(watchIdForExitBeacon);
      };

      watchIdForEnterBeacon = com.bluecats.beacons.watchEnterBeacon(
          function(watchData){
              displayBeacons('Entered', watchData);
          }, logError, beaconWatchOptions);

      watchIdForExitBeacon = com.bluecats.beacons.watchExitBeacon(
          function(watchData){
              displayBeacons('Exited', watchData);
          }, logError, beaconWatchOptions);
  }

  function watchClosestBeacon(){
      if (watchIdForClosestBeacon != null) {
          com.bluecats.beacons.clearWatch(watchIdForClosestBeacon);
      };

      watchIdForClosestBeacon = com.bluecats.beacons.watchClosestBeaconChange(
          function(watchData){
              displayBeacons('Closest to', watchData);
          }, logError, beaconWatchOptions);
  }

  function displayBeacons(description, watchData){
      var beacons = watchData.filteredMicroLocation.beacons;
      var beaconNames = [];

      $scope.watchData = watchdata;
      $scope.description = description;
  }

  function logError() {
      console.log('Error occurred watching beacons');
  }

})

.controller('ChatsCtrl', function($scope, Chats) {
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
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
