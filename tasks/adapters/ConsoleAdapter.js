exports.sendOutput = function(task, options, statusCode, body) {
    /// <summary>
    /// Sends an output via this adapter. Called by the pipeline after an async
    /// task is executed, if the task returned any data for this adapter.
    /// </summary>
    /// <param name="task" type="String">Name of the task.</param>
    /// <param name="options" type="String">Prefix for all console messages</param>
    /// <param name="statusCode" type="Number">The HTTP status code returned by
    ///     the asynchronous task.</param>
    /// <param name="body" type="Number">The object for this adapter returned by
    ///     the asynchronous task.</param>

	var prefix = options || "";
	var message = task + ': ' + prefix + JSON.stringify(body);
	console.log(message);
}