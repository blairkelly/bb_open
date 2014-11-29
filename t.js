var b = require('octalbonescript');

console.log("holy moly");

//var led = "P8_10";
//var led = "P9_14";

var SERVO_PIN = 'P9_14';
var duty_min = 0.03;
var position = 0;
var increment = 0.1;

/*
b.pinMode(led, 'out', function () {
	console.log('done setting pin mode');
});
*/

b.pinMode(SERVO_PIN, b.OUTPUT, function() {
	
});
//b.analogWrite(SERVO, 0.5, 60);