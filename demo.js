'use strict';

var myTimer = new Timer({
        timerId: 'time',
        interval: '10'
});

myTimer.init();

document.getElementById('increment').onclick = function () {
    myTimer.incrementTime();
};

document.getElementById('decrement').onclick = function () {
    myTimer.decrementTime();
};

document.getElementById('start').onclick = function () {
    myTimer.start();
};

document.getElementById('stop-clear').onclick = function () {
    myTimer.stop();
};
