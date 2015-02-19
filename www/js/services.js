angular.module('starter.services', [])

.factory('UserService', ['$http',function($http) {
  
  var userService = {};
  var user = {};

  loadUser();

  function loadUser(){
    user = JSON.parse(window.localStorage['user']);
    if(angular.isUndefined(user)){
      console.log('Initialising User');
      user = {playerId : null, username: '', token : '', number : null, rank : null, total: null, loggedIn : false, newNumber : null, registered : true};
      //userService.saveUser();
    }
  };

  userService.saveUser = function(){
    window.localStorage['user'] = JSON.stringify(user);
    console.log("Saving User");
  };

  userService.getUser = function(){
    return user;
  };

  userService.rollAgain = function(){
    user.newNumber = Math.floor(Math.random()*1001);
  };

  userService.saveNumber = function(){
    user.number = user.newNumber;
    $http.get('http://whatsmynumbergame.co.uk/api/save_number/' + user.playerId + '/' + user.newNumber).then(function(response){
      userService.getRank();
    });
    userService.saveUser();
  };

  userService.getRank = function(){
    $http.get('http://whatsmynumbergame.co.uk/api/lookup_rank/' + user.playerId + '/' + user.number).then(function(response){
      user.rank = response.data.rank;
      user.total = response.data.total;
      userService.saveUser();
    });
  };

  userService.register = function(registerUser){
    $http.post('http://whatsmynumbergame.co.uk/api/register/',{user: registerUser}).then(function(response){
      console.log(response);
      if(response.error){
         //error
      }
      else if(response.data.token !== null){
        //success
        user.playerId = response.data.token;
        user.username = registerUser.username;
      }
    });
  };

  userService.logout = function(){
    user.loggedIn = false;
    user.token = null;
    userService.saveUser();
  };

  /**
  * Log a user in via api call and save the token, or return error.
  */
  userService.login = function(loginUser){
    console.log(loginUser);
    $http.post('http://whatsmynumbergame.co.uk/api/login/',{user: loginUser}).then(function(response){
      console.log(response);
      if(response.data.token){
              //save the token.
              user.loggedIn = true;
              user.username = loginUser.username;
              user.token = response.data.token;
              user.playerId = response.data.player_id;
              user.number = response.data.number;
              user.rank = response.data.rank;
              user.total = response.data.total;
              userService.saveUser();
            }

            else{
              //error
              user.loggedIn = false;
              user.token = null;
            }
        });
  };

  return userService;
}])


