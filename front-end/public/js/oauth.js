$(bindEvents);

function bindEvents() {
  $(".btn-github").on('click', authenticate);
}

function authenticate() {
  event.preventDefault();
  console.log("HERE")
  hello("github").login({ scope: "email" });
}

hello.on('auth.login', function(auth) {
  hello(auth.network).api('/me').then(function(data) {
    data.access_token = hello("github").getAuthResponse().access_token;

    hello("github").api("/user/emails").then(function(emailData){
      data.emails = emailData.data;
      ajaxRequest("post", "http://localhost:3000/api/github", data, authenticationSuccessful);
    })
  })
})

hello.init({
  github: "da316a60cbe6559cf40b"
}, {
  redirect_uri: "http://localhost:8000/",
  oauth_proxy: "http://localhost:3000/proxy"
})

