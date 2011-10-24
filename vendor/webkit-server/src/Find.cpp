#include "Find.h"
#include "Command.h"
#include "WebPage.h"

Find::Find(WebPage *page, QObject *parent) : Command(page, parent) {
}

void Find::start(QStringList &arguments) {
  QString message;
  QVariant result = page()->invokeWebKitServerFunction("find", arguments);

  if (result.isValid()) {
    emit finished(new Response(true, result.toString()));
  } else {
    emit finished(new Response(false, "Invalid selector."));
  }
}
