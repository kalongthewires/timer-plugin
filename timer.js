'use strict'; // needs to be in an IFFE

function Timer (options) {
	options = options || {};
	this.timerContainerSelector = options.timerContainer || '[data-timer]';
	this.timerContainer = document.querySelector(this.timerContainerSelector);

	this.time = options.startTime || 0;
	this.changeTimeInterval = options.changeTimeInterval * 1000 || 1000;
	this.isRunning = false;

	this.countdownIntervalId;
	this.MILLIS_PER_SECOND = 1000;

	this.timeDisplay = this.timerContainer.querySelector('[data-time-display]');
	this.incrementElem = this.timerContainer.querySelector('[data-time-changer=increment]');
	this.decrementElem = this.timerContainer.querySelector('[data-time-changer=decrement]');
	this.startElem = this.timerContainer.querySelector('[data-start]');
	this.stopElem = this.timerContainer.querySelector('[data-stop]');
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

		timer.incrementElem.addEventListener('mousedown', timer.incrementTime.bind(timer), false);
		timer.incrementElem.addEventListener('mouseup', timer.stopChangeTime.bind(timer), false);
		timer.decrementElem.addEventListener('mousedown', timer.decrementTime.bind(timer), false);
		timer.decrementElem.addEventListener('mouseup', timer.stopChangeTime.bind(timer), false);
		timer.startElem.addEventListener('click', timer.start.bind(timer), false);
		timer.stopElem.addEventListener('click',  function () {
			timer.stop();
		}, false);
	},
	setTimeSeconds: function (timeInSeconds) {
		var timer = this;

		timer.time = timeInSeconds * timer.MILLIS_PER_SECOND;
		timer.displayTime(timer.time);
	},
	incrementTime: function () {
		var timer = this,
			increment = function (time) {
				return time + timer.changeTimeInterval;
			};

		timer.changeTime(increment);
	},
	decrementTime: function () {
		var timer = this,
			decrement = function (time) {
				return time >= timer.changeTimeInterval ? time - timer.changeTimeInterval : 0;
			};

		timer.changeTime(decrement);
	},
	changeTime: function (changeFunction) {
		var timer = this,
			speed = 150;

		if (timer.isRunning) { return; }

		timer.time = changeFunction(timer.time);

		timer.displayTime(timer.time);
		timer.timeoutId = window.setTimeout(function () {
			timer.changeTime(changeFunction);
		}, speed);
	},
	stopChangeTime: function () {
		var timer = this;

		clearTimeout(timer.timeoutId);
	},
	start: function () {
		var timer = this;

		if (timer.isRunning) { return; }

		timer.countdown();
		timer.isRunning = true;
	},
	pause: function () {
		var timer = this;

		clearInterval(timer.countdownIntervalId);
	},
	stop: function (callback) {
		var timer = this;

		clearInterval(timer.countdownIntervalId);
		timer.isRunning = false;
		timer.reset();

		if (callback) {
			callback(timer);
		}
	},
	reset: function () {
		var timer = this;

		timer.setTimeSeconds(0);
	},
	countdown: function (callback) {
		var timer = this,
			initialTimerSetting = timer.time,
			startSystemClockTime = new Date().getTime(),
			timeElapsed = 0;

		timer.countdownIntervalId = window.setInterval(function () {
			timeElapsed = new Date().getTime() - startSystemClockTime;

			timer.time = initialTimerSetting - timeElapsed;

			if (timer.time <= 0) {
				timer.stop(callback);
				return;
			}

			timer.displayTime(timer.time);
		}, 100);
	},
	convertTime: function (milliseconds) {
		var timer = this,
			totalSeconds = parseInt(milliseconds / timer.MILLIS_PER_SECOND, 10),
			totalMinutes = parseInt(totalSeconds / 60, 10),
			seconds = timer.formatWithLeadingZero(parseInt(totalSeconds % 60, 10)),
			minutes = timer.formatWithLeadingZero(parseInt(totalMinutes % 60, 10)),
			hours = timer.formatWithLeadingZero(parseInt(totalMinutes / 60, 10));

		return [hours, minutes, seconds].join(":");
	},
	formatWithLeadingZero: function (time) {
		return (time < 10 ? "0" : "") + time;
	},
	displayTime: function () {
		var timer = this;

		timer.timeDisplay.innerHTML = timer.convertTime(timer.time);
	}
};
