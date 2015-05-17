var pageMod = require("sdk/page-mod");
var self = require("sdk/self");
var querystring = require("sdk/querystring");
var tabs = require("sdk/tabs");
var prefs = require("sdk/simple-prefs");

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
        console.log("onAttach IN");
        worker.port.on("reloadTimeout", function() {
            console.log("reloadTimeout IN");
            if ((prefs.prefs.reloadIfActiveTab) || (tabs.activeTab.url !== worker.tab.url)) {
                console.log("reloading...");
                worker.tab.url = "https://lists.mozilla.org/admindb/community-german";
            }
        });
        console.log("overview-loaded CALL");
        worker.port.emit("overview-loaded", prefs.prefs.reloadInterval);
    }
});
