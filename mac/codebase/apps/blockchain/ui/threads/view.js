'use strict';

angular.module('myApp.threadsView', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/threads', {
    templateUrl: 'threads/view.html',
    controller: 'threadsViewCtrl'
  });
}])

.controller('threadsViewCtrl', ['$scope','$rootScope', function($scope, $rootScope) {
	$scope.stringify = function(data){
		return JSON.stringify(data, null, 4);
	};
	$scope.refresh = function(){
		$rootScope.refresh();
	};
}]);
