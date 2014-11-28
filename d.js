// https://github.com/blairkelly/bb_open.git
//var b = require('bonescript');
var b = require('octalbonescript');
var socket = require('socket.io-client')('http://10.0.1.7:3000');

//var led = "P8_10";
var led = "P9_14";

b.pinMode(led, 'out', function () {
	console.log('done setting pin mode');
});
//b.digitalWrite(led, false);

// var SERVO = 'P9_14';
// var duty_min = 0.03;
// var position = 0;
// var increment = 0.1;

//b.pinMode(SERVO, b.OUTPUT);
//b.analogWrite(SERVO, 0.5, 60);

var axes_ctrl = function (axes, value) {
	value = (parseFloat(value) + 1) / 2;

	if (axes == '2') {
		//RX

	}
}
var throttle_ctrl = function (throttle, value) {
	value = parseFloat(value);
	if (throttle == 'RT') {
		console.log(value);
	}
}
var btn_ctrl = function (btn, value) {
	var state = (value === 'true');
	if (btn == 'B') {
		//b.digitalWrite(led, state);
	}
}


socket.on('connect', function () {
	console.log('socket connected');
	socket.emit('is_drone', true);

	socket.on('sdc', function (data) {
		var split_data = data.split(' ');
		for (var i=0; i<split_data.length; i++) {
			var rcmd = split_data[i].split('/');
			if (rcmd[0] == 'a') {
				axes_ctrl(rcmd[1], rcmd[2]);
			} else if (rcmd[0] == 't') {
				throttle_ctrl(rcmd[1], rcmd[2]);
			} else if (rcmd[0] == 'b') {
				btn_ctrl(rcmd[1], rcmd[2]);
			}
		}
	});

	socket.on('disconnect', function () {
		console.log('socket disconnected');
	});

});