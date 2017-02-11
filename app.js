/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');
// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// Twitter API library
var Twit = require('twit')

// create a new express server
var app = express();

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

var T = new Twit({
  consumer_key:         'xfCRfA8jHLxw8YTyTFfCQDJSI',
  consumer_secret:      'QCO163pPZbLsSdvUsyykRlmTcPF2eVlrdR77eCnMSZsCyMrhS7',
  access_token:         '632529421-a8gqQ9bLM48rTfOdSe0PlBrCnpI14NIYNdAZUNsU',
  access_token_secret:  'yNJTpCBTteSlu67BgRumZFnSQ8Y7eJAZle5LbDVL9Wz0t',
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
})

var stream = T.stream('statuses/filter', { track: '#frostycon'})

stream.on('tweet', function (tweet) {
	console.log(tweet);
	//_storeUserAndHashtags(tweet.user.screen_name, tweet.entities.hashtags);
    //_sendTweet(tweet.entities.hashtags);
})

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
  console.log('asdf');
});


function _storeUserAndHashtags(screenname, hashtags)
{
	console.log('testa');
	userHashTag.screenname = hashtags;

	console.log(userHashTag);
}

function _sendTweet(tweetHashTags) 
{
	var userList = '';

	tweetHashTags.forEach(function(hashTag) {
		console.log(hashTag);
	});
}