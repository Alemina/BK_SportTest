import $ from "jquery";
import './style.scss';
import stopwatch from './stopwatch'
import bkTest from './bkTest'


window.onload = function(){

	const _stopwatch = stopwatch();
	const _bkTest = bkTest();
	
	$('#start_btn').bind('click', function(){
		_bkTest.startTest();
		_stopwatch.start();
	});
	
	$('#stop_btn').bind('click', function(){
		_bkTest.stopTest();
	});
}