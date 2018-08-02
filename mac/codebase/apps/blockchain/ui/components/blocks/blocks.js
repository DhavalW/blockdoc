'use strict';

angular.module('myApp.blocks', [])

	.factory('Block', [function () {

		const BLOCKTYPES = {
			account: 1,
			standard: 2,
			toString: function (v) {
				switch (v) {
				case BLOCKTYPES.account:
					return 'account';
				case BLOCKTYPES.standard:
					return 'document';
				}
			}
		};

		var blankDocBlockData = function(){
			return {
				meta:{
					blockType:BLOCKTYPES.standard,
					genesis:{
						totalHolders:2,
						minHolders:1
					},
					tags:[],
					author:{
						chainID:'',
						chainRev:'',
						name:''
					}
				},
				data:{},
				prev:'',
				chainID:'',
				signature:'',
				blockID:''
			};
		};
		var blankAcBlockData = function(){
			return {
				meta:{
					blockType:BLOCKTYPES.account,
					genesis:{
						totalHolders:2,
						minHolders:1
					},
					tags:[],
					author:{
						chainID:'',
						chainRev:'',
						name:'',
						publicKey:''
					}
				},
				data:{},
				prev:'',
				chainID:'',
				signature:'',
				blockID:''
			};
		};

		return {
			blankDoc:blankDocBlockData,
			blankAc:blankAcBlockData,
			BLOCKTYPES:BLOCKTYPES
		};
	}]);
