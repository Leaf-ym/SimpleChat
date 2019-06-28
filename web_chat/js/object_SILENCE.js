class MessageItem {
    constructor(name, content, headUrl, dir, id, msgType) {
        this.name = name;
        this.content = content;
        this.headUrl = headUrl;
        this.dir = dir;
        this.id = "W" + id;
        this.uId = id;
        this.msgType = msgType;
        this.obj;
    }

    addToWin() {
        if (document.getElementById(this.id)) {

            chatItems[this.id].refresh(this.headUrl, this.content, this.name, this.msgType);

            let newMsg = document.createElement("div");
            newMsg.setAttribute("class", "msg-item");

            let h = document.createElement("img");
            h.setAttribute("src", this.headUrl);

            let name = document.createElement("div");
            name.innerHTML = this.name;

            let msg = document.createElement("div");
            msg.innerHTML = this.content;

            if (this.dir == 0) {
                h.setAttribute("class", "head-img");
                name.setAttribute("class", "user-name");
                msg.setAttribute("class", "msg-box dot-c");
            } else {
                h.setAttribute("class", "head-img2");
                name.setAttribute("class", "user-name2");
                msg.setAttribute("class", "msg-box2 theme");
            }

            newMsg.appendChild(h);
            newMsg.appendChild(name);
            newMsg.appendChild(msg);

            this.obj = newMsg;

            document.getElementById(this.id).appendChild(this.obj);
            scrollToBottom(newMsg);

        } else {
            let chatItem = new ChatItem(this.id, this.headUrl, this.name, this.content);
            chatItem.create();
            chatItems[this.id] = chatItem;
            this.addToWin();
        }
    }

    destroy() {
        document.getElementById(this.id).removeChild(this.obj);
    }
}

class ChatWindow {
    constructor(windowId) {
        this.id = windowId;
        this.obj;
        this.isDisplay = true;
    }

    create() {
        let newWindow = document.createElement("div");
        newWindow.setAttribute("class", "chat-window");
        newWindow.setAttribute("id", this.id);
        document.getElementById("chatBox").appendChild(newWindow);
        this.obj = newWindow;
        this.obj.style.transform = "translateX(-100%) scale(0.5)";
        chatObj = parseInt(this.id.split("", 2)[1]);
    }

    open() {
        if (nowWindow) {
            nowWindow.close();
        }
        this.obj.style.opacity = "1.00";
        this.obj.style.transform = "translateX(0) scale(1.0)";
        this.isDisplay = true;

        if (isSmall()) {
            closeLeft();
            isLeftOpen = false;
        }
        chatObj = parseInt(this.id.split("", 2)[1]);
    }

    close() {
        let tempObj = this.obj;
        tempObj.style.transform = "translateX(80%) scale(0.8)";
        tempObj.style.opacity = "0.00";

        setTimeout(function () {
            tempObj.style.transform = "translateX(-100%) scale(0.8)";
        }, 500);

        this.isDisplay = false;
    }

    getState() {
        return this.isDisplay;
    }

}

let nowWindow;
let chatObj = 0;
let chatItems = [];
class ChatItem {

    constructor(chatWinId, headUrl, name, lastMsg) {
        this.chatWinId = chatWinId;
        this.headUrl = headUrl;
        this.name = name;
        this.lastMsg = lastMsg;
        this.obj;
        this.windowObj;
        this.headBox;
        this.nameBox;
        this.infoBox;
        this.itemId = chatWinId + "ITEM";
    }

    create() {
        let newItem = document.createElement("div");
        newItem.setAttribute("class", "chat-list-item");
        newItem.setAttribute("id", this.itemId);

        let itemHead = document.createElement("img");
        itemHead.setAttribute("class", "chat-list-head");
        itemHead.setAttribute("src", this.headUrl);
        this.headBox = itemHead;

        let itemName = document.createElement("div");
        itemName.setAttribute("class", "chat-list-name");
        itemName.innerHTML = this.name;
        this.nameBox = itemName;

        let itemMsg = document.createElement("div");
        itemMsg.setAttribute("class", "chat-list-info");
        itemMsg.innerHTML = this.name + " : " + this.lastMsg;
        this.infoBox = itemMsg;

        newItem.appendChild(itemHead);
        newItem.appendChild(itemName);
        newItem.appendChild(itemMsg);

        document.getElementById("chatList").appendChild(newItem);
        this.obj = newItem;

        if (!document.getElementById(this.chatWinId)) {
            let w = new ChatWindow(this.chatWinId);
            w.create();
            w.open();
            nowWindow = w;

            this.obj.addEventListener("click", function () {

                if (!w.getState()) {
                    w.open();
                    nowWindow = w;
                }
            });
        }

    }

    refresh(head, info, name, type) {
        this.headBox.setAttribute("src", head);
        switch (type) {
            case 1:
                this.infoBox.innerHTML = name + " : " + info;
                break;
            case 2:
                this.infoBox.innerHTML = name + " : " + "[图片]";
                break;
            case 3:
                this.infoBox.innerHTML = name + " : " + "[文件]";
                break;
        }

    }
}