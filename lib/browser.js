var ChildProcess = require("child_process"),
    Parser       = require("./parser"),
    Path         = require("path"),
    Socket       = require("net").Socket;

var WEBKIT_SERVER_BINARY = Path.join(
  __dirname, "..", "vendor", "webkit-server", "bin", "webkit_server"
);

var Browser = function(callback) {
  this.callbacks = [];

  this.parser = new Parser();
  this.parser.on("response", function(response) {
    this.callbacks.shift()(response);
  }.bind(this));

  this.start(function(port) {
    this.connect(port, callback.bind(this));
  }.bind(this));

  process.on("exit", this.stop.bind(this));
};

Browser.prototype.execute = function(code, callback) {
  this.command("Execute", code, callback);
};

Browser.prototype.source = function(callback) {
  this.command("Source", callback);
};

Browser.prototype.visit = function(path, callback) {
  this.command("Visit", path, callback);
};

Browser.prototype.command = function() {
  var options  = Array.prototype.slice.call(arguments),
      name     = options.shift(),
      callback = options.pop(),
      length   = options.length,
      commands = [name + "\n"];

  commands.push(length + "\n");

  for (var index = 0; index < length; index++) {
    var option = options[index].toString();

    commands.push(Buffer.byteLength(option) + "\n" + option);
  }

  this.callbacks.push(callback);
  this.socket.write(commands.join(""), "utf8");
};

Browser.prototype.connect = function(port, callback) {
  this.socket = new Socket();
  this.socket.on("connect", callback);
  this.socket.on("data", function(data) {
    this.parser.execute(data);
  }.bind(this));
  this.socket.on("error", function(error) {
    throw error;
  }.bind(this));
  this.socket.connect(port);
};

Browser.prototype.start = function(callback) {
  this.server = ChildProcess.spawn(WEBKIT_SERVER_BINARY);
  this.server.stdout.once("data", function(data) {
    var matches = data.toString().match(/port: (\d+)/);

    if (matches) {
      callback(parseInt(matches[1], 10));
    }
  });
};

Browser.prototype.stop = function(error) {
  this.socket && this.socket.end();
  this.server && this.server.kill("SIGHUP");
};

module.exports = Browser;
