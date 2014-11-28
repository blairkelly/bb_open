var b = require('octalbonescript');

console.log("holy moly");

//var led = "P8_10";
var led = "P9_14";

b.pinMode(led, 'out', function () {
	console.log('done setting pin mode');
});
