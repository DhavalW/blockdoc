'use strict';

angular.module('myApp.homeView', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/home', {
    templateUrl: 'home/view.html',
    controller: 'homeViewCtrl'
  });
}])

.controller('homeViewCtrl', [function() {

}]);
