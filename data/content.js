self.port.on("setRejectionMessage", function(msgID, text) {
    let radioButton = document.getElementsByName(msgID)[2];
    radioButton.addEventListener("click", function() {
        let elements = document.getElementsByName("comment-" + msgID);
        if (elements) {
            elements[0].value = text;
        }
    });
});
