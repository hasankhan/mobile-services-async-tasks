exports.register = function (task, options, callback) {
    /// <summary>
    /// Register this adapter as an input to the pipeline. The adapter starts
    /// listening to events, and it will call the callback function whenever
    /// a new input.
    /// </summary>
    /// <param name="task" type="String">Name of the task.</param>
    /// <param name="options" type="Object">An object with memebers: toTrack, consumerKey, consumerSecret, accessTokenKey and accessTokenSecret</param>
    /// <param name="callback" type="Function">A function which is called whenever
    ///     a new event arrives for this input. The function has one single parameter,
    ///     an object.</param>

    var toTrack = options.toTrack,
		consumerkey = options.consumerkey,
		consumersecret = options.consumersecret,
		accesstokenkey = options.accesstokenkey,
		accesstokensecret = options.accesstokensecret;

    if (!validateNotNull('toTrack', toTrack)
        || !validateNotNull('consumerkey', consumerkey)
        || !validateNotNull('consumersecret', consumersecret)
        || !validateNotNull('accesstokenkey', accesstokenkey)
        || !validateNotNull('accesstokensecret', accesstokensecret)
        ) {
        return;
    }

    var util = require('util'),
        Twit = require('twit');

    twit = new Twit({
        consumer_key: consumerkey,
        consumer_secret: consumersecret,
        access_token: accesstokenkey,
        access_token_secret: accesstokensecret
    });

    var stream = twit.stream('statuses/filter', { track: toTrack });

    stream.on('tweet', function (tweet) {
        callback({ text: tweet.text });
    })
}

function validateNotNull(name, value) {
    if (!value) {
        console.log('Error: required parameter "' + name + '" not found.');
        return false;
    } else {
        return true;
    }
}