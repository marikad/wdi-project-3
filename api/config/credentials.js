module.exports = [
  {
    name: "github",
    client_id: process.env.GITHUB_CLIENT_ID,
    client_secret: process.env.GITHUB_CLIENT_SECRET,
    grant_url: "https://github.com/login/oauth/access_token",
    domain: "http://localhost:8000/"
  }
]