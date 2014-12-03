// https://github.com/blairkelly/bb_open.git
//var b = require('bonescript');
var b = require('octalbonescript');
var socket = require('socket.io-client')('http://10.0.1.5:3000');


var SERVO_PIN = 'P9_14';

var generic_servo_profiles = {
	'HS-645MG': {
		min: 0.037,
		max: 0.157,
		freq: 60,
	},
	'HS-85MG': {
		min: 0.030,
		max: 0.140,
		freq: 60,
	}
}

var servos = {
	steering: {
		name: 'steering',
		pin: 'P9_14',
		min: 0.030,
		max: 0.140,
		freq: 60,
		ready: false,
	}	
}

var set_servo_ranges_and_mids = function (servos_obj) {
	for (servo_name in servos_obj) {
		var _servo = servos_obj[servo_name];
		_servo.range = _servo.max - _servo.min;
		_servo.mid = _servo.min + (_servo.range / 2);
	}
}

set_servo_ranges_and_mids(generic_servo_profiles);
set_servo_ranges_and_mids(servos);
console.log(servos);

var set_servo_pinmodes = function (servos_obj) {
	for (servo_name in servos_obj) {
		var _servo = servos_obj[servo_name];
		b.pinMode(_servo.pin, b.OUTPUT, function () {
			console.log(servo_name + ' servo output READY...');
			_servo.ready = true;
		});
	}
}
set_servo_pinmodes(servos);

var write_servo = function (_servo, percent, callback) {
	if (_servo.ready) {
		var setting = _servo.min + (percent * _servo.range);
		//console.log('writing to '+_servo.name+': ' + setting);
		b.analogWrite(_servo.pin, setting, _servo.freq, callback);
	}
}

var axes_ctrl = function (axes, value) {
	value = (parseFloat(value) + 1) / 2;

	if (axes == '2') {
		//RX
		write_servo(servos.steering, value);
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
