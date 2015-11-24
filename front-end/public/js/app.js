$(start);

function start(){

	$("form").on("submit", submitForm)
	$("section").hide();
	$("#splash").show();

	$(".login-link").on("click", function(){
		$("#splash").hide();
		$("#login-register").show();
		$("#login").show();
	});

	$(".login-tab").on("click", function(){
		$("#login").show();
		$("#register").hide();
	});

	$(".register-tab").on("click", function(){
		$("#login").hide();
		$("#register").show();
	});

	$("landing-link").on("click", function(){
		$("section").hide();
		$("#splash").show();
	});
};

function checkLoginState(){
	if (getToken()){
		return console.log('User logged in!');
	} else {
		return console.log('User logged out');
	};
};

function getToken(){
	return localStorage.getItem("token");
};

function setToken(token){
	return localStorage.setItem("token", token);
};

function submitForm(){
	event.preventDefault();
	var method = $(this).attr("method");
	var url = "http://localhost:3000/api" + $(this).attr("action");
	var data = $(this).serialize();
	return ajaxRequest(method, url, data, authenticationSuccessful);
};

function authenticationSuccessful(data){
	if(data.token) setToken(data.token);
	return checkLoginState();
};

function ajaxRequest(method, url, data, callback){
	return $.ajax({
		method: method,
		url: url,
		data: data,
		beforeSend: setRequestHeader,
	}).done(function(data) {
		if(callback) return callback(data);
	}).fail(function(data){
		displayErrors(data.responseJSON.message);
	});
};

function setRequestHeader(xhr, settings){
	var token = getToken();
	if(token) return xhr.setRequestHeader("Authorization", "Bearer " + token);
};

function displayErrors(data){
	return $(".alert").text(data).removeClass("hide").addClass("show");
};