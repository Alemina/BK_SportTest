import $ from "jquery";
import './style.scss';
import hacktimer from 'hacktimer'
import bkTest from './bkTest'
import guiActions from './gui'


window.onload = function(){
	
	const _bkTest = bkTest();
	
	$('#start_btn').bind('click', function() {
		_bkTest.toogleTest();
	});
	
	$('#break_btn').bind('click', function() {
		_bkTest.toogleBreak();
	});

	$('select').change(beginStageHandler);
}

function beginStageHandler() {
	guiActions().onChangeBeginStage();
}