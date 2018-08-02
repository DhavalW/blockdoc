'use strict';

angular.module('myApp.myDocsView', ['ngRoute'])

	.config(['$routeProvider', function ($routeProvider) {
		$routeProvider.when('/myDocs', {
			templateUrl: 'myDocs/view.html',
			controller: 'myDocsViewCtrl'
		});
	}])

	.controller('myDocsViewCtrl', ['$scope', '$rootScope', 'rpc', 'Block', function ($scope, $rootScope, rpc, Block) {

		$scope.viewState = 'createNew';



		$scope.currentBlock = Block.blankDoc();

		$scope.createNew = function(){
			$scope.currentDocument = null;
			$scope.currentBlock = Block.blankDoc();
		};

		$scope.accountLookup = function(hash){
			return $scope.accounts.find((x)=>x.chain.chainID == hash).chain.genesisBlock.block.data.username;
		};

		$scope.createDoc = function () {
			console.log('attempting to create a doc as ', $scope.currentBlock);
			rpc.call('create', {
					blockData: $scope.currentBlock,
					credentials: {
						username: $scope.loggedInUser.username,
						password: $scope.loggedInUser.password
					},
					authorID: $scope.loggedInUser.accountID
				})
				.then((data) => {
					if (data.success) {
						alert('Doc created');
						$rootScope.refresh();
						$scope.$apply();
					}
					else{
						alert(data.error);
					}
				})
		};

		$scope.updateDoc = function(){
			console.log('attempting to update  doc to ', $scope.currentBlock);
			rpc.call('update', {
					chainID:$scope.currentDocument.chain.chainID,
					data: $scope.currentBlock.data,
					credentials: {
						username: $scope.loggedInUser.username,
						password: $scope.loggedInUser.password
					},
					authorID: $scope.loggedInUser.accountID
				})
				.then((data) => {
					if (data.success) {
						alert('Doc updated');
						$rootScope.refresh();
						$scope.$apply();
					}else{
						alert(data.error);
					}
				});
		};

		$scope.selectDocument = function(item){
			console.log('Selecting Document as item = ', item);
			$scope.currentDocument = item;
			console.log('Selecting Block as item.chain.revBlock.block = ', item.chain.revBlock.block);

			$scope.currentBlock = item.chain.revBlock.block;
			$scope.blocksList = [];
			$scope.currentPermissions = item.chain.genesisBlock.block.meta.permissions;
			item.chain.blockIDList.forEach((bID)=>{
				rpc.call('getBlock',{
					blockID:bID,
					chainID:item.chain.chainID
				})
				.then((data)=>{
					$scope.blocksList.push(data.block);
					$scope.currentPermissions = Object.assign($scope.currentPermissions, data.block.meta.permissions);
					$scope.$apply();
				});
			});
		};
		$scope.selectBlock = function(item){
			console.log('selecting block as ', item);
			// rpc.call('getBlock',{
			// 	blockID:item,
			// 	chainID:$scope.currentDocument.chain.chainID
			// }).then((data)=>{
			// 	console.log('Current block set to ', data.block);
			// 	$scope.currentBlock = data.block;
			// 	$scope.$apply();
			// });

			$scope.currentBlock = item;
		};

		$scope.permModal = {
			show:false,
			launch:function(){
				this.show = true;
			},
			cancel:function(){
				this.show = false;
			},
			doAllow:function(item){
				console.log('permitting ', item);
				rpc.call('allow',{
					chainID:$scope.currentDocument.chain.chainID,
					accountID:item.chain.chainID,
					credentials: {
						username: $scope.loggedInUser.username,
						password: $scope.loggedInUser.password
					},
					authorID: $scope.loggedInUser.accountID
				})
				.then((data) => {
					if (data.success) {
						alert('Permissions updated');
						$rootScope.refresh();
						$scope.$apply();
					}else{
						alert(data.error);
					}
				});
			}
		};
	}]);
