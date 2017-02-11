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
    console.log("test");
    console.log(tweet);
  _filterTweet(tweet.entities.hashtags);
})


// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});

function _filterTweet(tweetHashTags) 
{
    console.log("In filterTweet");
    JSON.stringify(tweetHashTags);
    console.log(tweetHashTags);
    var response = "";
    if(tweetHashTags.toLowerCase() == "overwatch") {
        response = "Swag";
    }

    switch(tweetHashTags.toLowerCase()) {
        case "overwatch":
            response = "You said overwatch";
            break;
        case "battlefield2" || "bf2":
            response = "You said bf2";
            break;
        default:
            response = "You're an idiot that said nothing";
    }

    console.log(tweetHashTags);
    console.log(response);
}

