'use strict';

function InitAudio(){
	console.log("determining audio status..");
	
	if (localStorage.getItem("ANTHILL_AUDIO") === null) {
		
		//audio is not set. Initialize it.
		console.log("audio is not set. Initializing audio to ON status..");
		localStorage.setItem("ANTHILL_AUDIO", "ON");
	}
	if (localStorage.getItem("ANTHILL_MUSIC") === null) {
		
		//music is not set. Initialize it.
		console.log("audio is not set. Initializing music to ON status..");
		localStorage.setItem("ANTHILL_MUSIC", "OFF");
	}

	window.ANTHILL_AUDIO = localStorage.getItem("ANTHILL_AUDIO");
	window.ANTHILL_MUSIC = localStorage.getItem("ANTHILL_MUSIC");
	// current default. should be made a localstorage option later
	window.ANTHILL_SONG = "common/audio/music_pine-forest-summer.wav";
}
function playAudio (audio_file){
	
	if (window.ANTHILL_AUDIO === "ON"){
		console.log("playing audio "+audio_file);
		var audio = new Audio(audio_file);
		audio.play();
	}
	else{
		tlog("skipping audio as per user settings");
		tlog("ANTHILL_AUDIO is "+window.ANTHILL_AUDIO);
	}
}
function playMusic (){
	if (window.ANTHILL_MUSIC === "ON"){
		console.log("playing audio "+window.ANTHILL_SONG);
		window.SONG = new Audio(window.ANTHILL_SONG);
		window.SONG.loop = true;
		window.SONG.play();
	}
}
function stopMusic (){
	if (window.SONG){
		window.SONG.pause();
	}
}
function setMusicON(){
	//change localstore variable
	localStorage.setItem("ANTHILL_MUSIC", "ON");
	window.ANTHILL_MUSIC = "ON";
}
function setMusicOFF(){
	//change localstore variable
	localStorage.setItem("ANTHILL_MUSIC", "OFF");
	window.ANTHILL_MUSIC = "OFF";
}
function setSoundON(){
	//change localstore variable
	localStorage.setItem("ANTHILL_AUDIO", "ON");
	window.ANTHILL_AUDIO = "ON";
}
function setSoundOFF(){
	//change localstore variable
	localStorage.setItem("ANTHILL_AUDIO", "OFF");
	window.ANTHILL_AUDIO = "OFF";
}
function setMusic(){
	window.ANTHILL_MUSIC = localStorage.getItem("ANTHILL_MUSIC");
	if (window.ANTHILL_MUSIC === "ON"){
		$("#musicIcon").css('background-image','url("common/images/sound_icons/musicOn.png")');
	}
	else{
		$("#musicIcon").css('background-image','url("common/images/sound_icons/musicOff.png")');
	}
}
function setSound(){
	window.ANTHILL_AUDIO = localStorage.getItem("ANTHILL_AUDIO");
	if (window.ANTHILL_AUDIO === "ON"){
		$("#soundIcon").css('background-image','url("common/images/sound_icons/loudspeakerOn.png")');
	}
	else{
		$("#soundIcon").css('background-image','url("common/images/sound_icons/loudspeakerOff.png")');
	}
}
function toggleMusic(){
	
	tlog("toggling music");
	window.ANTHILL_MUSIC = localStorage.getItem("ANTHILL_MUSIC");
	
	if (window.ANTHILL_MUSIC === "ON"){
		setMusicOFF();
		$("#musicIcon").css('background-image','url("common/images/sound_icons/musicOff.png")');
	}
	else{
		setMusicON();
		$("#musicIcon").css('background-image','url("common/images/sound_icons/musicOn.png")');
	}
}
function toggleSound(){
	tlog("toggling sound");
	window.ANTHILL_AUDIO = localStorage.getItem("ANTHILL_AUDIO");
	if (window.ANTHILL_AUDIO === "ON"){
		setSoundOFF();
		$("#soundIcon").css('background-image','url("common/images/sound_icons/loudspeakerOff.png")');
	}
	else{
		setSoundON();
		$("#soundIcon").css('background-image','url("common/images/sound_icons/loudspeakerOn.png")');
	}
}



function tlog(data, scope) {
	if (scope === undefined || (typeof LOGGINGSCOPE !== 'undefined' && LOGGINGSCOPE.includes(scope))) {
		if (typeof data === 'string' || data instanceof String) {
			console.log('[tlog]:---> ' + data);
		} else {
			console.log('[tlog]:---> ');
			console.log(data);
		}
	}
}


