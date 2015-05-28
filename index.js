var pageMod = require("sdk/page-mod");
var self = require("sdk/self");
var querystring = require("sdk/querystring");
var tabs = require("sdk/tabs");
var prefs = require("sdk/simple-prefs");
var notifications = require("sdk/notifications");
var _ = require("sdk/l10n").get;

prefs.on("reloadInterval", function(prefName) {
    if (prefs.prefs.reloadInterval < 5)
        prefs.prefs.reloadInterval = 5;
});

pageMod.PageMod({
    include: "https://lists.mozilla.org/admindb/community-german?msgid=*",
    attachTo: ["existing", "top"],
    contentScriptFile: self.data.url("content.js"),
    onAttach: function(worker) {
        let paramString = /msgid=\d+/.exec(worker.url);
        if (paramString) {
            let paramObj = querystring.parse(paramString[0]);
            let text = self.data.load("mail-reject.txt");
            worker.port.emit("setRejectionMessage", paramObj.msgid, text);
        }
    }
});

pageMod.PageMod({
    include: "https://lists.mozilla.org/admindb/community-german?details=all",
    attachTo: ["existing", "top"],
    contentScriptFile: self.data.url("content.js"),
    onAttach: function(worker) {
        let text = self.data.load("mail-reject.txt");
        worker.port.emit("setRejectionMessageAll", text);
    }
});

pageMod.PageMod({
    include: "https://lists.mozilla.org/admindb/community-german",
    attachTo: ["existing", "top"],
    contentScriptFile: self.data.url("content.js"),
    onAttach: function(worker) {
        worker.port.on("reloadTimeout", function() {
            if ((prefs.prefs.reloadIfActiveTab) || (tabs.activeTab.url !== worker.tab.url)) {
                worker.tab.url = "https://lists.mozilla.org/admindb/community-german";
            }
        });
        worker.port.on("send-notification", function() {
            if ((prefs.prefs.sendNotification) && (tabs.activeTab.url !== worker.tab.url)) {
                notifications.notify({
                    title   : _("notification-title"),
                    text    : _("notification-text"),
                    iconURL : "https://lists.mozilla.org/icons/mozilla-16.png",
                    onClick : function(data) {
                        worker.tab.activate();
                }
                });
            }
        })
        worker.port.emit("overview-loaded", prefs.prefs.reloadInterval);
    }
});
