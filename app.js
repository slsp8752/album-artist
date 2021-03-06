/**
 * This is an example of a basic node.js script that performs
 * the Authorization Code oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
 */

var express = require('express'); // Express web server framework
var request = require('request'); // "Request" library
var cors = require('cors');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');


const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirect_uri = process.env.REDIRECT;

var refresh_token;
var access_token;

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var stateKey = 'spotify_auth_state';

var app = express();

app.use(express.static(__dirname + '/public'))
   .use(cors())
   .use(cookieParser());

app.get('/login', function(req, res) {

  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  var scope = 'user-read-private user-read-email user-read-currently-playing';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state,
      show_dialog: 'true'
    }));
});

app.get('/callback', function(req, res) {

  // your application requests refresh and access tokens
  // after checking the state parameter

  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {

            access_token = body.access_token;
            refresh_token = body.refresh_token;

        // var options = {
        //   url: 'https://api.spotify.com/v1/me',
        //   headers: { 'Authorization': 'Bearer ' + access_token },
        //   json: true
        // };
        //
        // // use the access token to access the Spotify Web API
        // request.get(options, function(error, response, body) {
        //   console.log(body);
        // });

        // we can also pass the token to the browser to make requests from there
        res.redirect('/app');
      } else {
        res.redirect('/app#' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });
  }
});

app.get('/app', function(req, res){
  res.sendFile(__dirname + '/public/app.html');
});

app.get('/track_info', function(req, res){
  // console.log("GOT REQUEST");
  // console.log(access_token);
  var options = {
    url: 'https://api.spotify.com/v1/me/player/currently-playing',
    headers: {'Authorization': 'Bearer ' + access_token},
    data: {'additional_types': 'episode'},
    json: true
  };

  request.get(options, function(error, response, body){
    // console.log(error);
    // console.log(response);
    // console.log(response.statusCode);
    console.log(response);
    console.log(body);
    if(!error && response.statusCode == 200){
      console.log(response);
      console.log(body);
      console.log(body.actions.disallows)
      if(body.item.type == 'episode'){
        var artist = body.item.show.name;
        var album = body.item.show.publisher;
        var art = body.item.images[0].url;
      }
      else{
        var artist = body.item.artists[0].name;
        var album = body.item.album.name;
        var art = body.item.album.images[0].url;
      }
      // console.log(album);
      // console.log(artist);
      res.send({
        'valid': true,
        'track': body.item.name,
        'artist': artist,
        'album': album,
        'art': art,
        'is_playing': body.is_playing,
        'duration': body.item.duration_ms,
        'progress': body.progress_ms
      })
    }
    else{
      res.send({
        'valid': false
      })
    }
  });
});

app.get('/refresh_token', function(req, res) {

  // requesting access token from refresh token
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      access_token = body.access_token;
    }
  });
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8888;
}
// console.log(port);
app.listen(port);
