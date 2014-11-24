// https://github.com/blairkelly/bb_open.git
var b = require('bonescript');
var socket = require('socket.io-client')('http://10.0.1.7:3000');

//socket.connect('http://10.0.1.7:3000');

var leds = ["P8_10"];

socket.on('connect', function () {
	console.log('socket connected');
	socket.emit('is_drone', true);

	socket.on('sdc', function (data) {
		console.log(data);
	});
	socket.on('disconnect', function () {
		console.log('socket disconnected');
	});
});