var Node = module.exports = function(id, browser) {
  this.id      = id;
  this.browser = browser;
};

Node.prototype.get = function(name, callback) {
  this.invoke("attribute", name, function(error, value) {
    if (error) {
      return callback.call(this, error);
    }

    if (name == "checked" || name == "disabled") {
      value = (value == "true");
    }

    callback.call(this, undefined, value);
  });
};

Node.prototype.set = function(value, callback) {
  this.invoke("set", value, callback);
};

Node.prototype.tagName = function(callback) {
  this.invoke("tagName", callback);
};

Node.prototype.text = function(callback) {
  this.invoke("text", function(error, text) {
    if (error) {
      return callback.call(this, error);
    }

    text = text.replace(/[ ]+/g, " ").trim();

    callback.call(this, undefined, text);
  });
};

Node.prototype.value = function(callback) {
  this.invoke("value", callback);
};

Node.prototype.invoke = function() {
  var options = Array.prototype.slice.call(arguments),
      name    = options.shift();

  options.unshift(this.id);
  options.unshift(name);
  options.unshift("Node");

  this.browser.command.apply(this.browser, options);
};
