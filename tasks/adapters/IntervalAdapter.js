exports.register = function(task, options, callback) {
    /// <summary>
    /// Register this adapter as an input to the pipeline. The adapter starts
    /// listening to events, and it will call the callback function whenever
    /// a new input.
    /// </summary>
    /// <param name="task" type="String">Name of the task.</param>
    /// <param name="options" type="Number">The options is a single
    ///     numeric value, which is the interval between the callback invocations.</param>
    /// <param name="callback" type="Function">A function which is called whenever
    ///     a new event arrives for this input. The function has one single parameter,
    ///     an object.</param>
    var interval = options * 1000;
    var func = function() {
        callback({ message: 'Ping!' });
        setTimeout(func, interval);
    };
    setTimeout(func, interval);
}
