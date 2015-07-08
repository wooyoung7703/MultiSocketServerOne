/**
 * New node file
 */

var winston = require('winston');
//
//Logging levels
//
var config = {
	levels: {
		 silly: 0,
		 verbose: 1,
		 info: 2,
		 data: 3,
		 warn: 4,
		 debug: 5,
		 error: 6
	},
	colors: {
		 silly: 'magenta',
		 verbose: 'cyan',
		 info: 'green',
		 data: 'grey',
		 warn: 'yellow',
		 debug: 'blue',
		 error: 'red'
	}
};
module.exports = function(filename) {
  var logger = new winston.Logger({
    transports: [
      new winston.transports.Console({
        level      : config.loglevel
      }),
      new winston.transports.File({
        level      : config.loglevel,
        json       : false,
        filename   : filename
      })
    ]
  });

  logger.setLevels(winston.config.syslog.levels);
  logger.exitOnError = false;

  return logger;
};
