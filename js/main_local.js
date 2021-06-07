var config = {}
var rangeslider;
var output;
var comments;
var index;
var controlQuest;
var i=0;
var answers = {id: [],
	       type: [], 
	       rate: []};
var startDate;
var endDate;


function toSurvey() {
 	location.replace("survey.html");
}

function toInstructions() {
	location.replace("index.html");
}


function loadIndex(){
    /*var parameters = location.search.substring(1).split("&");
    if (parameters != ""){
	var temp = parameters[0].split("=");
	document.getElementById("info").name = unescape(temp[0]);
	document.getElementById("info").value = unescape(temp[1]);
    }*/
	
    $.getJSON("config.json").done(function(data) {
	config = data;
    });

}


function add_controlQuestion(){
	var comment_id = document.getElementById("postid");
	var comment_type = document.getElementById("type");
	var comment_title = document.getElementById("title");
	var comment_text = document.getElementById("text");

	comment_id.value = comments.control_question.id;
	comment_type.value = controlQuest.type;

	var title = controlQuest.title;
	if (title==null){
		comment_title.textContent = '';
	} else {
		comment_title.textContent = title;
	}

	comment_text.textContent = comments.text;
}

function displayControlQuestion(){
	var data_file = "survey_test_control_question.json";
	$.getJSON(data_file).done(function(data) { 
	    comments = data;
	    controlQuest = comments.control_question;
	});
	add_controlQuestion();
}

function checkControlQuestion(){
	if ((document.getElementById('dontUnderstand').checked) & (document.querySelector('input[name="Options"]:checked') != null)){
		document.getElementById('dontUnderstand').checked = false;
		document.querySelector('input[name="Options"]:checked').checked = false;
	} else if ((document.getElementById('dontUnderstand').checked) | (document.querySelector('input[name="Options"]:checked') != null)) {
		if ((document.getElementById('dontUnderstand').checked) | (controlQuest.answer != document.querySelector('input[name="Options"]:checked').value)){
			location.href = "survey_end.html";
		} else {
			document.getElementById('control').classList.remove('button');
			document.getElementById('control').hidden = true;
			document.getElementById('next').classList.add('button');
			document.getElementById('next').hidden = false;
			displayInfo();
		}
	}
}

function add_comment(i){
	index = Object.keys(comments.postid);
	
	var comment_id = document.getElementById("postid");
	var comment_type = document.getElementById("type");
	var comment_title = document.getElementById("title");
	var comment_text = document.getElementById("text");

	comment_id.value = comments.postid[index[i]];
	comment_type.value = comments["type"][index[i]];

	var title = comments["title"][index[i]];
	if (title==null){
		comment_title.textContent = '';
	} else {
		comment_title.textContent = title;
	}

	comment_text.textContent = comments["text"][index[i]];
}

function displayInfo(){

	/*var parameters = location.search.substring(1).split("&");
	
	if (parameters != ""){
		var temp = parameters[0].split("=");
		var data_file = "survey_" + unescape(temp[1]) + ".json";
	} else {
		var data_file = "survey_test.json";
	}*/
	
	//var data_file = "survey_test.json";

	/*$.getJSON(data_file).done(function(data) { 
	    comments = data;
	    add_comment(i);
	});*/
	
	add_comment(i);
	
	var bar = document.getElementById("progress-bar");
	bar.style.width = (i+1)/31*100 +'%';
	
	startDate = new Date();
}

function nextQuestion(){
	if ((document.getElementById('dontUnderstand').checked) & (document.querySelector('input[name="Options"]:checked') != null)){
		document.getElementById('dontUnderstand').checked = false;
		document.querySelector('input[name="Options"]:checked').checked = false;
	} else if ((document.getElementById('dontUnderstand').checked) | (document.querySelector('input[name="Options"]:checked') != null)) {
		answers.id.push(document.getElementById('postid').value);
		answers.type.push(document.getElementById('type').value);
		if (document.getElementById('dontUnderstand').checked){
			answers.rate.push('NA');
			document.getElementById('dontUnderstand').checked = false;
		} else if (document.querySelector('input[name="Options"]:checked') != null) {
			answers.rate.push(document.querySelector('input[name="Options"]:checked').value);
			document.querySelector('input[name="Options"]:checked').checked = false;
		}
		/* test: i_max=2; reality: i_max=28 */
		if (i >= 28){
			document.getElementById('next').classList.remove('button');
			document.getElementById('next').hidden = true;
			document.getElementById('finish').classList.add('button');
			document.getElementById('finish').hidden = false;
		}

		i = i+1;
		add_comment(i);
		var bar = document.getElementById("progress-bar");
		bar.style.width = (i+1)/31*100 +'%';
	}
}

function endSurvey(){
	endDate = new Date();
	
	answers.id.push(document.getElementById('postid').value);
	answers.type.push(document.getElementById('type').value);
	if (document.getElementById('dontUnderstand').checked){
		answers.rate.push('NA');
	} else {
		answers.rate.push(document.querySelector('input[name="Options"]:checked').value);
	}
	
	sessionStorage.setItem("rates", JSON.stringify(answers));
	sessionStorage.setItem("surveyTime", (endDate - startDate)/1e3);
	
	/*var token = document.getElementById('recaptchaResponse').value;
	$.ajax({
		url: "captcha.php",
		type: "POST",
		data: {recaptcha_response:token},
		success: function(result){
			var captcha = JSON.parse(result);
			sessionStorage.setItem("score",captcha.score);
		},
		error: function(result,textStatus,errorThrown){
			console.log(result);
			console.log(textStatus);
			console.log(errorThrown);
		}
	});*/
	
	location.href = "survey_end.html";
}

function loadRates(){
	document.getElementById("rates").textContent = sessionStorage.getItem("rates");
	
	var surveyTime = sessionStorage.getItem("surveyTime");
	var hours = Math.floor((surveyTime)/3600);
	var minutes = Math.floor((surveyTime)%3600/60);
	var seconds = Math.floor((surveyTime)%60);

	document.getElementById("survey_time").textContent = hours.toString()+':'+minutes.toString()+':'+seconds.toString();
	
	document.getElementById("score").textContent = sessionStorage.getItem("score");
}


function showResults(){
	document.getElementById("lastQuestions").hidden = true;

	document.getElementById("gender").textContent = document.querySelector('input[name="gender"]:checked').value;
	document.getElementById("age").textContent = document.getElementsByName('age')[0].value;
	document.getElementById("politics").textContent = document.querySelector('input[name="politics"]:checked').value;

	document.getElementById("results").hidden = false;

}
