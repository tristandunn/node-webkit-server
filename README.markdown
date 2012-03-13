# node-webkit-server

A node.js driver for [webkit-server](https://github.com/tristandunn/webkit-server).

## Example

```javascript
var WebKit = require("webkit-server");

new WebKit.Browser(function() {
  this.visit("http://www.timeapi.org/utc/now", function(error) {
    this.source(function(error, source) {
      console.info("The time is:", source);

      this.stop();
    });
  });
});
```

## License

node-webkit-server uses the MIT license. See LICENSE for more details.
