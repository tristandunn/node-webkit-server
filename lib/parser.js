var Events    = require("events"),
    Utilities = require("util");

var STATE_WAITING      = 0,
    STATE_LENGTH       = 1,
    STATE_RESPONSE     = 2,
    STATE_ERROR_LENGTH = 3,
    STATE_ERROR        = 4;

var Parser = function() {
  this.reset();

  Events.EventEmitter.call(this);
};

Utilities.inherits(Parser, Events.EventEmitter);

Parser.prototype.reset = function() {
  this.state          = STATE_WAITING;
  this.response       = null;
  this.bytes_received = 0;
};

Parser.prototype.execute = function(incoming) {
  var position = 0;

  while (position < incoming.length) {
    switch (this.state) {
      case STATE_WAITING:
        if (incoming.toString("utf8", 0, 2) == "ok") {
          position += 3;

          this.state = STATE_LENGTH;
        } else if (incoming.toString("utf8", 0, 7) == "failure") {
          position += 8;

          this.state = STATE_ERROR_LENGTH;
        }
      break;

      case STATE_LENGTH:
      case STATE_ERROR_LENGTH:
        var length    = "",
            character = null;

        while ((character = incoming.toString("utf8", position, ++position)) !== "\n") {
          length += character;
        }

        this.state    = (this.state == STATE_LENGTH ? STATE_RESPONSE : STATE_ERROR);
        this.response = new Buffer(parseInt(length, 10));

      case STATE_ERROR:
      case STATE_RESPONSE:
        var remaining = Math.min(this.response.length - this.bytes_received, incoming.length - position);

        incoming.copy(this.response, this.bytes_received, position, position + remaining);

        position            += remaining;
        this.bytes_received += remaining;

        if (this.bytes_received === this.response.length) {
          if (this.state == STATE_RESPONSE) {
            this.emit("response", undefined, this.response.toString("utf8"));
          } else {
            this.emit("response", new Error(this.response.toString("utf8")));
          }
          this.reset();
        }
      break;
    }
  }
};

module.exports = Parser;
