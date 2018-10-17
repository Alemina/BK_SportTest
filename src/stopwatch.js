export default function stopwatch() {
    let h1 = document.getElementById('stopwatch');
    let seconds = 0;
    let minutes = 0;
    let hours = 0;
    let t;

    function add() {
        seconds++;
        if (seconds >= 60) {
            seconds = 0;
            minutes++;
            if (minutes >= 60) {
                minutes = 0;
                hours++;
            }
        }        
        h1.textContent = (hours ? (hours > 9 ? hours : "0" + hours) : "00") + ":" + (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds);
        timer();
    }

    function minus() {
        seconds--;
        if (seconds <= 0) {
            seconds = 59;
            minutes--;
            if (minutes <= 0) {
                minutes = 59;
                hours--;
            }
        }        
        h1.textContent = (hours ? (hours > 9 ? hours : "0" + hours) : "00") + ":" + (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds);
        timerMinus();
    }

    function timer() {
        t = setTimeout(add, 1000);
    }
    function timerMinus() {
        t = setTimeout(minus, 1000);
    }

    return {
        start: function() {
            timer();
        },
        stop: function() {
            clearTimeout(t);
        },
        clear: function() {
            h1.textContent = "00:00:00";
            seconds = 0; minutes = 0; hours = 0;
        },
        startCountingDown(s, m = 0, h = 0) {
            hours = h;
            minutes = m;
            seconds = s;
            timerMinus();
        }
    }
}