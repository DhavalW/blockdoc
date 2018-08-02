'use strict';

angular.module('myApp.socket', [])

	.factory('rpc', [function () {

		var socket = io();

		var msgCount = 0;
		var getCount = function () {
			if (msgCount > 1000000)
				msgCount = 0;
			return msgCount++;
		};


		socket.on('connect', function () {
			console.log('server connected');

		});

		socket.on('disconnect', function () {
			console.log('server disconnected');
		});

		var pending = {};
		var rpc = {
			requestHandlers:{},
			responseHandlers:{},
			on:function(cmd, cb){
				this.requestHandlers[cmd] = cb;
			}
		}

		socket.on('message', function(message, data){
			console.log('message recvd as ', message, data);
			switch(message){
				case 'response':
					var msg = JSON.parse(data);
					console.log('Response got as ', msg);
					rpc.responseHandlers[msg.command][msg.msgID](msg.data);
					break;
			}
		});

		rpc.call = function (command, data) {
			return new Promise((res, rej) => {
				try {
					var msgID = 'msg' + getCount();
					if (!rpc.responseHandlers[command])
						rpc.responseHandlers[command] = {};
					rpc.responseHandlers[command][msgID] = (response) => {
						delete rpc.responseHandlers[command][msgID];
						res(response);
					};
					var req = {
						msgID: msgID,
						command: command,
						data: data
					};
					console.log('Sending request as ', req);
					socket.send('request', JSON.stringify(req));
				} catch (e) {
					rej(e);
				};
			});
		};

		rpc.call('ping',"hello")
		.then((res)=> console.log('res = ', res));

		return rpc;
	}]);
