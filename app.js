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
var hashtagCache = {};

var T = new Twit({
  consumer_key:         'NuCNdo6SiGuHJCSsIduRoUh7O',
  consumer_secret:      'EDaiyLqPDOZiZwIbl0ngyxMKDFbK2y7ITOHpwuWizLejcVl31z',
  access_token:         '830510599155036162-85YZk7rqcjq9YJBACyZ93cUrN1kizew',
  access_token_secret:  'eF5ox3papWLEnoSaKaCTY9myxwi3tE2l57guP69lXDoV1',
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
})

var stream = T.stream('statuses/filter', { track: '#frostycon'})

stream.on('tweet', function (tweet) {
    var hashtags = tweet.entities.hashtags;
    console.log(tweet.user.name + ": " + tweet.text);
    console.log(hashtagCache);
    hashtags.forEach(function(hashtagObj) {
    	var hashtag = hashtagObj.text.toLowerCase();
    	if (hashtag === "frostycon") {
    		return;
		}

    	if (hashtagCache[hashtag] === undefined) {
    		hashtagCache[hashtag] = [tweet.user.screen_name];
    		return;
		}

		var otherUsers = hashtagCache[hashtag].map(function addAtSymbol(user) {
			return "@" + user;
		});

    	// "@bob, @jim are playing overwatch"
    	var replyText = "@" + tweet.user.screen_name + ": " + otherUsers.join(", ") + " are playing " + hashtag;
		_sendTweet(replyText);

		hashtagCache[hashtag].push(tweet.user.screen_name);
	});
    if (hashtags.length == 1) {
        _sendTweet('@' + tweet.user.screen_name + " Swoggity Swiitles, I'm coming for dem Skittles");
    }
})

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});

function _sendTweet(status)
{
  	if(typeof status !== 'string') {
    	return callback(new Error('tweet must be of type String'));
  	} else if(status.length > 140) {
    	return callback(new Error('tweet is too long: ' + status.length));
  	}
  	console.log("Posting: " + status);
	T.post('statuses/update', { status: status }, function(err, data, response) {
	  console.log("Status post error", err, data);
	})
}
