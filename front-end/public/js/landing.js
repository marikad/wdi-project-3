$(start);

function start(){
	$("form").on("submit", submitForm);
	$("landing-link").on("click", splashView);
	$(".logout-link").on("click", logout);

	$(".login-link").on("click", function(){
		event.preventDefault();
		$("#splash").hide();
		$("#login-register").show();
	});

	splashView();
	checkLoginState();
};

function splashView(){
	$("section").hide();
	$("#splash").show();
};

function checkLoginState(){
	if (getToken()){
		$(".login-link").hide();
		$(".logout-link").show();
		return console.log('User logged in!');
	} else {
		$(".login-link").show();
		$(".logout-link").hide();
		return console.log('User logged out');
	};
};

function logout() {
  event.preventDefault();
	$(".alert-success").text('Logged out successfully').removeClass("hide").addClass("show");
  removeToken();
  return checkLoginState();
};

function removeToken() {
  return localStorage.clear();
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
	if (data.token) {
		setToken(data.token);
		$(".alert-success").text(data.message).removeClass("hide").addClass("show");
		splashView();
	}
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
	return $(".alert-danger").text(data).removeClass("hide").addClass("show");
};
