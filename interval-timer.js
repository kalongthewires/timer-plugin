'use strict';

var Timer = Timer || {};

function IntervalTimer(options) {
	Timer.call(this, options);

	this.numIntervals = options.numIntervals || 3;
	this.secondsPerInterval = options.secondsPerInterval || 10;
	this.breakTimeInSeconds = options.breakTimeInSeconds || 5;
	this.isBreak = false;
	this.isInterval = true;

	this.time = this.secondsPerInterval;
}

IntervalTimer.prototype = Object.create(Timer.prototype, {
	constructor: IntervalTimer,
	countdown: {
		value: function () {
			var timer = this;

			Timer.prototype.countdown.call(timer, timer.endInterval);
		}
	},
	resetTimer: {
		value: function () {
			var timer = this,
				timeToSet = timer.isBreak ? timer.secondsPerInterval : timer.breakTimeInSeconds;

			timer.isBreak = !timer.isBreak;
			timer.isInterval = !timer.isInterval;

			Timer.prototype.setTimeSeconds.call(timer, timeToSet);
			timer.start();
		}
	},
	endInterval: {
		value: function (context) {
			var timer = context;

			if (timer.isInterval) {
				timer.numIntervals--;
			}

			if (timer.numIntervals > 0) {
				timer.resetTimer();
			}
		}
	}
});

