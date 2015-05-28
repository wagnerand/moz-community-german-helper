function rejectClickListener(msgID, text) {
    let elements = document.getElementsByName("comment-" + msgID);
    if ((elements) && (elements.length > 0)) {
        elements[0].value = text;
    }
}

self.port.on("setRejectionMessage", function(msgID, text) {
    let radioButton = document.getElementsByName(msgID)[2];
    radioButton.addEventListener("click", function() {
        rejectClickListener(msgID, text);
    });
});

self.port.on("setRejectionMessageAll", function(text) {
    let buttonList = document.querySelectorAll(".main-content > form:nth-child(9) > table:nth-child(4n) > tbody:nth-child(1) > tr:nth-child(5) > td:nth-child(2) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(3) > center:nth-child(1) > input:nth-child(1)");
    for (let i = 0; i < buttonList.length; i++) {
        let radioButton = buttonList.item(i);
        radioButton.addEventListener("click", function() {
            rejectClickListener(radioButton.name, text);
        });
    }
});

self.port.on("overview-loaded", function(reloadInterval) {
    let headline = document.querySelector(".main-content > h2:nth-child(1)");
    if (headline) {
        if (headline.textContent.indexOf("community-german") > 0) {
            let favIcons = document.querySelectorAll("head > link[rel='shortcut icon']")
            for (icon of favIcons) {
                icon.href = "/icons/alert.red.png";
            }
            self.port.emit("send-notification");
        }
        setInterval(function() {
            self.port.emit("reloadTimeout");
        }, reloadInterval * 60000);
    }
});
