AsyncTasks
==========

Extension for Azure Mobile Services for running asynchronous tasks in the background that are triggered by external events. This enables you to automatically run your custom API whenever a new item is added to Azure queue or a tweet is posted on twitter, etc. AsyncTasks framework is based on startup scripts preview feature of Azure Mobile Service.

Getting Started
===============
* Enable source control on your Mobile Service.
* git clone your repository
* Navigate to service folder
* Copy the tasks folder from AsyncTasks to your service folder
* Copy the startup.js from AsyncTasks\extensions to your service\extensions folder
* git commit and push your changes
* Hit one of the endpoints on your Mobile Service
* Your first startup task is loaded

Configuration
=============

AsyncTasks framework is loaded via startup.js file in your extensions directory. If you already have custom code in startup.js then you can copy the lines of code inside startup.js to your file at the appropriate place in the script.

Startup tasks are configured using the config.json file inside tasks folder. Let's look at a sample config file

<pre>
  {
      "timerTask": {
                  "api": {
                          "name": "tick",
                          "rawBody": true
                  },
                  "input": {
                          "adapter": "Interval",
                          "options": 900
                  },
                  "output": [
                          {
                                  "adapter": "console",
                                  "options": null
                          }
                  ]
          }
  }
</pre>

Here we are defining a startup task called "timerTask". You can have as many tasks as you want and name them accordingly. Each task has 3 configuration settings that are as follows:

* api: This is the custom api that would be invoked with the task
* input: This is the input adapter which will monitor for external events and on each occurance of event, it will run your custom api.
* output: This is the output adapter which will receive the result of your custom api call.

By chaining multiple tasks together, you can build a complex pipeline that executes a workflow.

Input adapters
==============
You can write your own input adapters but following are available with the framework.

* AzureQueueAdapter: Monitor Azure queue for input.
* EspnNewsAdapter: Monitor news on ESPN.
* IntervalAdapter: Invoke your API on regular interval.
* TwitterFeedAdapter: Monitor twitter stream for keywords.

Output adpters
==============
You can write your own output adapters but following are available with the framework.
* AzureQueueAdapter: Write result to azure queue.
* ConsoleAdapter: Write result to log.
* SendGridAdapter: Send result as an email.
* TwilioAdapter: Send result as a sms.
