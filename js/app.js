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