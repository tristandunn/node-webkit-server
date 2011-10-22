if hash qmake 2> /dev/null; then
  QMAKE_BINARY="qmake"
elif hash qmake-qt4 2> /dev/null; then
  QMAKE_BINARY="qmake-qt4"
else
  echo "The qmake or qmake-qt4 binary could not be found. Please ensure Qt is installed and in your PATH."
  exit 1
fi

PLATFORM=`uname -s`

if [ $PLATFORM == "Linux" ]; then
  SPEC="linux-g++"
elif [ $PLATFORM == "FreeBSD" ]; then
  SPEC="freebsd-g++"
elif [ $PLATFORM == "Darwin" ]; then
  SPEC="macx-g++"
else
  echo "The $PLATFORM platform is not currently supported."
  exit 2
fi

if hash gmake 2> /dev/null; then
  MAKE_BINARY="gmake"
elif hash make 2> /dev/null; then
  MAKE_BINARY="make"
else
  echo "The make or gmake binary count not be found. Please ensure it is in your PATH."
  exit 3
fi

cd `dirname $0`

$QMAKE_BINARY -spec $SPEC
$MAKE_BINARY qmake
$MAKE_BINARY

mkdir -p bin
mv src/webkit_server bin/
