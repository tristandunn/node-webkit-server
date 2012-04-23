#include "Find.h"
#include "Command.h"
#include "WebPage.h"

Find::Find(WebPage *page, QStringList &arguments, QObject *parent) : Command(page, arguments, parent) {
}

void Find::start() {
  QVariant result = page()->invokeWebKitServerFunction("find", arguments());

  if (result.isValid()) {
    emit finished(new Response(true, result.toString()));
  } else {
    emit finished(new Response(false, QString("Invalid selector.")));
  }
}

