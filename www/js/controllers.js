    angular.module('starter.controllers', [])

    .controller('DashCtrl', function($scope, $state, Friends, UserService) {
        //UserService.loadUser();
        $scope.user = UserService.getUser();

        $scope.rollAgain = function(){
            UserService.rollAgain();
        };

        $scope.saveNumber = function(){
            UserService.saveNumber();
        };
    })

    .controller('AccountCtrl', function($scope,UserService) {
        $scope.loginFormIsOpen = true;
        $scope.loginError = false;
        $scope.registerFormIsOpen = false;
        $scope.forgottenPasswordFormIsOpen = false;
        $scope.user = UserService.getUser();
        $scope.loginUser = {};

        $scope.login = function(){
            //console.log($scope.loginUser);
            UserService.login($scope.loginUser);
            $scope.loginError = $scope.user.token == null;
        };

        $scope.logout = function(){
            UserService.logout();
            $scope.loginError = false;
        };

        $scope.register = function(user){
            //register new user
            if(user.password != user.password_confirm){
                //passwords do not match
                console.log('Passwords don\'t match.');

            }
            else{
                //Create user and save token
                UserService.register(user);
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
