angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $timeout, $state) {

  $scope.beacons = [];

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
          categoriesNamed:['Charities'],
          //maximumAccuracy:0.5
          //etc.
      }
  };

  document.addEventListener('deviceready', function() {

    com.bluecats.beacons.startPurringWithAppToken(
        blueCatsAppToken,
        purringSuccess, logError, sdkOptions);

  }, false);

  $scope.goCharity = function() {
    var charityId = this.beacon.name.split('|')[1];

    $state.go('charity', {id : charityId} );
  }


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

      $scope.status = 'Checking';
      console.log('Checking');

      watchIdForEnterBeacon = com.bluecats.beacons.watchEnterBeacon(
          function(watchData){
              //$scope.status = 'beacon found';
              displayBeacons('Entered', watchData);
          }, logError, beaconWatchOptions);

      watchIdForExitBeacon = com.bluecats.beacons.watchExitBeacon(
          function(watchData){
            //$scope.status = 'beacon lost';
            console.log('Beacon Lost');
            //displayBeacons('Exited', watchData);
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

      console.log('Beacons Found !!!!!');
      $scope.watchData = watchData;
      $scope.description = description;

      $scope.beacons = watchData.filteredMicroLocation.beacons;

      $scope.$apply();

  }

  function logError() {
      console.log('Error occurred watching beacons');
  }

})

.controller('CharityCtrl', function($scope, $http, charity) {
  var url = 'http://battlehack2015.azurewebsites.net/v1/charities/248209';
  var placeimagepath = 'http://lorempixel.com/75/75/people/';

  $scope.charity = charity;
  console.log(charity.data);



  $scope.contributors = [
    {
      image: placeimagepath + 1
    },
    {
      image: placeimagepath + 2
    },
    {
      image: placeimagepath + 3
    },
    {
      image: placeimagepath + 4
    }
  ];

})

.controller('charitiesCtrl', function($scope, $http, charities) {
  $scope.charities = charities.data;

  $scope.searchTerms = '';

  $scope.charitySearch = function() {

      if (!this.searchTerms) {
        $scope.charities = charities.data;
        return
      }


      $http.get('http://battlehack2015.azurewebsites.net:80/v1/charities/search?name=' + this.searchTerms)
        .success(function(response) {
          console.log(response)

          $scope.charities = response;
        });
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

.controller('AccountCtrl', function($scope, $http) {
  $scope.settings = {
    enableFriends: true
  };



  $scope.accountSubmit = function() {
      var params = {
        "FirstName": this.accountCreation.fistName.$modelValue,
        "LastName": this.accountCreation.lastName.$modelValue,
        "Company": this.accountCreation.company.$modelValue,
        "Email": this.accountCreation.email.$modelValue,
      };

      console.log(params);

      $http.post('http://battlehack2015.azurewebsites.net/v1/customers', params)
        .success(function(customerKey) {
          localStorage.setItem('customerKey', customerKey);
        });

  };

})




// Donation Controller
// Will implement Payments Service
.controller('DonationCtrl', function($scope, $stateParams, $http, braintreeKey) {

  console.log(braintreeKey);
  var key = braintreeKey.data;
  var charityId = $stateParams.id;

  $scope.formValues = {
    donationAmount: 0
  };

  braintree.setup( key, "dropin", {
            container: "dropin",
            paypal: {
                singleUse: true
            },
            paymentMethodNonceReceived: function (event, nonce) {
              // do something
              $scope.donationStart(nonce);
            }
      });




    $scope.donationStart = function(nonce) {

      var params = {
        "Frequency": "none",
        "PaymentMethodNonce": nonce,
        "Amount": $scope.formValues.donationAmount,
        "CustomerId": localStorage.custKey,
        "CharityId": charityId
      }

      $http.post('http://battlehack2015.azurewebsites.net/v1/Payment/CheckOut', params)
        .success(function(response) {

          console.log('DONATION DONE')
        })


    };

})


// Donation Thankyou Controller
.controller('DonationThankyouCtrl', function($scope) {

})


// Donor Edit Profile Controller
// Implement Local Customer Service
.controller('DonorEditProfileCtrl', function($scope) {

});
