window.onload = function(){
	
	//console.error('debug');
	// comment for test
	
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
var stop_status = false; // true = przerwij test, wcisniety przycisk stop

var full10meters = 0; // ile w danej 2 minutowce jest pelnych 10metrowek
var full10meters_counter = 0; // ile juz przebiegnietych pelne 10m

var restTime = 0;
var currentBollard = 1; 


// ile czasu pomiedzy pacholkami w danym etapie np etap 1 = 4.237s na przebiegniecie 10m
var stage_times = [4237, 3996, 3786, 3597, 3425, 3270, 3127, 2997, 2877, 2767, 2664, 2569, 2481, 2398, 
						2321, 2248, 2180, 2116]; 

function start_test()
{
	
	//TODO zabezpieczenie przed kliknieciem 2 razy start
	
	$('#withoutBreaks_chBox').attr('disabled', true);
	
	// w razie reklikniecia start
	stage = 1;
	restTime = 0;
	sound_name = 'start';
	full10meters_counter = 0;
	currentBollard = 1;
	
	setTimeout(function(){break0 = new Audio('sounds/test_zaraz_sie_rozpocznie.wav'); break0.play();},3000);
	setTimeout(function(){break1 = new Audio('sounds/ustaw_sie_na_numerze_40.wav'); break1.play();},5500);
	setTimeout(function(){break2 = new Audio('sounds/3.wav'); break2.play();},10000);
	setTimeout(function(){break3 = new Audio('sounds/2.wav'); break3.play();},11000);
	setTimeout(function(){break4 = new Audio('sounds/1.wav'); break4.play();},12000);
	
	
	
	setTimeout(function(){play_sound();},13000);

}

function stop_test(){
	
	stop_status = true;
	$('#withoutBreaks_chBox').removeAttr('disabled');
	
	for(i = 0; i < 9; i++)
		clearTimeout('break' + i);
}


function play_sound(){ //TODO zakonczenie
	
	if(stop_status || stage > 18){
		
		stop_status = false;
		console.log('stop');
		return;
	}
	
	console.log('stage = ' + stage + ', interval(ile minelo) = ' + interval + ', sound_name = ' + sound_name + ', full10meters_counter = ' + full10meters_counter + '/' + full10meters + ', restTime = ' + restTime); // testowo	
	
	var audio = new Audio('sounds/' + sound_name + '.wav');
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
	
	
	setTimeout(function(){break0 = new Audio('sounds/stop.wav'); break0.play();},timeout);
	setTimeout(function(){break1 = new Audio('sounds/2_minuty_przerwy.wav'); break1.play();},1700);
	setTimeout(function(){break4 = new Audio('sounds/ustaw_sie_na_numerze.wav'); break4.play();},3400);
	setTimeout(function(){break5 = new Audio('sounds/'+nr+'.wav'); break5.play();},5000);
	setTimeout(function(){break2 = new Audio('sounds/pozostala_minuta.wav'); break2.play();},60000);
	setTimeout(function(){break3 = new Audio('sounds/pozostalo_30_sekund.wav'); break3.play();},90000);
	setTimeout(function(){break6 = new Audio('sounds/10_sekund.wav'); break6.play();},110000);
	setTimeout(function(){break7 = new Audio('sounds/3.wav'); break7.play();},117000);
	setTimeout(function(){break8 = new Audio('sounds/2.wav'); break8.play();},118000);
	setTimeout(function(){break9 = new Audio('sounds/1.wav'); break9.play();},119000);
	setTimeout(function(){break10 = new Audio('sounds/start.wav'); break10.play();},120000);
	
}


































