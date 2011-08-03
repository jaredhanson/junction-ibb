var Client = require('./client');

exports.createConnection = function (options) {
  return new Client(options);
};
