exports.sendOutput = function(task, options, statusCode, body) {
    /// <summary>
    /// Sends an output via this adapter. Called by the pipeline after an async
    /// task is executed, if the task returned any data for this adapter.
    /// </summary>
    /// <param name="task" type="String">Name of the task.</param>
    /// <param name="options" type="Object">An object containing four members: 'SID', 'token',
    ///     'from' and 'to'.</param>
    /// <param name="statusCode" type="Number">The HTTP status code returned by
    ///     the asynchronous task.</param>
    /// <param name="body" type="Object">The object for this adapter returned by
    ///     the asynchronous task. For this adapter it requires the object to
    ///     have a property called 'message' with the message which will be sent
    ///     via SMS.</param>
    if (statusCode >= 400) {
        console.log('Bad response, not running anything');
        return;
    }
    
    var sid = options.sid,
		token = options.token,
		from = options.from,
		to = options.to;

    if (!validateNotNull('SID', sid) ||
        !validateNotNull('token', token) ||
        !validateNotNull('from', from) ||
        !validateNotNull('to', to)) {
        return;
    }

    var message = body.message;
    if (!message) {
        console.log('Async task should return an object with a "message" property.');
        return;
    }

    var twilio = require('twilio')(sid, token);
    twilio.sendSms({
        body: message,
        from: from,
        to: to
    }, function(err, sms) {
        if (err) {
            console.log('Error sending SMS: ', err);
        } else {
            console.log('Sent SMS successfully: ', sms.sid);
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