'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.myDocsView',
  'myApp.threadsView',
  'myApp.version',
  'myApp.socket',
  'myApp.blocks',
  'myApp.login'
])
.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/home'});
}])

.run(['rpc','$rootScope',function(rpc, $rootScope){
	$rootScope.refresh = ()=>{
		var tasks = [];
		tasks.push(rpc.call('threadUpdates')
			.then((data)=>{
				$rootScope.threads = data;
				console.log('Threads = ', data);
			}));
		tasks.push(rpc.call('getAllChains')
			.then((data)=>{
				$rootScope.chains = data;
				$rootScope.accounts = data.filter((x)=>{
					return x.chain.genesisBlock.block.meta.blockType == 1;
				});
				$rootScope.documents = data.filter((x)=>{
					return x.chain.genesisBlock.block.meta.blockType == 2;
				});
				console.log('All chains = ', data);
				console.log('Accounts = ', $rootScope.accounts);
				console.log('Documents = ', $rootScope.documents);
			}));

		Promise.all(tasks)
			.then(()=>{
				$rootScope.$apply();
			});
	};
	$rootScope.refresh();
	setInterval(()=>{
		$rootScope.refresh();
	},1000);
}])
