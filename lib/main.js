var pageMod = require("sdk/page-mod");
var self = require("sdk/self");
var querystring = require("sdk/querystring");
var tabs = require("sdk/tabs");

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
            if (tabs.activeTab.url !== worker.tab.url) {
                console.log("isActiveTab false");
                worker.tab.url = "https://lists.mozilla.org/admindb/community-german";
            } else {
                console.log("isActiveTab true");

            }
        });
        console.log("overview-loaded CALL");
        worker.port.emit("overview-loaded");
    }
});