.factory('SettingsFactory', ['$http',function($http) {

  var number = window.localStorage['number'] || Math.floor(Math.random()*1001);
  
  //var user = {playerId : 0, username: '', token : '', number : 0, loggedIn : false}

  var loggedIn = false;

  var obj = {};      
  
  obj.loggedIn = function(){
    return loggedIn;
  }

  obj.getNumber = function(){
    return number;
  };
  obj.saveNumber = function(playerId, newNumber) {
    window.localStorage['number'] = newNumber;
    return $http.get('http://whatsmynumbergame.co.uk/api/save_number/' + playerId + '/' + newNumber);
  };
  obj.getRank = function(playerId, number){
    return $http.get('http://whatsmynumbergame.co.uk/api/lookup_rank/' + playerId + '/' + number);
  };
  obj.rollAgain = function(){
    number = Math.floor(Math.random()*1001);
    return number;
  };
  obj.saveUser = function(user) {
    console.log("Saving user via service.");
    console.log(user);
    window.localStorage['user'] = angular.toJson(user);
  };
  obj.getUser = function(){
    return angular.JSON(window.localStorage['user']);
  }
  obj.saveToken = function(token){
    console.log("Save token:" + token);
    window.localStorage['token'] = token;
  };
  obj.getToken = function(){
    return null;
    return window.localStorage['token'];
  };
  obj.validateToken = function(){
      //Call the API to validate an access token, and possibly receive a new one.
      var playerId = obj.getPlayerId();
      var token = obj.getToken();
      return $http.post('http://whatsmynumbergame.co.uk/api/validate_token/' + playerId + '/' + token);
      //return $http.get('http://whatsmynumbergame.co.uk/api/register/');
    };
    obj.isLoggedIn = function(){
      console.log(window.localStorage['token']);
      return window.localStorage['token'] !== null;
    };
    obj.register = function(user){
    //console.log(user);
    return $http.post('http://whatsmynumbergame.co.uk/api/register/',{user: user});
    //return $http.get('http://whatsmynumbergame.co.uk/api/register/');
  };
  obj.savePlayerId = function(id){
    window.localStorage['playerId'] = id;
  };
  obj.getPlayerId = function(){
    return window.localStorage['playerId'];
  };

  obj.saveUsername = function(username){
    window.localStorage['username'] = username;
  };
  obj.getUsername = function(){
    return window.localStorage['username'];
  };
  /**
  * Log a user in via api call and save the token, or return error.
  */
  obj.login = function(user){
    return $http.post('http://whatsmynumbergame.co.uk/api/login/',{user: user}).then(function(response){
      console.log('response from login via service');
      console.log(response);
      if(response.data.token){
              //save the token.
              console.log('logged in');
              loggedIn = true;
              obj.saveToken(response.data.token);
              obj.savePlayerId(response.data.id);
            }
            else{
              //error
              console.log('Error logging in');
              loggedIn = false;
              obj.saveToken(null);
            }
            return {'playerId' : response.data.id, 'token' : response.data.token};
          });
  };
  obj.logout = function(){
    loggedIn = false;
    window.localStorage['token'] = null;
  }
  return obj;
}])

// .factory('Chats', function() {
//   // Might use a resource here that returns a JSON array

//   // Some fake testing data
//   var chats = [{
//     id: 0,
//     name: 'Ben Sparrow',
//     lastText: 'You on your way?',
//     face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
//   }, {
//     id: 1,
//     name: 'Max Lynx',
//     lastText: 'Hey, it\'s me',
//     face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
//   }, {
//     id: 2,
//     name: 'Andrew Jostlin',
//     lastText: 'Did you get the ice cream?',
//     face: 'https://pbs.twimg.com/profile_images/491274378181488640/Tti0fFVJ.jpeg'
//   }, {
//     id: 3,
//     name: 'Adam Bradleyson',
//     lastText: 'I should buy a boat',
//     face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
//   }, {
//     id: 4,
//     name: 'Perry Governor',
//     lastText: 'Look at my mukluks!',
//     face: 'https://pbs.twimg.com/profile_images/491995398135767040/ie2Z_V6e.jpeg'
//   }];

//   return {
//     all: function() {
//       return chats;
//     },
//     remove: function(chat) {
//       chats.splice(chats.indexOf(chat), 1);
//     },
//     get: function(chatId) {
//       for (var i = 0; i < chats.length; i++) {
//         if (chats[i].id === parseInt(chatId)) {
//           return chats[i];
//         }
//       }
//       return null;
//     }
//   }
// })

/**
 * A simple example service that returns some data.
 */
 .factory('Friends', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  // Some fake testing data
  var friends = [{
    id: 0,
    name: 'Otie',
    notes: 'Plays Payday 2',
    face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  }, {
    id: 1,
    name: 'Felix',
    notes: 'Flies into a rage.',
    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  }, {
    id: 2,
    name: 'Ben',
    notes: 'Massive Homestuck fan.',
    face: 'https://pbs.twimg.com/profile_images/491274378181488640/Tti0fFVJ.jpeg'
  }];


  return {
    all: function() {
      return friends;
    },
    get: function(friendId) {
      // Simple index lookup
      return friends[friendId];
    },
    add: function(){
      //Search for and add a new friend function
    }
  }
});
