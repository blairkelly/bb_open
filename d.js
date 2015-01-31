// https://github.com/blairkelly/bb_open.git
//var b = require('bonescript');
var b = require('octalbonescript');
var socket = require('socket.io-client')('http://10.0.1.14:3000');

var throttle_val = 0.5;
//vehicle info object
var vio = {
	throttle: {
		center: 0.5,
		value: 0.5,
		fwd: 0,
		rev: 0,
	}
}

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

//steering extremes, 0.047 to 0.091
var servos = {
	steering: {
		name: 'steering',
		pin: 'P9_14',
		min: 0.050,
		max: 0.080,
		freq: 60,
		ready: false,
	},
	throttle: {
		name: 'throttle',
		pin: 'P9_16',
		min: 0.037,
		max: 0.157,
		freq: 60,
		ready: false,
		center: 0.5,
	},
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
	//the bizarre looping I have here is due
	//to a strange bug I'm encountering.

	for (servo_name in servos_obj) {
		var _servo = servos_obj[servo_name];
		if (!_servo.ready) {
			console.log("SETTING PINMODE: " + servo_name);
			b.pinMode(_servo.pin, b.OUTPUT, function () {
				console.log(servo_name + ' READY...');
				_servo.ready = true;
				var first_val = _servo.center || 0.5;
				console.log("Writing " + first_val + " to " + servo_name);
				write_servo(_servo, first_val);
				set_servo_pinmodes(servos_obj);
			});
			return null;
		}
	}
}
set_servo_pinmodes(servos);

var write_servo = function (_servo, percent, callback) {
	if (_servo.ready) {
		var setting = _servo.min + (percent * _servo.range);
		//console.log("setting "+_servo.name+": " + setting);
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
		vio.throttle.fwd = value;
	}
	if (throttle == 'LT') {
		vio.throttle.rev = value;
	}
	vio.throttle.val = servos.throttle.center + (vio.throttle.fwd * (1-servos.throttle.center));
	if (vio.throttle.rev) {
		vio.throttle.val = vio.throttle.val - (vio.throttle.rev * vio.throttle.val);
	}
	console.log(vio.throttle.val);
	write_servo(servos.throttle, vio.throttle.val);
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
