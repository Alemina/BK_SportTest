import $ from "jquery";
import './style.scss';


window.onload = function(){
	
	$('#start_btn').bind('click', function(){
		start_test();
	});
	
	$('#stop_btn').bind('click', function(){
		stop_test();
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

function start_test()
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
	
	setTimeout(function(){const break0 = new Audio('assets/sounds/test zaraz sie zacznie.wav'); break0.play();},3000);
	setTimeout(function(){const break1 = new Audio('assets/sounds/ustaw sie na numerze A.wav'); break1.play();},5500);
	setTimeout(function(){const break1 = new Audio('assets/sounds/40.wav'); break1.play();},6500);
	setTimeout(function(){const break2 = new Audio('assets/sounds/3.wav'); break2.play();},10000);
	setTimeout(function(){const break3 = new Audio('assets/sounds/2.wav'); break3.play();},11000);
	setTimeout(function(){const break4 = new Audio('assets/sounds/1.wav'); break4.play();},12000);
	
	setTimeout(function(){play_sound();},13000);

}

function stop_test(){
	
	testIsRunned = false;
	//dodac reset intervali

	$('#withoutBreaks_chBox').removeAttr('disabled');
	$('#start_btn').removeAttr('disabled');
	
	for(let i = 0; i < 9; i++)
		clearTimeout('break' + i);
}


function play_sound(){ //TODO zakonczenie
	
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

	setTimeout(function(){play_sound();},interval);

}



function break_test(timeout){
	
	
	var nr = currentBollard -1;
	if(nr==0) nr =1;
	
	
	setTimeout(function(){const break0 = new Audio('assets/sounds/stop.wav'); break0.play();},timeout);
	setTimeout(function(){const break1 = new Audio('assets/sounds/dwie minuty przerwy.wav'); break1.play();},1700);
	setTimeout(function(){const break4 = new Audio('assets/sounds/ustaw sie na numerze A.wav'); break4.play();},3400);
	setTimeout(function(){const break5 = new Audio('assets/sounds/'+nr+'.wav'); break5.play();},5000);
	setTimeout(function(){const break2 = new Audio('assets/sounds/pozostala minuta.wav'); break2.play();},60000);
	setTimeout(function(){const break3 = new Audio('assets/sounds/pozostalo 30 sekund.wav'); break3.play();},90000);
	setTimeout(function(){const break6 = new Audio('assets/sounds/dziesiec sekund.wav'); break6.play();},110000);
	setTimeout(function(){const break7 = new Audio('assets/sounds/3.wav'); break7.play();},117000);
	setTimeout(function(){const break8 = new Audio('assets/sounds/2.wav'); break8.play();},118000);
	setTimeout(function(){const break9 = new Audio('assets/sounds/1.wav'); break9.play();},119000);
	setTimeout(function(){const break10 = new Audio('assets/sounds/start.wav'); break10.play();},120000);
	
}





function stopwatch(){

}




























