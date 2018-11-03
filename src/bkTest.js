import $ from "jquery";
import stopwatch from './stopwatch'
export default function bkTest() {
    
    let stage = 1; // etap 1-18, co 3 przerwa 2min 
    let currentInterval = 4237; // po jakim czasie ma odtworzyc dany dzwiekiem
    let nextSoundName = 'test_zaraz_sie_rozpocznie'; // jaki song ma byc teraz uzyty
    let full10meters = 0; // ile w danej 2 minutowce jest pelnych 10metrowek
    let finishedFull10meters = 0; // ile juz przebiegnietych pelne 10m
    let restTime = 0;
    let currentBollard = 1; 
    let testIsRunned = false;
    let withoutBreak = false;
    // ile czasu pomiedzy pacholkami w danym etapie np etap 1 = 4.237s na przebiegniecie 10m
    const stagesIntervals = [4237, 3996, 3786, 3597, 3425, 3270, 3127, 2997, 2877, 2767, 2664, 2569, 2481, 2398, 
                            2321, 2248, 2180, 2116]; 
    const _stopwatch = stopwatch();

    function calculatePass(){
        
        if(!testIsRunned || stage > 18){
            return;
        }
        
        console.log('stage = ' + stage + ', interval(ile minelo) = ' + currentInterval + ', nextSoundName = ' + nextSoundName + ', finishedFull10meters = ' + finishedFull10meters + '/' + full10meters + ', restTime = ' + restTime); // testowo	
        
        $("#stage").val(stage + " z 18");

        var audio = new Audio('assets/sounds/' + nextSoundName + '.wav');
        audio.play();
        _stopwatch.start();

        

        if(currentBollard > 40) // ustwienie numery pacholka
            currentBollard = 1;
        
        if(finishedFull10meters == 0){ // obliczenie ile w tym etapie pelnych 10metrowek
            full10meters = parseInt((120000 - restTime) / stagesIntervals[stage-1]) ;
            if( (stage%3 == 1 && !withoutBreak) || stage == 1 ){
                currentInterval = stagesIntervals[stage-1];
                restTime = 0;
            }
            else
            currentInterval = restTime;
            
        }
        // TODO stop nie dziala na timeoucie
        // TODO dzwiek koniec jak koniec testu
        // w ogole koniec testu, stage 18 jest last
        //TODO removeattribute dla checbkoxa jak koniec testu
        if(finishedFull10meters == 1){ // zmieniam czas pozostaly dopiero po 1 przejsciu 
            restTime = 120000 - restTime - ( stagesIntervals[stage-1] * full10meters); 
            currentInterval = stagesIntervals[stage-1];
            if( (stage%3 != 1 || withoutBreak) && stage !=1 ) full10meters++; 
        }

        
        
        if(finishedFull10meters < full10meters ){
            
            finishedFull10meters++;
            nextSoundName = currentBollard.toString();
            currentBollard++; 
            
        }else{
            currentInterval = restTime; 
            finishedFull10meters = 0;
            nextSoundName = "bip";
                    
            // obliczenie reszty czasu, w nowym tempie do pierwszego w tym etapie pacholka
            restTime = 10*restTime/stagesIntervals[stage-1]; // ile [m] przebiegl juz poza pacholkiem 
            restTime = 10 - restTime; // ile metrow musi przebiec do kolejnego pacholka ale juz w szybszym tempie
            restTime = stagesIntervals[stage]*restTime/10; // w jakim czasie bedzie biegl te pozostale metry
            
            if(stage%3 == 0 && !withoutBreak){
                currentBollard++;
                restTime =0;
                break_test(currentInterval);
                currentInterval = 120000;
            }
            stage++;
        }
        setTimeout(function(){calculatePass();},currentInterval);
    }

    function break_test(timeout){

        var nr = currentBollard -1;
        if(nr==0) {nr = 1}
        
        playSound('stop', timeout);
        playSound('dwie minuty przerwy', 1700);
        playSound('ustaw sie na numerze A', 3400);
        playSound(nr, 5000);
        playSound('pozostala minuta', 60000);
        playSound('pozostalo 30 sekund', 90000);
        playSound('dziesiec sekund', 110000);
        playSound('3', 117000);
        playSound('2', 118000);
        playSound('1', 119000);
        playSound('start', 120000);
    }

    function startTest()
    {
        if( testIsRunned ){
            return;
        }else{
            testIsRunned = true;
        }
        
        $('#start_btn').removeClass('btn-success');
        $('#start_btn').addClass('btn-danger');
        $('#start_btn').text('Stop');
        $('#start_btn').blur();
        $("#break_btn").prop("disabled", true);
        
        // w razie reklikniecia start
        stage = 1;
        restTime = 0;
        nextSoundName = 'start';
        finishedFull10meters = 0;
        currentBollard = 1;
        
        playSound('test zaraz sie zacznie', 3000);
        playSound('ustaw sie na numerze A', 5500);
        playSound('40', 6500);
        playSound('3', 10000);
        playSound('2', 11000);
        playSound('1', 12000);
        
        setTimeout(function(){calculatePass();},13000);

    }

    function stopTest (){
    
        testIsRunned = false;
        //dodac reset intervali

        $('#start_btn').removeClass('btn-danger');
        $('#start_btn').addClass('btn-success');
        $('#start_btn').text('Start');
        $('#start_btn').blur();
        $("#break_btn").prop("disabled", false);
        
        for(let i = 0; i < 9; i++)
            clearTimeout('break' + i);

        _stopwatch.stop();
    }

    function playSound(soundName, timeout = 0){
        
        if (!testIsRunned) {return}
        if (timeout === 0) {
            const sound = new Audio(`assets/sounds/${soundName}.wav`); 
            sound.play();
        } else {
            setTimeout(()=>{
                if (!testIsRunned) {return}
                const sound = new Audio(`assets/sounds/${soundName}.wav`); 
                sound.play();
            }, timeout);
        }	
    }
    
    return {
        toogleTest() {
            if(testIsRunned) {
                stopTest();
            } else {
                startTest();
            }
        },
        toogleBreak() {
            if(withoutBreak) {
                withoutBreak = true;
            } else {
                withoutBreak = false;
            }
        }
    }
}