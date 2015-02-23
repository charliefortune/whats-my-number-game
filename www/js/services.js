angular.module('starter.services', ['ngCordova'])

.factory('UserService', ['$http',function($http) {
  
  var userService = {};
  var user = {};

  loadUser();

  function loadUser(){
    //Adding new properties to initUser will add them to the user object next time it is loaded up.
    initUser = {playerId : null, 
              username: '',
              email: '',
              token : '',
              number : null,
              numberRolls : 3,
              maxRolls : 5,
              rank : null,
              total: null,
              loggedIn : false,
              newNumber : null,
              facebookData : {token : null, expires_in : null}
            };
    var savedUser = window.localStorage['user'];
    if(savedUser != null){
      user = JSON.parse(savedUser);
    }
    //Check all of the properties exist on the saved user, otherwise add them.
    for(i in initUser){
      if(!user.hasOwnProperty(i)){
        console.log(i + ":" + initUser[i]);
        user.i = initUser[i];
      }
    user.numberRolls = user.numberRolls < 1 ? 0 : user.numberRolls;
    user.numberRolls = 3; //Development
    }
  };

  userService.saveUser = function(){
    window.localStorage['user'] = JSON.stringify(user);
    console.log("Saving User");
  };

  userService.getUser = function(){
    return user;
  };

  /**
  * Validate the users token against the api and get an updated copy of the user record.
  */
  userService.validateToken = function(){
    $http.get('http://whatsmynumbergame.co.uk/api/validate_token/' + user.token).then(function(response){
      console.log(response);
    });
  };

  userService.rollAgain = function(){
    user.newNumber = Math.floor(Math.random()*1001);
    user.numberRolls = user.numberRolls-1;
  };

  userService.saveNumber = function(){
    user.number = user.newNumber;
    $http.get('http://whatsmynumbergame.co.uk/api/save_number/' + user.playerId + '/' + user.newNumber).then(function(response){
      userService.getRank();
      userService.saveUser();
    });
  };

  userService.getRank = function(){
    $http.get('http://whatsmynumbergame.co.uk/api/lookup_rank/' + user.playerId + '/' + user.number).then(function(response){
      user.rank = response.data.rank;
      user.total = response.data.total;
      var number = user.rank.toString().slice(-1);
      switch (number){
        
        case '1':
          user.ordinal = 'st';
          break;

        case '2':
          user.ordinal = 'nd';
          break;

        case '3':
          user.ordinal = 'rd';
          break;

        default:
          user.ordinal = 'th';
          break;
      };
      console.log(number + ':' + user.ordinal);
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
