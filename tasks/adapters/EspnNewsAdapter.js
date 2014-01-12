exports.register = function(task, options, callback) {
    /// <summary>
    /// Register this adapter as an input to the pipeline. The adapter starts
    /// listening to events, and it will call the callback function whenever
    /// a new input.
    /// </summary>
	/// <param name="task" type="String">Name of the task.</param>
    /// <param name="options" type="String">The options is a single
    ///     string value, which is the API key from the ESPN developer network.</param>
    /// <param name="callback" type="Function">A function which is called whenever
    ///     a new event arrives for this input. The function has one single parameter,
    ///     an object. The output will be an object with three properties: 'title',
    ///     'description' and 'link'.</param>
    var request = require('request');
    var lastNews = null;
    var apiKey = options;
    var url = 'http://api.espn.com/v1/now?apikey=' + apiKey;
    var makeRequest = function() {
        request(url, function(err, resp, body) {
            if (err) {
                console.log('Error getting ESPN data: ', err);
            } else {
                try {
                    var feed = JSON.parse(body).feed.filter(function(obj) { return obj.type === 'BlogEntry' });
                    var latest = feed[0];
                    if (latest.title === lastNews) {
                        console.log('No news');
                        // same as before, keep waiting...
                    } else {
                        lastNews = latest.title;
                        var news = {
                            title: latest.title,
                            description: latest.description,
                            link: latest.links.web
                        };
                        console.log('New data: ', news);
                        callback(news);
                    }
                } catch (ex) {
                    console.log('Error parsing body: ', ex);
                }
            }
            
            setTimeout(makeRequest, 10000);
        });
    };
    
    makeRequest();
}
