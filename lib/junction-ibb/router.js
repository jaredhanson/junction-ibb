var Route = require('./route');

function Router() {
  var self = this;
  this._routes = {};

  this.middleware = function(req, res, next) {
    self._dispatch(req, res, next);
  };
}

Router.prototype._dispatch = function(req, res, next) {
  var self = this;
  
  (function pass(i) {
    var route = self._match(req, i);
    if (!route) { return next(); }
    
    var idx = 0;
    
    function nextRoute() {
      pass(i + 1);
    }
    
    function middleware(err) {
      var fn = route.middleware[idx++];
      if ('route' == err) {
        nextRoute();
      } else if (err) {
        next(err);
      } else if (fn) {
        fn(req, res, middleware);
      } else {
        done();
      }
    };
    
    function done() {
      route.callback.call(self, req, res, function(err) {
        if (err) { return next(err); }
        pass(i + 1);
      });
    }
    
    middleware();
  })(0);
}

Router.prototype._match = function(req, i) {
  var command = req.command;
  var routes;
  
  if (routes = this._routes[command]) {
    for (var len = routes.length; i < len; i++) {
      return routes[i];
    }
  }
  return null;
}

Router.prototype._route = function(command, fn) {
  var middleware = [];

  // slice middleware
  // @todo: Implement this
  /*
  if (arguments.length > 3) {
    middleware = toArray(arguments, 2);
    fn = middleware.pop();
    middleware = utils.flatten(middleware);
  }
  */

  // ensure path and callback are given
  // @todo: Implement this
  /*
  if (!path) throw new Error(action + 'route requires a path');
  if (!fn) throw new Error(action + ' route ' + path + ' requires a callback');
  */
  
  var route = new Route(command, fn, {
    middleware: middleware
  });

  (this._routes[command] = this._routes[command] || [])
    .push(route);
  return this;
};


module.exports = Router;
