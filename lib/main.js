var pageMod = require("sdk/page-mod");
var self = require("sdk/self");
var querystring = require("sdk/querystring");
 
pageMod.PageMod({
    include: "https://lists.mozilla.org/admindb/community-german?msgid=*",
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
