exports.startup = function(context, done) {
	var tasks = require('../tasks/init.js');
	tasks.init();
	done();
};