import $ from "jquery";
import './style.scss';
import bkTest from './bkTest'

window.onload = function(){
	
	const _bkTest = bkTest();
	
	$('#start_btn').bind('click', function() {
		_bkTest.toogleTest();
	});
	
	$('#break_btn').bind('click', function() {
		_bkTest.toogleBreak();
	});
}