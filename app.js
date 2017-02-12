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
  consumer_key:         'xfCRfA8jHLxw8YTyTFfCQDJSI',
  consumer_secret:      'QCO163pPZbLsSdvUsyykRlmTcPF2eVlrdR77eCnMSZsCyMrhS7',
  access_token:         '632529421-8BpmggszmMYpUUhSfcBAPP5LkI3j6nrwz66uGeMw',
  access_token_secret:  'F1RYzl5SGQeF9AnadDuwBn7lyVkc6lkIp4nRxX6UwGyJS',
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
})

var frostyconStream = T.stream('statuses/filter', { track: '#frostycon'});
var frostycongamesStream = T.stream('statuses/filter', { track: '#frostycongames'});
frostyconStream.on('tweet', function(tweet) {
    var hashtags = tweet.entities.hashtags;
    console.log(tweet.user.name + ": " + tweet.text);
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

    console.log("current game cache: ", hashtagCache);
})
frostycongamesStream.on('tweet', function(tweet) {
    console.log(tweet.user.name + ": " + tweet.text);
    tweet.entities.hashtags.forEach(function(hashtagObj) {
        if (hashtagObj.text === "frostycongames") {
            var games = [];
            for (var property in hashtagCache) {
                if (hashtagCache.hasOwnProperty(property)) {
                    games.push(property);
                }
            }

            var gamesText = games.join(", ");
            _sendTweet('@' + tweet.user.screen_name + ": Games currently being played: " + gamesText);
        }
    });

    console.log("current game cache: ", hashtagCache);
});

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
	    if (err) {
            console.log("Status post error", err);
        }
	})
}
