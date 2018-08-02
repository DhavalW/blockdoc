(function(){

	/* ---------------------- Web UI Comms Server ---------------------------*/

	var io = St8.Require('node_modules/socket.io')(http);

	var rpc = {
		requestHandlers:{},
		on:function(cmd, cb){
			this.requestHandlers[cmd] = cb;
		}
	};

	io.on('connection', function (socket) {
		console.log('a user connected');
		socket.on('message',(message, data)=>{

			// console.log('incoming message = %s, data = ', message, data);
			switch(message){
				case 'request':
					var msg = JSON.parse(data);
					// console.log('\n\n REQ : ', msg);
					Promise.resolve(rpc.requestHandlers[msg.command](msg.data, msg))
						.then((data)=> {
							var r = {
								msgID:msg.msgID,
								command:msg.command,
								data:data
							}
							// console.log('\n\n RESPONDING as : ', r);

							socket.send('response',JSON.stringify(r));
						});
					break;

			}
		});
	});


	rpc.on('ping',function(params){
		return params + "-pong";
	});

	// Attach to global object.
	G.rpc = rpc;

})();
