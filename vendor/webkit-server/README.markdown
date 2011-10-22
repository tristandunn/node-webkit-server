# webkit-server

A standalone version of the WebKit server in [capybara-webkit](https://github.com/thoughtbot/capybara-webkit).

## Dependencies

webkit-server depends on a WebKit implementation from Qt, a cross-platform development toolkit. You'll need to download the Qt libraries to build the binary.

**OS X 10.7:**

    brew install qt

**OS X < 10.7:**

[Download the non-debug Cocoa package](http://qt.nokia.com/downloads/qt-for-open-source-cpp-development-on-mac-os-x).

**Ubuntu:**

    apt-get install libqt4-dev

**Fedora:**

    yum install qt-webkit-devel

**Gentoo Linux:**

    emerge x11-libs/qt-webkit

**Other Linux distributions:**

[Download this package](http://qt.nokia.com/downloads/linux-x11-cpp).

## Building

To generate the necessary files and build the binary:

    ./build.sh

## License

webkit-server uses the MIT license. See LICENSE for more details.
