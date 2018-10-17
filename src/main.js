import $ from "jquery";
import './style.scss';
import './clock.js'


window.onload = function(){
	
	$('#start_btn').bind('click', function(){
		startTest();
	});
	
	$('#stop_btn').bind('click', function(){
		stopTest();
	});
}

var stage = 1; // etap 1-18, co 3 przerwa 2min 
var interval = 4237; // po jakim czasie ma odtworzyc dany dzwiekiem
var sound_name = 'test_zaraz_sie_rozpocznie'; // jaki song ma byc teraz uzyty

var full10meters = 0; // ile w danej 2 minutowce jest pelnych 10metrowek
var full10meters_counter = 0; // ile juz przebiegnietych pelne 10m

var restTime = 0;
var currentBollard = 1; 

var testIsRunned = false;


// ile czasu pomiedzy pacholkami w danym etapie np etap 1 = 4.237s na przebiegniecie 10m
var stage_times = [4237, 3996, 3786, 3597, 3425, 3270, 3127, 2997, 2877, 2767, 2664, 2569, 2481, 2398, 
						2321, 2248, 2180, 2116]; 

function startTest()
{
	if( testIsRunned ){
		return;
	}else{
		testIsRunned = true;
	}
	
	
	$('#withoutBreaks_chBox').attr('disabled', true);
	$('#start_btn').attr('disabled', true);
	
	// w razie reklikniecia start
	stage = 1;
	restTime = 0;
	sound_name = 'start';
	full10meters_counter = 0;
	currentBollard = 1;
	
	playSound('test zaraz sie zacznie', 3000);
	playSound('ustaw sie na numerze A', 5500);
	playSound('40', 6500);
	playSound('3', 10000);
	playSound('2', 11000);
	playSound('1', 12000);
	
	setTimeout(function(){calculatePass();},13000);

}

function stopTest(){
	
	testIsRunned = false;
	//dodac reset intervali

	$('#withoutBreaks_chBox').removeAttr('disabled');
	$('#start_btn').removeAttr('disabled');
	
	for(let i = 0; i < 9; i++)
		clearTimeout('break' + i);
}


function calculatePass(){
	
	if(!testIsRunned || stage > 18){
		return;
	}
	
	console.log('stage = ' + stage + ', interval(ile minelo) = ' + interval + ', sound_name = ' + sound_name + ', full10meters_counter = ' + full10meters_counter + '/' + full10meters + ', restTime = ' + restTime); // testowo	
	
	$("#stage").val(stage + " z 18");



	var audio = new Audio('assets/sounds/' + sound_name + '.wav');
	audio.play();
	

	if(currentBollard > 40) // ustwienie numery pacholka
		currentBollard = 1;
	
	if(full10meters_counter == 0){ // obliczenie ile w tym etapie pelnych 10metrowek
		full10meters = parseInt((120000 - restTime) / stage_times[stage-1]) ;
		if( (stage%3 == 1 && !$('#withoutBreaks_chBox').is(':checked')) || stage == 1 ){
			interval = stage_times[stage-1];
			restTime = 0;
		}
		else
			interval = restTime;
		
	}
	// TODO stop nie dziala na timeoucie
	// TODO dzwiek koniec jak koniec testu
	// w ogole koniec testu, stage 18 jest last
	//TODO removeattribute dla checbkoxa jak koniec testu
	if(full10meters_counter == 1){ // zmieniam czas pozostaly dopiero po 1 przejsciu 
		restTime = 120000 - restTime - ( stage_times[stage-1] * full10meters); 
		interval = stage_times[stage-1];
		if( (stage%3 != 1 || $('#withoutBreaks_chBox').is(':checked')) && stage !=1 ) full10meters++; 
	}

	
	
	if(full10meters_counter < full10meters ){
		
		full10meters_counter++;
		sound_name = currentBollard.toString();
		currentBollard++; 
		
	}else{
		interval = restTime; 
		full10meters_counter = 0;
		sound_name = "bip";
				
		// obliczenie reszty czasu, w nowym tempie do pierwszego w tym etapie pacholka
		restTime = 10*restTime/stage_times[stage-1]; // ile [m] przebiegl juz poza pacholkiem 
		restTime = 10 - restTime; // ile metrow musi przebiec do kolejnego pacholka ale juz w szybszym tempie
		restTime = stage_times[stage]*restTime/10; // w jakim czasie bedzie biegl te pozostale metry
		
		if(stage%3 == 0 && !$('#withoutBreaks_chBox').is(':checked')){
			currentBollard++;
			restTime =0;
			break_test(interval);
			interval = 120000;
			
		}
		
		stage++;
	}

	setTimeout(function(){calculatePass();},interval);

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




























