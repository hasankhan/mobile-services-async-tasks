var path = require('path'),
    request = require('request'),
    env = process.env;

exports.init = function() {
    var taskConfig = require('./config.json'),
        appName = env.ApplicationName,
        tasks = Object.keys(taskConfig),
        url = 'http://' + appName + '.azure-mobile.net/api/';       
    
    tasks.forEach(function(taskName){
        var task = taskConfig[taskName],
            api = task.api.name,
            rawBody = task.api.rawBody,
            outputs = task.output;

        var outputAdapters = { };
        outputs.forEach(function (output) {
            var outputName = output.adapter;
            
            console.log('loading output adapter ' + outputName + ' for task ' + taskName);
            
            var outputAdapter = {
                name: outputName,
                adapter: require('./adapters/' + outputName + 'Adapter.js'),
                options: output.options,
                rawBody: output.rawBody
            };
            outputAdapters[outputName.toLowerCase()] = outputAdapter;
            
            console.log('loaded output adapter ' + outputName + ' for task ' + taskName);
        });

        var inputName = task.input.adapter;
        var inputOptions = task.input.options;
        
        console.log('loading input adapter ' + inputName + ' for task ' + taskName);
        
        var inputAdapter = require('./adapters/' + inputName + 'Adapter.js');
        
        console.log('loaded input adapter ' + inputName + ' for task ' + taskName);
        
        var target = api.substring(0, 7) == 'http://' ? api : url + api;

        inputAdapter.register(taskName, inputOptions, function (inputData) {
            console.log(JSON.stringify(inputData));
            request.post({
                url: target,
                headers: {
                    'content-type': 'application/json',
                    'x-zumo-master': env.ApplicationMasterKey
                },
                body: JSON.stringify(inputData)
            }, function (err, res, body) {
                console.log(body);
                if (err) {
                    console.error(err.toString());
                    return;
                }
                
                if (rawBody) {
                    for (var item in outputAdapters) {
                        var output = outputAdapters[item];
                        if (rawBody) {
                            output.adapter.sendOutput(taskName, output.options, res.statusCode, body);
                        }
                    }
                }
                else {
                    var result = JSON.parse(body);
                    Object.keys(result).forEach(function (output) {
                        var outputAdapter = outputAdapters[output.toLowerCase()];
                        if (outputAdapter) {
                            var outputData = result[output];
                            outputAdapter.adapter.sendOutput(taskName, outputAdapter.options, res.statusCode, outputData);
                        }
                    });
                }
            });            
        });
    });
}