$(function() {

    $.countdownTimer = function(options){
        var timer = {
            options: $.extend({
                'audioId': 'audio',
                'containerId': 'time',
                'time': 0,
                'interval': 300000 // 5 minute increment/decrement interval
            }, options),
            init: function(){
                timer.audio = document.getElementById(timer.options.audioId);
                timer.audio.pause();
                timer._isPlayingSound = false;
                timer.setTime();
            },
            increment: function(){
                timer.options.time += timer.options.interval;
                timer.setTime();
            },
            decrement: function(){
                timer.options.time -= timer.options.interval;
                if (timer.options.time < 0 ){
                    timer.options.time = 0;
                }
                timer.setTime();
            },
            start: function(){
                timer.counter = setInterval(timer.countdown, 1000);
            },
            stop: function(){
                clearInterval(timer.counter);
                if (timer._isPlayingSound){
                    timer.stopSound();
                }
            },
            clear: function(){
                timer.options.time = 0;
                timer.setTime();
            },
            countdown: function(){
                timer.options.time -= 1000;
                if (timer.options.time <= 0){
                    timer.stop();
                    timer.options.time = 0;
                    timer.playSound();
                }
                timer.setTime();
            },
            playSound: function (){
                timer.audio.play();
                timer._isPlayingSound = true;
            },
            stopSound: function(){
                timer.audio.pause();
                timer.audio.currentTime = 0;
                timer._isPlayingSound = false;
            },
            setTime: function(){
                var hours, minutes, seconds, time;
                time = timer.options.time / 1000;

                hours = Math.floor(time / 3600);
                hours = (hours >= 10) ? hours : '0' + hours;
                minutes = Math.floor(time / 60) - 60 * hours;
                minutes = (minutes >= 10) ? minutes : '0' + minutes;
                seconds = time % 60;
                seconds = (seconds >= 10) ? seconds : '0' + seconds;

                $('#hours').text(hours);
                $('#mins').text(minutes);
                $('#secs').text(seconds);
            }
        };

        return {
            init: timer.init,
            increment: timer.increment,
            decrement: timer.decrement,
            start: timer.start,
            stop: timer.stop,
            clear: timer.clear
        };
    };

});


$(document).ready(function(){
    var timer = $.countdownTimer({
        'interval': 10000
    });
    timer.init();
    isRunning = false;

    $('#increment').on('click', function(){
        timer.increment();
    });

    $('#decrement').on('click', function(){
        timer.decrement();
    });

    $('#start').on('click', function(){
        isRunning = true;
        timer.start();
    });

    $('#stop-clear').on('click', function(){
        if (isRunning){
            timer.stop();
            isRunning = false;
        } else { timer.clear(); }
    });
});
