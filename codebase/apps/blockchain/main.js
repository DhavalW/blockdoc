/* ------------- About St8Flo : Quick Intro -----------------

	St8Flo is primarily a distributed dataflow framework
	and provides tools to pipe data & syncronise execution,
	across rutimes spread over a network.

	Much like JQuery, St8Flo also exposes a global object called "St8",
	which has several high & low level APIs.

	5 Main Constructs / APIs to keep in mind :

		Threads 	- St8.Thread() - this represents the runtime / machine. Each thread has its own "threadID".
							Usually one physical machine runs one thread, therefore thread = machine.

		Packets 	- St8.Packet() - Data is encapsulated into packets, that get transported across flows.
							Packets can also have routing information & control signals, that trigger off various behaviors on flows, in addition to the standard processing

		Flows 	- St8.Flow() 	- Flows are mini state machines, composed of FlowSt8's piped into each other, that react & modify incoming data packets.
								A FlowSt8 operates on one data packet at a time, then passes it to the next FlowSt8, till all have completed,
							 	after which it may be "pumped" to another flow on a different machine. Pumps have inbuilt routers.
								All FlowSt8's in a flow of a thread, execute on the same thread. The packet only jumps from thread to thread, between flows.

		Routers 	- St8.Router() - Routers decide which flow on which thread to send the data packet to, and have powerful filters used to shorlist threads based on enviroment, or custom parameters

		Markers 	- St8.Marker() - Markers help provide a consensus amongst threads, and can be used to store arbitrary state data.
								Markers are also used to make flows WAIT for certain conditions to occur,
								which may be set by other flows in other threads, allowing markers to be used for syncronisation.


	Basic mechanics of St8Flo :

	Data is read from various sources in small chunks at a time,
	enveloped into "data packets" which contain data and routing / signalling information,
	based on which St8Flo transports it to activate one flow on one thread
	to another flow in a different thread, and so on.
	Each time a packet enters a flow - it triggers the flow's machinery and appropriate signal listeners, as it passes through the flow's FlowSt8s.
	The flow's machinery may modify the data, which gets recorded onto the packet and sent downstream to the next flow.

*/



/* --------------- Main.js ----------------------

	This file is the default starting point of any St8Flo app.

	main.js is the default file that the runtime looks for,
	but can be overridden in the cluster config settings file.

	JSON file param - codebase.mainFile
*/




/* --------------- St8.init() ----------------------------------------------------------
	declares the user app code specific to each environment type viz: Node, Browser, Mobile browser

	Once St8Flo has finished initialising the core, runtime, environment and distribution
	and is ready for executing user code, the function in below code
	appropriate to the initialised enviroment, gets executed

	For eg: below code is to init the app to run on a runtime viz NodeJS environment (all standalone runtimes are NodeJS )
	Browser & Mobile browser environments are a future feature, not yet implemented.


	Best practise - use this to run only the environment specific user app code
	and put all the common code into a separate files ( or file) that get 'required' from here.
	For eg: flowmap.js

*/
St8.init({
	node: function () {

		var logger = {};
		logger.log = debug("app:setup:env");
		logger.error = debug("app:setup:env");
		logger.warn = debug("app:setup:env");

		// debug.enable('app:*, errors:*, warnings:*');
		// debug.enable('*');


		// Environment specific initialisation code
		const EventEmitter = require('events');
		EventEmitter.defaultMaxListeners = 50;

		logger.log('\n\n---------- LOADING APP - Node environment setup ------------\n\n');
		logger.log('ThreadID:\n', APPCONFIG.threadID);
		logger.log('Codebase path:\n', CLUSTER8_CONFIG.codebase.path);
		logger.log('Master IP address:\n', APPCONFIG.masterIP);
		logger.log('\n\n');



		// Require the user code stored as a separate file
		St8.Require('node_modules/st8flo-blockchain');
		St8.Require('rpc.js');
		St8.Require('flowmap.js');


	},

	browser: function () {
		// For a future version. Unsupported at the moment.
	},

	mobileBrowser: function () {
		// For a future version. Unsupported at the moment.
	}
});
