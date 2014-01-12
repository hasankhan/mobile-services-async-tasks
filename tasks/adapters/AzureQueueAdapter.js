var azure = require('azure');

exports.sendOutput = function(task, options, statusCode, body) {
    /// <summary>
    /// Sends an output via this adapter. Called by the pipeline after an async
    /// task is executed, if the task returned any data for this adapter.
    /// </summary>
    /// <param name="task" type="String">Name of the task.</param>
    /// <param name="options" type="Object">An object with memebers: accountName, accountKey and queueName.</param>
    /// <param name="statusCode" type="Number">The HTTP status code returned by
    ///     the asynchronous task.</param>
    /// <param name="body" type="Number">The object for this adapter returned by
    ///     the asynchronous task.</param>

    console.log(options);

    var accountName = options.accountName,
		accountKey = parsedOptions.accountKey,
		queueName = parsedOptions.queueName;

    if (!validateNotNull('accountName', accountName) ||
        !validateNotNull('accountKey', accountKey) ||
        !validateNotNull('queueName', queueName)) {
        return;
    }

    var message = body.message;
    if (!message) {
        console.log('Async task should return an object with a "message" property.');
        return;
    }
    
    console.log('AccountName: ', accountName);
    console.log('AccountKey: ', accountKey);
    console.log('QueueName: ', queueName);    

    var queueService = azure.createQueueService("azureathonqueue", "07xAIl4LZCybpOc2DLZuBvm6GlHt6Q3aQUrr7049+63nSAjJNj4OUhqbYyGIiIRU9Ty73MFwlqb+wwf/M83hmQ==");

    queueService.createQueueIfNotExists(queueName, function(error){
      if(!error){
        // Queue exists
      }
    });

    console.log("Creating a message");
    queueService.createMessage(queueName, message, function(error){
      if(!error){
        // Message inserted
        console.log("Created a message");
      }
      else {
        console.log("Error: " + error);
      }
    });

	
}


function validateNotNull(name, value) {
    if (!value) {
        console.log('Error: required parameter "' + name + '" not found.');
        return false;
    } else {
        return true;
    }
}

function parseOptions(options) {
    var result = {};
    var parts = options.split('&');
    parts.forEach(function(part) {
        var equalsIndex = part.indexOf('=');
        if (equalsIndex < 0) {
            // todo: handle this error code
        } else {
            var name = part.substr(0, equalsIndex);
            var value = part.substr(equalsIndex + 1);
            result[name] = value;
	        }
    });
    return result;
}

exports.register = function(task, options, callback) {
    /// <summary>
    /// Register this adapter as an input to the pipeline. The adapter starts
    /// listening to events, and it will call the callback function whenever
    /// a new input.
    /// </summary>
	/// <param name="task" type="String">Name of the task.</param>
    /// <param name="options" type="String">The options needed to configure this
    ///     adapter, passed by the pipeline.</param>
    /// <param name="callback" type="Function">A function which is called whenever
    ///     a new event arrives for this input. The function has one single parameter,
    ///     an object.</param>

    console.log(options);

    var parsedOptions = parseOptions(options);
    var accountName = parsedOptions.AccountName || parsedOptions.accountName;
    var accountKey = parsedOptions.AccountKey || parsedOptions.accountKey;
    var queueName = parsedOptions.QueueName || parsedOptions.queueName;

    if (!validateNotNull(logger, 'accountName', accountName) ||
        !validateNotNull(logger, 'accountKey', accountKey) ||
        !validateNotNull(logger, 'queueName', queueName)) {
        return;
    }

    console.log('AccountName: ', accountName);
    console.log('AccountKey: ', accountKey);
    console.log('QueueName: ', queueName);    

    var queueService = azure.createQueueService(accountName, accountKey);

    queueService.createQueueIfNotExists(queueName, function(error){
      if(!error){
        // Queue exists
      }
    });
     
    var getMessageLoop = function(error, messages) {
        if(!error){
            if (messages && messages.length)
            {
                console.log("We have a new message!");
                var message = messages[0];
                queueService.deleteMessage(queueName
                    , message.messageid
                    , message.popreceipt
                    , function(error){
                        if(!error){
                        // Message deleted
                        }});
                console.log("Message is " + JSON.stringify(message));
                callback(JSON.parse(message.messagetext)); 
            }
        } else {
            console.log('Error in getting message from queue: ' + error.toString());
        }

        setTimeout(function() {
            console.log('Trying to get messages from queue');
            queueService.getMessages(queueName, getMessageLoop);
        }, 30000);
      }

      // try to read a message from azure queue
      queueService.getMessages(queueName, getMessageLoop);
}
