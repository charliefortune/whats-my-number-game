    angular.module('starter.controllers', [])

    .controller('DashCtrl', function($scope, $state, Friends, UserService) {
        $scope.user = UserService.getUser();

        // if(!$scope.user.loggedIn){
        //     $state.go('tab.account');
        // }

        $scope.rollAgain = function(){
            UserService.rollAgain();
        };

        $scope.saveNumber = function(){
            UserService.saveNumber();
        };
    })

    .controller('AccountCtrl', function($scope, $state, UserService, $cordovaOauth, OpenFB) {
        $scope.loginFormIsOpen = true;
        $scope.loginError = false;
        $scope.registerFormIsOpen = false;
        $scope.forgottenPasswordFormIsOpen = false;
        $scope.user = UserService.getUser();
        $scope.loginUser = {};

       //  $scope.googleLogin = function() {
       //     $cordovaOauth.google("CLIENT_ID_HERE", ["https://www.googleapis.com/auth/urlshortener", "https://www.googleapis.com/auth/userinfo.email"]).then(function(result) {
       //      console.log(JSON.stringify(result));
       //  }, function(error) {
       //      console.log(error);
       //  });
       // }

       $scope.revokeFacebookPermissions = function () {
        OpenFB.revokePermissions().then(
            function () {
                $state.go('tab.account');
            },
            function () {
                console.log('Revoke permissions failed');
            });
    };

    $scope.facebookLogin = function() {
        $cordovaOauth.facebook("1593921350820670", ["email"]).then(function(response) {
            result = JSON.stringify(response);
            $scope.user.facebookData.token = result.token;
            $scope.user.facebookData.expiresIn = result.expires_in;
            $scope.user.loggedIn = true;
            //$scope.user.username = '';
            console.log(result);
        }, function(error) {
            console.log(error);
        });

            // OpenFB.login('email,read_stream,publish_stream').then(
            //     function () {
            //         $state.go('tab.dash');
            //                 //$scope.user.facebookData.token = result.token;
            //         //     //$scope.user.facebookData.expiresIn = result.expires_in;
            //                 //$scope.user.loggedIn = true;
            //         //     //$scope.user.username = '';
            //                 //$location.path('/app/person/me/feed');
            //             },
            //             function () {
            //                 console.log('OpenFB login failed');
            //             });
};



$scope.login = function(){
    UserService.login($scope.loginUser);
    $scope.loginError = $scope.user.token == null;
};

$scope.logout = function(){
    UserService.logout();
    $scope.loginError = false;
    OpenFB.logout();
                    //$state.go('tab.account');
                };

                $scope.register = function(registerUser){
            //register new user
            if(registerUser.password != registerUser.password_confirm){
                //passwords do not match
                console.log('Passwords don\'t match.');

            }
            else{
                //Create user and save token
                UserService.register(registerUser);
            }
        };

        $scope.facebookRegister = function(){
            $cordovaOauth.facebook("1593921350820670", ["email"]).then(function(response) {
                result = JSON.stringify(response);
                $scope.user.loggedIn = true;
                $cordovaFacebook.api("me", ["public_profile"])
                .then(function(success) {
                    // success
                    console.log(success);
                }, function (error) {
                      // error
                  });

                //$scope.user.username = '';
                console.log(result);
            }, function(error) {
                console.log(error);
            });
            
        }
    })

    .controller('FriendsCtrl', function($scope, OpenFB, Friends, $http) {
        //$scope.friends = Friends.all();
        $scope.getFriends = function() {
            if($scope.user.hasOwnProperty("accessToken") === true) {
                $http.get("https://graph.facebook.com/v2.2/me", { params: { access_token: $scope.user.accessToken, fields: "id,name,gender,location,website,picture,relationship_status", format: "json" }}).then(function(result) {
                    console.log(result.data);
                    $scope.profileData = result.data;
                }, function(error) {
                    alert("There was a problem getting your profile. Check the logs for details.");
                    console.log(error);
                });
            } else {
                alert("Not signed in");
                $location.path("/login");
            }
        };
            // console.log('Getting friends...');
            // OpenFB.api({
            //     method: 'GET',
            //     path: '/me/friends',
            //     success : function (result) {
            //         $scope.friends = result.data;
            //         console.log(result);
            //     },
            //     error: function(data) {
            //         console.log(data.error.message);
            //     }
            // });
//};

})

    .controller('FriendDetailCtrl', function($scope, $stateParams, Friends) {
      //$scope.friend = Friends.get($stateParams.friendId);
  });


     // .controller('ChatsCtrl', function($scope, Chats) {
    //   $scope.chats = Chats.all();
    //   $scope.remove = function(chat) {
    //     Chats.remove(chat);
    //   }
    // })

    // .controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
    //   $scope.chat = Chats.get($stateParams.chatId);
    // })
