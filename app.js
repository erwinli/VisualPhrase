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
var users = [];
var hashtagList = [];
var count = 0;

stream.on('tweet', function (tweet) {
	_storeUserAndHashtags(tweet.user.screen_name, tweet.entities.hashtags);
    var hashtags = tweet.entities.hashtags;
    console.log(hashtags);
    _sendTweet('asdf');
})

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
  console.log('asdf');
});

function _sendTweet(status)
{
  	if(typeof status !== 'string') {
    	return callback(new Error('tweet must be of type String'));
  	} else if(status.length > 140) {
    	return callback(new Error('tweet is too long: ' + status.length));
  	}
	T.post('statuses/update', { status: "Swogity Swittles, I'm coming for dem Skittles!" }, function(err, data, response) {
	  console.log(data)
	})
}

function _storeUserAndHashtags(screenname, hashtags)
{
	users.push(screenname);
	hashtagList.push(hashtags);
	count++;
}

function _findGetUsersWithHashtag(hashtag)
{
	for(var i = 0; i < count; i++){
    	console.log(hashtagList[0]);    
  	}
}