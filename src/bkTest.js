import $ from "jquery";
import stopwatch from './stopwatch'
import guiActions from './gui'

export default function bkTest() {
    
    let stage = 1; // etap 1-18, co 3 przerwa 2min 
    let currentInterval = 4237; // po jakim czasie ma odtworzyc dany dzwiekiem
    let nextSoundName = 'start'; // jaki song ma byc teraz uzyty
    let full10meters = 0; // ile w danej 2 minutowce jest pelnych 10metrowek
    let finishedFull10meters = 0; // ile juz przebiegnietych pelne 10m
    let restTime = 0;
    let currentBollard = 1; 
    let testIsRunned = false;
    let firstTimeInStage = true;
    let withBreaks = true;
    let timeoutHandle = null;
    let deleteit = 0;
    // ile czasu pomiedzy pacholkami w danym etapie np etap 1 = 4.237s na przebiegniecie 10m
    const stagesIntervals = [4237, 3996, 3786, 3597, 3425, 3270, 3127, 2997, 2877, 2767, 2664, 2569, 2481, 2398, 
                            2321, 2248, 2180, 2116]; 
    const _currentTime = stopwatch('current-time');

    function startTest()
    {
        if( testIsRunned ){
            return;
        }else{
            testIsRunned = true;
        }
        
        guiActions().setTestOn();        
        _currentTime.startCountingDown(13);

        playSoundWithDelay('test zaraz sie zacznie', 3000)
        .then( () => playSoundWithDelay('ustaw sie na numerze A', 2500))
        .then( () => playSoundWithDelay('40', 1000))
        .then( () => playSoundWithDelay('3', 3500))
        .then( () => playSoundWithDelay('2', 1000))
        .then( () => playSoundWithDelay('1', 1000))
        .then( () => 
            timeoutHandle = setTimeout(function() {
                _currentTime.stop();
                _currentTime.start()
                calculatePass();
            },1000)
        )
    }

    function stopTest (){
        testIsRunned = false;
        guiActions().setTestOff();
        clearTimeout(timeoutHandle);
        timeoutHandle = null;
        _currentTime.stop();
        _currentTime.clear();
    }

    function setInitState() {
        const beginStage = parseInt($('#beginFromStage').val());
        stage = beginStage;
        currentInterval = stagesIntervals[beginStage-1];
        nextSoundName = 'start';
        full10meters = 0;
        finishedFull10meters = 0;
        restTime = 0;
        currentBollard = 1; 
        firstTimeInStage = 'true';
        deleteit = 0 - currentInterval;
    }

    function calculatePass() {
        deleteit += currentInterval;
        console.log('currentInterval', currentInterval, restTime, nextSoundName, deleteit);
        
        if (!testIsRunned || stage > 18) {
            return;
        }

        guiActions().setCurrentStage(stage);
        playSoundNow(nextSoundName);
        
        if (currentBollard > 40) {
            currentBollard = 1;
        }
        if (firstTimeInStage) {
            calculateFull10meters();
            calculateFirstInterval();
            calculateRestTime();
        } else {
            currentInterval = stagesIntervals[stage-1];
        }

        if (finishedFull10meters < full10meters ) {
            if (stagesIntervals.includes(currentInterval)) {
                finishedFull10meters++;
            }
            firstTimeInStage = false;
            nextSoundName = currentBollard.toString();
            currentBollard++;
        } else {
            finishedFull10meters = 0;
            nextSoundName = "bip";

            if (stage%3 === 0 && withBreaks) {
                currentBollard++;
                twoMinutesBreak(restTime);
                currentInterval = 120000 + restTime;
                restTime = 0;
            } else {
                currentInterval = restTime;
                calculateRestTime(true);
            }

            firstTimeInStage = true;
            stage++;
        }
        timeoutHandle = setTimeout(function(){
            calculatePass();
        }, currentInterval);
    }

    function twoMinutesBreak(timeout){
        var nr = currentBollard - 1;
        if (nr === 0) {
            nr = 1
        }
        playSoundWithDelay('stop', timeout)
        .then( () => playSoundWithDelay('dwie minuty przerwy', 1700))
        .then( () => playSoundWithDelay('ustaw sie na numerze A', 1700))
        .then( () => playSoundWithDelay(nr, 1300))
        .then( () => playSoundWithDelay('pozostala minuta', 55300))
        .then( () => playSoundWithDelay('pozostalo 30 sekund', 30000))
        .then( () => playSoundWithDelay('dziesiec sekund', 20000))
        .then( () => playSoundWithDelay('3', 7000))
        .then( () => playSoundWithDelay('2', 1000))
        .then( () => playSoundWithDelay('1', 1000))
    }

    function playSoundWithDelay(soundName, timeout = 0) {
        return new Promise(function(resolve, reject){
            if (timeout === 0) {
                playSoundNow(soundName);
                resolve();
            } else {
                timeoutHandle = setTimeout(()=>{
                    playSoundNow(soundName);
                    resolve();
                }, timeout);
            }	
        })
    }

    function playSoundNow(soundName) {
        const sound = new Audio(`assets/sounds/${soundName}.wav`); 
        sound.play();
    }

    // obliczenie ile w tym etapie pelnych 10metrowek
    function calculateFull10meters() {
        full10meters = parseInt((120000 - restTime) / stagesIntervals[stage-1]) ;
    }

    function calculateRestTime(restTimeToFirstBollard = false) {
        if (restTimeToFirstBollard) {
            // obliczenie reszty czasu, w nowym tempie do pierwszego w tym etapie pacholka
            restTime = 10*restTime/stagesIntervals[stage-1]; // ile [m] przebiegl juz poza pacholkiem 
            restTime = 10 - restTime; // ile metrow musi przebiec do kolejnego pacholka ale juz w szybszym tempie
            restTime = stagesIntervals[stage]*restTime/10; // w jakim czasie bedzie biegl te pozostale metry
            restTime = parseInt(restTime);
        } else {
            restTime = 120000 - restTime - (stagesIntervals[stage-1] * full10meters); 
        }
    }

    function calculateFirstInterval() {
        const beginStage = parseInt($('#beginFromStage').val());
        if ((stage%3 === 1 && withBreaks) || (stage === beginStage && !withBreaks)) {
            currentInterval = stagesIntervals[stage-1];
        } else {
            currentInterval = restTime;
        }
    }

    return {
        toogleTest() {
            if (testIsRunned) {
                stopTest();
            } else {
                setInitState();
                startTest();
            }
        },
        toogleBreak() {
            if (withBreaks) {
                withBreaks = false;
                guiActions().setBreaksOff();
            } else {
                withBreaks = true
                guiActions().setBreaksOn();
            }
        }
    }
}