'use strict';

/* Controllers */

var app = angular.module('app', ['ngRoute']);

app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
        when('/notification', {
          templateUrl: 'notification-page.html',
          controller: 'Notification'
        }).
        when('/gamepage', {
          templateUrl: 'game-page.html',
          controller: 'gameController'
        }).
        otherwise({
          redirectTo: '/'
        });
  }]);

app.controller('Notification',['$scope',function ($scope){
    $scope.userText = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos ut alias est magni magnam quibusdam iure vel excepturi eligendi, esse porro natus voluptatem fugiat eveniet assumenda veritatis tempora harum culpa?';
    $scope.runNotification = function(type) {
       new Notification( {
          type: type,
          text : $scope.userText
       });
    }
}]);

app.controller('gameController', ['$scope', function ($scope) {

  // in future it's better to move logic from controller to service

  // obj where we store private data
  var data = {};
  // storage of statuses for displaying to user
  data.statuses = {
    init : 'Press button to start',
    showPlaySign : function(sign) {
        return 'You play with ' + sign;
    },
    computerTurn : 'Computer thinking...',
    userTurn : 'Your turn',
    winText : function(player) {
        return player + " won! Game over."
    }
  }

  // initial values
  $scope.table = new Array(9);
  $scope.userTurn= '1';
  $scope.disableInputs = true;
  $scope.status = data.statuses.init;


  // data values for a new game started
  var startNewGame = function() {
    $scope.table = new Array(9);
    $scope.disableInputs = false;
    $scope.userTurn == '1' ? (data.userSign='x', data.computerSign='o') : (data.userSign='o', data.computerSign='x');
    $scope.status = data.statuses.showPlaySign(data.userSign) + ". " + data.statuses.userTurn;
    // objects where inputs are stored
    data.userData = {};
    data.computerData = {};
    // counter increases every turn
    data.turnsAmount = 0;   
    data.gameOver=false;
    // defined values
    data.cornerValues = [0,2,6,8];
    data.sideValues = [1,3,5,7];
    data.successCombinations = [
      [0,1,2],
      [3,4,5],
      [6,7,8],
      [0,3,6],
      [1,4,7],
      [2,5,8],
      [0,4,8],
      [2,4,6]
    ]
  };

  $scope.start = function() {
    // prepare data models for a new game
    startNewGame();

    // if computer is first user -> take an action
    if (data.computerSign=='x') {
      computerPartAction();
    }
  }


  $scope.startMove = function(cellNumber) {
    userPartAction(cellNumber);
  }


  function userPartAction(cellNumber) {
    //save user results
    placeSign(cellNumber, data.userSign, data.userData);
    // computer turn
    computerPartAction();
  }

  function computerPartAction() {
    switch (data.turnsAmount) {
      case 8 :
        doActions();
        changeStatus(data.statuses.winText('No one'));
        break;
      case 9 :
        changeStatus(data.statuses.winText('No one'));
        break;
      default:
        doActions();
    }

    // main logic of computer turn
    function doActions() {
      changeStatus(data.statuses.computerTurn);
      if(!checkSuccessCombinationPresence()){
        if(!blockUserWin()) {
          addValue();
        }
      }
    };
  }

  /*
  *!!! Internal part of next 2 functions can and should be extracted into one function
  *    because logic is the same, but I left it as it is for better understanding
  */


  function checkSuccessCombinationPresence() {

      // for win 3 chars are needed, if we have less
      // checking has no sense
      if(Object.keys(data.userData).length<2) return;

      for (var i=0;i<data.successCombinations.length;i++) {

          var variant = data.successCombinations[i];
          var successCellsAmount = 0;
          var missingValue;
          for (var j in variant) {
            if (typeof data.computerData[variant[j]] != 'undefined') {
                successCellsAmount++;
            }
            else {
              missingValue = variant[j];
            } 
          }

          if (successCellsAmount == 2) {
            var index =  missingValue;
            // if the only remaining value from success variant is empty
            if ($scope.table[index]==undefined) {              
                changeStatus(data.statuses.winText('Computer'));
                data.gameOver = true;
                $scope.disableInputs = true;
                return placeSign(index, data.computerSign, data.computerData);
            }
            // if the only remaining value from success variant is not empty
            // we remove this variant from successCombinations array

            data.successCombinations.splice(i,1);
            
          }

      }

  }

  function blockUserWin() {

      // for win 3 chars are needed, if we have less
      // checking has no sense
      if(Object.keys(data.userData).length<2) return;

      for (var i=0;i<data.successCombinations.length;i++) {

          var variant = data.successCombinations[i];
          var successCellsAmount = 0;
          var missingValue;
          for (var j in variant) {
            if (typeof data.userData[variant[j]] != 'undefined') {
                successCellsAmount++;
            }
            else {
              missingValue = variant[j];
            } 
          }

          if (successCellsAmount == 2) {
            var index = missingValue;
            data.successCombinations.splice(i,1);
            if ($scope.table[index]==undefined) {
             return placeSign(index, data.computerSign, data.computerData);
            }

          }

      }

  }

  function addValue() {

    // if central cell is empty -> place sign there
    if($scope.table[4]==undefined) {
      return placeSign(4, data.computerSign, data.computerData,true);
    }

    /*
    *!!! Internal part of next 2 loops can and should be extracted into one function
    *    because logic is the same, but I left it as it is for better understanding
    */

    // while corner cell is empty -> place sign there
    while(data.cornerValues.length) {    
        if (data.cornerValues.length) {
          var randomCornerValue = Math.floor(Math.random() * data.cornerValues.length);
          var index = data.cornerValues[randomCornerValue];
          if ($scope.table[index]==undefined) {            
           data.cornerValues.splice(randomCornerValue,1);
           return placeSign(index, data.computerSign, data.computerData);
         }
          else {
            // remove this variant to not check it again in future
            data.cornerValues.splice(randomCornerValue,1);
          }      

        }             
    }

    while(data.sideValues.length) {  
      if (data.sideValues.length) {
        var randomSideValue = Math.floor(Math.random() * data.sideValues.length);
        var index = data.sideValues[randomCornerValue];
        if ($scope.table[index]==undefined) {           
            data.sideValues.splice(randomSideValue,1);
            return placeSign(index, data.computerSign, data.computerData);
        }
        else {
          // remove this variant to not check it again in future
          data.sideValues.splice(randomSideValue,1);
        }

      }          
    }

  }

   function placeSign(index, sign, obj) {
      $scope.table[index]=sign;
      obj[index]=index;
      ++data.turnsAmount;
      if(!data.gameOver) {
        changeStatus(data.statuses.userTurn);
      }
      return true;
   }

  function changeStatus(status) {
      $scope.status = status;
  }


}]);
