// https://github.com/blairkelly/bb_open.git
var b = require('bonescript');

var leds = ["P8_10"];

console.log(leds);


for(var i in leds) {
    b.pinMode(leds[i], b.OUTPUT);
}

var state = b.LOW;
for(var i in leds) {
    b.digitalWrite(leds[i], state);
}

setInterval(toggle, 1000);

function toggle() {
    if(state == b.LOW) state = b.HIGH;
    else state = b.LOW;
    for(var i in leds) {
        b.digitalWrite(leds[i], state);
        console.log("pin: " + leds[i] + " set to " + state);
    }
}