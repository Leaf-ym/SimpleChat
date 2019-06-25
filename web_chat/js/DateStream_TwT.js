'use strict';
var domain = document.domain;
var wsUri = "ws://" + domain + ":12345";
var socket;

function ConnectToServer() {
    socket = new ReconnectingWebSocket(wsUri);
    socket.onclose = function () {
        console.error("web channel closed");
    };
    socket.onopen = function (error) {
        console.error("web channel open: " + error);
    };
    socket.onerror = function (error) {
        console.error("web channel error: " + error);
        setConnectError(error);
    };
    socket.onopen = function () {
        console.log("web channel open");
        connectSuccess();
        window.channel = new QWebChannel(socket, function (channel) {
            channel.objects.ChatUser.ShowUserMessage.connect(function (self, message, toID) {
                console.log("ToID:" + toID);
                var jsonArray = JSON.parse(message);
                switch (jsonArray[1].MessageType) {
                    case 1:
                        ReceiveByServer(self, '../UserFavicon/' + jsonArray[0].UserFavicon, jsonArray[0].UserName, jsonArray[1].MessageContent, toID);
                        break;
                    case 2:
                        ReceiveByServer(self, '../UserFavicon/' + jsonArray[0].UserFavicon, jsonArray[0].UserName, '<img width=100% height=auto src="../File/' + jsonArray[1].MessageContent + '"/>', toID);
                        break;
                    case 3:
                        ReceiveByServer(self, '../UserFavicon/' + jsonArray[0].UserFavicon, jsonArray[0].UserName, '<a href="../File/' + jsonArray[1].MessageContent + '">' + jsonArray[1].MessageContent + '</a>', toID);
                        break;
                }
            });
            channel.objects.ChatUser.ShowServerTips.connect(function (type, tipsContent) {
                if (tipsContent == "注册成功!") {
                    regInfo(tipsContent);
                }
                openTips(type, tipsContent);
            });
            channel.objects.ChatUser.ShowUserInfo.connect(function (userInfo) {
                logInfo(userInfo);
            });
            channel.objects.ChatUser.ShowUserList.connect(function (userList) {
                refreshUserList(userList);
            });
            if (checkCookie("username") != "" && checkCookie("password") != "") {
                UserLogin(getCookie("username"), getCookie("password"));
                isLogin = true;
            }
        });
    }
}

function SendMessageToServer(type, message, toId = 0) {
    try {
        channel.objects.ChatUser.SendUserMessage(type, message, toId, function (value) { });
    } catch (e) {
        errorInfo(e);
    }
}

function UserRegister(name, password) {
    try {
        channel.objects.ChatUser.UserRegister(name, password, function (value) { });
    } catch (e) {
        errorInfo(e);
    }
}

function UserLogin(name, password) {
    try {
        channel.objects.ChatUser.UserLogin(name, password, function (value) { });
    } catch (e) {
        errorInfo(e);
    }
}

function UserSignOut() {
    console.log("用户注销");
    try {
        channel.objects.ChatUser.UserLogout(function (value) { });
    } catch (e) {
        errorInfo(e);
    }
}

function changeHead(filestring) {
    console.log("更改用户头像");
    try {
        channel.objects.ChatUser.UserChangeFavicon(filestring, function (value) { });
    } catch (e) {
        errorInfo(e);
    }
}

function changeUserInfo(userName, userSign) {
    console.log("用户修改信息");
    try {
        channel.objects.ChatUser.UserChangeInfo(userName, userSign, function (value) { });
    } catch (e) {
        errorInfo(e);
    }
}

function changePsw(oldPsw, newPsw) {
    console.log("用户修改密码");
    console.log(oldPsw);
    console.log(newPsw);
    try {
        channel.objects.ChatUser.UserChangePassword(oldPsw, newPsw, function (value) { });
    } catch (e) {
        errorInfo(e);
    }

}