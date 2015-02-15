    angular.module('starter.controllers', [])

    .controller('DashCtrl', function($scope, $state, Friends, SettingsFactory, UserService) {
        //set up any data for the dashboard here.
        //$scope.loggedIn = function(){ 
        //    return UserService.loggedIn(); 
        //}
        //if(!$scope.loggedIn){
        //    $state.go("tab.account");
        //}
        //$scope.user = function(){ 
            //return UserService.user(); 
       // }

        //UserService.rank().then(function(response){
        //    $scope.rank = response.data.rank;
        //    $scope.total = response.data.total;
        //    });
        
        //$scope.number = UserService.number;
        //$scope.newNumber = UserService.newNumber;

        $scope.user = UserService;

        //$scope.newNumber = function(){
            //return UserService.newNumber();
        //}
       
        //var number = SettingsFactory.getNumber();
        //var newNumber = SettingsFactory.rollAgain();
        //$scope.number = number;

        //$scope.newNumber = newNumber;
        //SettingsFactory.getRank(playerId,number).then(function (response) {
           //console.log(response);
           //$scope.rank = response.data.rank;
           //$scope.total = response.data.total;
        //});

        $scope.rollAgain = function(){
            UserService.rollAgain();
        };

        $scope.saveNumber = function(){
            UserService.saveNumber();
            //SettingsFactory.saveNumber(playerId, newNumber).then(function () {
                //SettingsFactory.getRank(playerId,newNumber).then(function (response) {
                   //console.log(response.data);
                   //$scope.rank = response.data.rank;
                   //$scope.total = response.data.total;
                //});
           // });
        };
    })

    .controller('AccountCtrl', function($scope,SettingsFactory, UserService) {
        //$scope.registered = SettingsFactory.getPlayerId() !== null;
        //$scope.user = {};
        //$scope.user.token = SettingsFactory.getToken();
        //$scope.user.username = SettingsFactory.getUsername();
        //$scope.user.playerId = SettingsFactory.getPlayerId();
        //$scope.loggedIn = SettingsFactory.isLoggedIn();
        
        $scope.user = UserService;

        $scope.login = function(user){
            UserService.login();
        //    SettingsFactory.saveUsername(user.username);
        //    SettingsFactory.login(user).then(function(userData){
                //console.log(userData);
        //        $scope.user.token = userData.token;
        //        $scope.loggedIn = SettingsFactory.isLoggedIn();
        //        });
        };

        $scope.logout = function(){
            UserService.logout();
        //    $scope.loggedIn = false;
        //    $scope.user.token = null;
        };

        $scope.register = function(user){
            //register new user
            if(user.password != user.password_confirm){
                //passwords do not match
                console.log('Passwords don\'t match.');

            }
            else{
                //Create user and save token
                SettingsFactory.register(user).
                success(function(data){
                    console.log(data);  //the token should be somewhere in this data.
                    if(data['error']){
                        //error
                    }
                    else if(data['token'] !== null){
                        //save the token and the id
                        SettingsFactory.saveToken(data['token']);
                        SettingsFactory.saveId(data['id']);

                    };
                });
            }
            
        };
    })

     .controller('FriendsCtrl', function($scope, Friends) {
        //
      $scope.friends = Friends.all();
    })

    .controller('FriendDetailCtrl', function($scope, $stateParams, Friends) {
      $scope.friend = Friends.get($stateParams.friendId);
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
