$(start);

function start() {
  $(".hide-menu-link").on("click", function() {
    event.preventDefault();
    $("#wrapper").toggleClass("toggled");
  });

  $(".logout-menu-link").on("click", logout);
  $("form").on("submit", submitForm);
  $('#filter-form :checkbox').on('click', filterPins);

  checkLoginState();
};

function filterPins() {
  var category = $(this).context.value;

  var ischecked= $(this).is(':checked');
  if(ischecked) {
    for (var i = 0; i < markers.length; i++) {
      if (markers[i].category == category) {
        markers[i].setMap(map);
      };
    };
  };
  if(!ischecked) {
    for (var i = 0; i < markers.length; i++) {
      if (markers[i].category == category) {
        markers[i].setMap(null);
      };
    };
  };
};

function checkLoginState(){
	if (getToken()){
		$(".login-menu-link").hide();
		$(".logout-menu-link").show();
    $(".add-event-link").show();
		return console.log('User logged in!');
	} else {
		$(".login-menu-link").show();
		$(".logout-menu-link").hide();
		$(".add-event-link").hide();
		return console.log('User logged out');
	};
};

function logout() {
  event.preventDefault();
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

  if ($(this).attr('class') == 'login' || $(this).attr('class') == 'register') {
  	var method = $(this).attr("method");
  	var url = "http://localhost:3000/api" + $(this).attr("action");
  	var data = $(this).serialize();
  	return ajaxRequest(method, url, data, authenticationSuccessful);
  };
};

function authenticationSuccessful(data){
	if (data.token) {
		setToken(data.token);
		$(".alert-success").text(data.message).removeClass("hide").addClass("show");
	};
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
