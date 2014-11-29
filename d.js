// https://github.com/blairkelly/bb_open.git
//var b = require('bonescript');
var b = require('octalbonescript');
var socket = require('socket.io-client')('http://10.0.1.5:3000');

//var led = "P8_10";
//var servo_pin = "P9_14";

//b.pinMode(led, 'out', function () {
//	console.log('done setting pin mode');
//});
//b.digitalWrite(led, false);

var SERVO_PIN = 'P9_14';
var servo_is_ready = false;
var servo_name = "HS-645MG";
var servo_min = 0.037;
var servo_max = 0.157;
var servo_range = servo_max - servo_min;
var servo_mid = servo_min + (servo_range / 2);

b.pinMode(SERVO_PIN, b.OUTPUT, function () {
	console.log('done setting SERVO pin mode');
	//var duty_cycle = (position*0.115) + duty_min;
	servo_is_ready = true;
	console.log('servo is ready...');
	b.analogWrite(SERVO_PIN, servo_mid, 60, function (report) {
		
	});
});

var moveit = function () {
	console.log("current_pos: " + current_pos);
	b.analogWrite(SERVO_PIN, current_pos, 60, function (report) {
		setTimeout(function () {
			if (current_pos < servo_max) {
				current_pos+=0.001;
				moveit();
			}
		}, 250);
	});
}

var axes_ctrl = function (axes, value) {
	value = (parseFloat(value) + 1) / 2;

	if (axes == '2') {
		//RX
		var servo_setting = (value * servo_range) + servo_min;
		b.analogWrite(SERVO_PIN, servo_setting, 60);
	}
}
var throttle_ctrl = function (throttle, value) {
	value = parseFloat(value);
	if (throttle == 'RT') {

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
