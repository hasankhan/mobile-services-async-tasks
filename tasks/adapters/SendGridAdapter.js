exports.sendOutput = function(task, options, statusCode, body) {
    /// <summary>
    /// Sends an output via this adapter. Called by the pipeline after an async
    /// task is executed, if the task returned any data for this adapter.
    /// </summary>
    /// <param name="task" type="String">Name of the task.</param>
    /// <param name="options" type="Object">An object with the following members:
    ///     'user', 'account', 'key' (all strings) and 'to' (either a string or
    ///     an array of strings).</param>
    /// <param name="statusCode" type="Number">The HTTP status code returned by
    ///     the asynchronous task.</param>
    /// <param name="body" type="Object">The object for this adapter returned by
    ///     the asynchronous task. For this adapter it requires the object to
    ///     have a property called 'message' with the message which will be sent
    ///     via e-mail.</param>
    if (statusCode >= 400) {
        console.log('Bad response, not running anything');
        return;
    }
    
    var account = options.user,
		key = options.key,
		from = options.from,
		to = options.to;
    if (typeof to === 'string') {
        // Normalize as an array
        to = [to];
    }

    validateNotNull('user', account);
    validateNotNull('key', key);
    validateNotNull('from', from);
    validateNotNull('to', to);

    var message = body.message;

    var SendGrid = require('sendgrid').SendGrid;
    var sendGrid = new SendGrid(account, key);
    to.forEach(function(recipient) {
        sendGrid.send({
            to: recipient,
            from: from,
            subject: 'Message from the adapter',
            text: message
        }, function(err, json) {
            if (err) {
                console.log('Error sending e-mail: ', err);
                console.log('Error sending e-mail (2): ', JSON.stringify(err));
            } else {
                console.log('Email sent: ', json);
            }
        });
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
