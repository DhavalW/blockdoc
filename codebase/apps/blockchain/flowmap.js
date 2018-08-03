St8.Module('main', function (Module) {

	var core = St8.Lib('core');

	var Block = St8.Module('bc', core.storage.blockChain());

	var ed25519 = forge.pki.ed25519;
	var prompt = St8.Require('node_modules/prompt');


	var accountData = {
		meta: {
			genesis: {
				totalHolders: 2,
				minHolders: 2
			},
			blockType: Block.constants.BLOCKTYPES.account,
			author: {},
		},
		data: {
			name: "Dhaval",
			surname: "Wathare",
			role: "admin"
		},
		prev: null
	};

	var docData = {
		meta: {
			genesis: {
				totalHolders: 2,
				minHolders: 2
			},
			blockType: Block.constants.BLOCKTYPES.standard,
			author: {},
		},
		data: "Hello how are you. This represents a text document that you might have uploaded to the blockchain system !",
		prev: null
	};


	/* ------------------ 3. Distribute & Get started ------------- */

	// var account1 = Block.Chain();
	// var account2 = Block.Chain();
	// var doc1 = Block.Chain();
	// var doc2 = Block.Chain();

	St8.distributor.distribute()
		.then(() => {

			rpc.on('threadUpdates', function(){
				var r = St8.Router(null, {allowSelf:true});
				var ret;
				// console.log('Router registry - ', r.registry);
				// console.log('Router transforms - ', r.transforms);

				ret = r.allowSelf().reSync().getAll();
				// console.log('Router update return - ', ret);
				// console.log('Router transforms - ', r.transforms);

				St8.connector.threadRegistryManager.threadRegistry;

				return ret;
			});

			rpc.on('getChain', function(params){
				return Block.Chain.cache.get(params.chainID).export();
			});
			rpc.on('getAllChains', function(params){
				var list = [];
				Block.Chain.cache.list().forEach((k)=> list.push(Block.Chain.cache.get(k).export()));
				return list;
			});

			rpc.on('getBlock', function(params){
				return Block.Block.cache.get(params.blockID, params.chainID).export();
			});

			rpc.on('register', function(params){

				var ac = Block.Chain();

				return ac.create(params.blockData, params.credentials)
				.then(()=>{
					console.log('Registration done - chain is ', ac.getChainID());
					console.log('holders are ', ac.getHolders());
					return {
						success:true,
						chainID:ac.getChainID(),
						holders:ac.getHolders(),
						export:ac.export()
					};
				})
				.catch((e)=> {
					console.log('RPC - register method error -  ',e);
					return {
						success:false,
						error:'error - '+ e
					};
				});

			});
			rpc.on('create', function(params){

				var doc = Block.Chain();
				var authorChain = Block.Chain();

				return doc.create(params.blockData, params.credentials, params.authorID, false)
					.then(()=> {
						return {
							success:true,
							chainID:doc.getChainID(),
							holders:doc.getHolders(),
							export:doc.export()
						};
					})
					.catch((e)=> {
						console.log('RPC - create method error -  ',e);
						return {
							success:false,
							error:'error - '+ e
						};
					});

			});
			rpc.on('update', function(params){
				var doc = Block.Chain();
				return doc.fromID(params.chainID,{checkLocal:true})
					.then((d)=>{
						if(d) doc = d;
						return doc.updateData(params.data, params.credentials, params.authorID);
					})
					.then(()=> {
						return {
							success:true,
							chainID:doc.getChainID(),
							holders:doc.getHolders(),
							export:doc.export()
						};
					})
					.catch((e)=> {
						console.log('RPC - update method error -  ',e);
						return {
							success:false,
							error:'error - '+ e
						};
					});

			});

			rpc.on('allow', function(params){
				var doc = Block.Chain();
				return doc.fromID(params.chainID,{checkLocal:true})
					.then((d)=>{
						if(d) doc = d;
						return doc.allowAccount(params.accountID, params.credentials, params.authorID);
					})
					.then(()=> {
						return {
							success:true,
							chainID:doc.getChainID(),
							holders:doc.getHolders(),
							export:doc.export()
						};
					})
					.catch((e)=> {
						console.log('RPC - update method error -  ',e);
						return {
							success:false,
							error:'error - '+ e
						};
					});
			})




			if (St8.Thread().getID() == 'thread2') {



				// var tasks = [];
				// console.log('\n\n---------------------------------- WELCOME TO THE BLOCKCHAIN DEMO ------------------------------------------\n\n');
				// console.log('1. Every atomic entity (document, account, relationship, permission) is a blockchain.');
				// console.log('2. Each blockchain represents one data entity, and each of the blocks in that chain represent its versions / updates over time');
				// console.log('3. Every chain is uniquely identified by a chainID + chainRev together');
				//
				// console.log("\n\n------> 1> Let's create a new account \n\n");
				//
				// console.log('HINT! Register user #1 user/pass as - user1/123');
				// return account1.create(accountData)
				// 	.then(() => {
				// 		console.log('\n\nAccount #1 created successfully & exists now as its own blockchain, with id [%s]', account1.getChainID());
				// 		console.log('\n\n------> 2> Lets create a new Data (Document) chain with the created account \n\n');
				// 		prompt.start();
				// 		return (new Promise((res, rej) => {
				// 			prompt.get(['text'], function (err, result) {
				// 				//
				// 				// Log the results.
				// 				//
				// 				console.log('Command-line input received:');
				// 				console.log('  text: ' + result.text);
				//
				// 				if (err) {
				// 					rej(err);
				// 				} else {
				// 					res(result);
				// 				}
				// 			});
				//
				// 		}));
				//
				// 	})
				// 	.then((text) => {
				// 		docData.data = text;
				// 		console.log('\nHINT! enter user #1 login - user1/123');
				// 		return doc1.create(docData, account1);
				// 	})
				// 	.then(() => {
				// 		console.log('\n\nDocument #1 successfully created using account [%s]. ', doc1.getOriginalAuthor().chainID);
				// 		doc1.show();
				// 		console.log('\n\n\nNOTE - only user "user1" can use account#1 to create documents');
				//
				// 		console.log("\n------> 3> To test that, Let's create another account \n\n");
				//
				// 		console.log('HINT - Register user#2 user|pass as user2|456 ');
				// 		return account2.create(accountData);
				// 	})
				// 	.then(() => {
				// 		console.log("\n\n------> 4> Let's assume user #2 is fraudulently trying to expoloit account1 and gain access ot its documents \n\n");
				// 		console.log("Hint! - Enter user #2 credentials (ie user2|456)");
				// 		return doc2.create(docData, account1);
				// 	})
				// 	.then(() => {
				// 		console.log("\n\nAs you can see, the system does not allow it.");
				// 		console.log("\n\n\n-----> 5> Let's try updating the doc ");
				// 		console.log("Hint! - add new text that the document should have");
				//
				// 		prompt.start();
				// 		return (new Promise((res, rej) => {
				// 			prompt.get(['text'], function (err, result) {
				// 				//
				// 				// Log the results.
				// 				//
				// 				console.log('Command-line input received:');
				// 				console.log('  text: ' + result.text);
				//
				// 				if (err) {
				// 					rej(err);
				// 				} else {
				// 					res(result);
				// 				}
				// 			});
				//
				// 		}));
				// 	})
				// 	.then((input) => {
				// 		console.log('Data in doc#1 is ', doc1.getData());
				// 		return doc1.updateData(input.text, account1);
				// 	})
				// 	.then(() => {
				// 		console.log('\ndoc#1 updated ! ');
				// 		doc1.show();
				//
				// 		console.log("\n\n-----> 6> Let's try tampering with doc #1");
				// 		console.log("Hint! - Enter any text you'd like to change document #1 to");
				//
				//
				// 		prompt.start();
				// 		return (new Promise((res, rej) => {
				// 			prompt.get(['text'], function (err, result) {
				// 				//
				// 				// Log the results.
				// 				//
				// 				console.log('Command-line input received:');
				// 				console.log('  text: ' + result.text);
				//
				// 				if (err) {
				// 					rej(err);
				// 				} else {
				// 					res(result);
				// 				}
				// 			});
				//
				// 		}));
				// 	})
				// 	.then((input) => {
				// 		doc1.chain.revBlock.block.data = input.text;
				// 		console.log('\n\nDoc #1 is modified ');
				// 		doc1.show();
				//
				// 		console.log("\n\n\n-----> 7> Attempting to verify contents of file");
				// 		return doc1.getBlock().verify(account1)
				//
				//
				// 	})
				// 	.then((res) => {
				// 		if (res)
				// 			console.log('\n\ndoc1 verification sucessful');
				// 		else
				// 			console.log('\n\ndoc1 verification failed.\nContents have been tampered with');
				//
				// 		doc1.show();
				//
				// 		console.log("\n\n-----> 6> Let's try permissions");
				// 		console.log('\n\nCurrently a/c2 is not permitted to update doc#1');
				//
				// 		return doc1.updateData("update from a/c 2", account2);
				// 	})
				// 	.catch((e) => {
				// 		console.error('Error occured - ', e);
				// 	})
				// 	.then(() => {
				// 		console.log('\n\nClearly, account2 does not have access. Lets give it to em');
				//
				// 		console.log("Hint! - login with user#1 login details (user1/123)");
				// 		return doc1.allowAccount(account1, account2);
				// 	})
				// 	.then(() => {
				// 		doc1.show();
				//
				// 		console.log("Permission granted.");
				// 		console.log("Hint! - login as user #2 (user2/456)");
				//
				// 		return doc1.updateData("update from a/c 2", account2);
				// 	})
				// 	.then(() => {
				// 		doc1.show();
				//
				// 		console.log('\n\nA/c #2 got access to doc #1 !');
				//
				// 	})
				//
				// 	.catch((e) => {
				// 		console.error('Error occured - ', e);
				// 	})
				//


			}

		})
		.catch((e) => {
			console.error('Flowmap - Failed to setup, e = ', e);
		});




});
