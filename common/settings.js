
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

	ANTHILL_AUDIO = localStorage.getItem("ANTHILL_AUDIO");
	ANTHILL_MUSIC = localStorage.getItem("ANTHILL_MUSIC");
	
	//current default. should be made a localstorage option later
	ANTHILL_SONG = "common/audio/music_pine-forest-summer.wav";
}
function playAudio (audio_file){
	
	if (ANTHILL_AUDIO == "ON"){
		console.log("playing audio "+audio_file);
		var audio = new Audio(audio_file);
		audio.play();
	}
	else{
		tlog("skipping audio as per user settings");
		tlog("ANTHILL_AUDIO is "+ANTHILL_AUDIO);
	}
}
function playMusic (){
	if (ANTHILL_MUSIC == "ON"){
		console.log("playing audio "+ANTHILL_SONG);
		SONG = new Audio(ANTHILL_SONG);
		SONG.loop = true;
		SONG.play();
	}
}
function stopMusic (){
	if (SONG){
		SONG.pause();
	}
}
function setMusicON(){
	//change localstore variable
	localStorage.setItem("ANTHILL_MUSIC", "ON");
	ANTHILL_MUSIC = "ON";
}
function setMusicOFF(){
	//change localstore variable
	localStorage.setItem("ANTHILL_MUSIC", "OFF");
	ANTHILL_MUSIC = "OFF";
}
function setSoundON(){
	//change localstore variable
	localStorage.setItem("ANTHILL_AUDIO", "ON");
	ANTHILL_AUDIO = "ON";
}
function setSoundOFF(){
	//change localstore variable
	localStorage.setItem("ANTHILL_AUDIO", "OFF");
	ANTHILL_AUDIO = "OFF";
}
function setMusic(){
	ANTHILL_MUSIC = localStorage.getItem("ANTHILL_MUSIC");
	if ( ANTHILL_MUSIC == "ON" ){
		$("#musicIcon").css('background-image','url("common/images/sound_icons/musicOn.png")');
	}
	else{
		$("#musicIcon").css('background-image','url("common/images/sound_icons/musicOff.png")');
	}
}
function setSound(){
	ANTHILL_AUDIO = localStorage.getItem("ANTHILL_AUDIO");
	if ( ANTHILL_AUDIO == "ON" ){
		$("#soundIcon").css('background-image','url("common/images/sound_icons/loudspeakerOn.png")');
	}
	else{
		$("#soundIcon").css('background-image','url("common/images/sound_icons/loudspeakerOff.png")');
	}
}
function toggleMusic(){
	
	tlog("toggling music");
	ANTHILL_MUSIC = localStorage.getItem("ANTHILL_MUSIC");
	
	if ( ANTHILL_MUSIC == "ON" ){
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
	ANTHILL_AUDIO = localStorage.getItem("ANTHILL_AUDIO");
	if ( ANTHILL_AUDIO == "ON" ){
		setSoundOFF();
		$("#soundIcon").css('background-image','url("common/images/sound_icons/loudspeakerOff.png")');
	}
	else{
		setSoundON();
		$("#soundIcon").css('background-image','url("common/images/sound_icons/loudspeakerOn.png")');
	}
}



function tlog(data , scope){

	if( scope === undefined || LOGGINGSCOPE.includes(scope) ){
		if (typeof data === 'string' || data instanceof String){
			console.log(arguments.callee.caller.name + ":---> " + data);
		}
		else{
			console.log(arguments.callee.caller.name + ":---> ");
			console.log(data);
		}
	}
}


