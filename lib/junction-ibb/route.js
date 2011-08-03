function Route(command, fn, options) {
  options = options || {};
  this.command = command;
  this.callback = fn;
  this.middleware = options.middleware;
}


module.exports = Route;
