'use strict';

angular.module('myApp.login', ['ngRoute'])


.controller('loginCtrl', ['$scope','$rootScope','Block','rpc',function($scope, $rootScope,Block,rpc) {
	$scope.test = 'hello there';

	$scope.registerModal = {
		show:false,
		details:{},
		launch:function(){
			this.details = {};
			this.show = true;
		},
		cancel:function(){
			this.details = {};
			this.show = false;
		},
		doRegister:function(){
			var _self = this;
			_self.show = false;
			var blk = Block.blankAc();
			blk.meta.genesis.totalHolders = 3;
			blk.meta.genesis.minHolders = 2;
			blk.meta.tags.push(_self.details.username);
			blk.meta.tags.push(_self.details.role);
			blk.data = {
				name:_self.details.name,
				username:_self.details.username,
				role:_self.details.role
			};
			console.log('Attempting to register with blockData as ', blk);
			rpc.call('register', {blockData:blk, credentials:{username:_self.details.username, password:_self.details.password}})
			.then((data)=>{
				console.log('REgistrations requested with details %s \n returned as ', _self.details, data );
				if(data.success){
					alert('Logged in !');
					$rootScope.loggedInUser = {
						username:_self.details.username,
						password:_self.details.password,
						accountID:data.chainID,
						export:data.export
					};
				}
				$scope.$apply();
			});
			// Registration Code
		}
	};
	$scope.loginModal = {
		show:false,
		details:{},
		launch:function(){
			this.details = {};
			this.show = true;
		},
		cancel:function(){
			this.details={},
			this.show = false;
		},
		doLogin:function(){
			this.show = false;
			// Registration Code
		}
	};
}]);
