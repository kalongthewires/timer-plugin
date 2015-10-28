'use strict';

function Timer (options) {
	this.time = options.startTime || 0;
	this.interval = options.interval * 1000 || 1000;

	this.timerId = options.timerId || 'timer';
	this.incrementId = options.incrementId || 'increment';
	this.decrementId = options.decrementId || 'decrement';
	this.startId = options.startId || 'start';
	this.stopId = options.stopId || 'stop-clear';

	this.countdownInterval = null;
	this.isRunning = false;
	this.onStopCallbacks = [];
}

Timer.prototype = {
	constructor: Timer,
	init: function () {
		var timer = this;

		timer.attachEvents();
		timer.setTimeSeconds(timer.time);
	},
	attachEvents: function () {
		var timer = this;

		document.getElementById(timer.incrementId).addEventListener('mousedown', timer.incrementTime.bind(timer), false);
		document.getElementById(timer.decrementId).addEventListener('mousedown', timer.decrementTime.bind(timer), false);
		document.getElementById(timer.incrementId).addEventListener('mouseup', timer.stopChangeTime.bind(timer), false);
		document.getElementById(timer.decrementId).addEventListener('mouseup', timer.stopChangeTime.bind(timer), false);
		document.getElementById(timer.startId).addEventListener('click', timer.start.bind(timer), false);
		document.getElementById(timer.stopId).addEventListener('click', timer.stop.bind(timer), false);
	},
	setTimeSeconds: function (timeInSeconds) {
		var timer = this;

		timer.time = timeInSeconds * 1000;
		timer.displayTime(timer.time);
	},
	// TODO: use better pattern to avoid repetition in increment and decrement functions
	incrementTime: function () {
		var timer = this,
			incrementSpeed = 150;

		if (!timer.isRunning) {
			timer.time += timer.interval;
			timer.displayTime(timer.time);

			timer.timeoutId = window.setTimeout(function() {
				timer.incrementTime();
			}, incrementSpeed);
		}
	},
	decrementTime: function () {
		var timer = this,
			decrementSpeed = 150;

		if (!timer.isRunning && timer.time > 0) {
			timer.time -= timer.interval;
			timer.displayTime(timer.time);

			timer.timeoutId = window.setTimeout(function() {
				timer.decrementTime();
			}, decrementSpeed);
		}
	},
	stopChangeTime: function () {
		var timer = this;

		clearTimeout(timer.timeoutId);
	},
	start: function () {
		var timer = this;

		if (!timer.isRunning) {
			timer.countdown();
			timer.isRunning = true;
		}
	},
	pause: function () {
		var timer = this;

		clearInterval(timer.countdownInterval);
	},
	stop: function () {
		var timer = this;

		clearInterval(timer.countdownInterval);
		timer.isRunning = false;
		timer.reset();
	},
	reset: function () {
		var timer = this;

		timer.time = 0;
		timer.displayTime(timer.time);
	},
	countdown: function (callback) {
		var timer = this,
			initialTimerSetting = timer.time,
			startSystemClockTime = new Date().getTime(),
			timeElapsed = 0;

		timer.countdownInterval = window.setInterval(function () {
			timeElapsed = new Date().getTime() - startSystemClockTime;

			timer.time = initialTimerSetting - timeElapsed;

			if (timer.time <= 0) {
				timer.stop();

				if (callback) {
					callback(timer);
				}

				return;
			}

			timer.displayTime(timer.time);

		}, 100);
	},
	convertTime: function (milliseconds) {
		var timer = this,
			totalSeconds = parseInt(milliseconds / 1000, 10),
			totalMinutes = parseInt(totalSeconds / 60, 10),
			seconds = timer.formatWithLeadingZero(parseInt(totalSeconds % 60, 10)),
			minutes = timer.formatWithLeadingZero(parseInt(totalMinutes % 60, 10)),
			hours = timer.formatWithLeadingZero(parseInt(totalMinutes / 60, 10));

		return [hours, minutes, seconds].join(":");
	},
	formatWithLeadingZero: function (time) {
		return time < 10 ? "0" + time : time;
	},
	displayTime: function () {
		var timer = this;

		document.getElementById(timer.timerId).innerHTML = timer.convertTime(timer.time);
	}
};
