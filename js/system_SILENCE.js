//////加载完成后的动作
onload = function () {

    ////////连接到服务器
    ConnectToServer();

    //////屏幕大小是否合适并作相应反馈
    softWindow();

    /////自动发送系统提示信息
    new MessageItem("群聊", "欢迎使用简聊Web！试试左滑右滑~<br>Ctrl+Enter发送消息，点击logo打开左边栏(大屏幕忽略此条)。", "../img/def.svg", 0, 0, 1).addToWin();
}

function setEditState(state) {
    let editBox = document.getElementById("edit");
    if (state) {
        editBox.removeAttribute("disabled");
        editBox.setAttribute("placeholder", "在这里输入消息");
    } else {
        editBox.setAttribute("disabled", "disabled");
        editBox.setAttribute("placeholder", "登陆后才能发送消息");
    }
}

function setCookie(cName, cValue, exDays) { //设置cookie
    let d = new Date();
    d.setTime(d.getTime() + (exDays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toGMTString();
    document.cookie = cName + "=" + cValue + "; " + expires;
}

function getCookie(cName) { //获取cookie
    let name = cName + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i].trim();
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}

function checkCookie(value) { //检查cookie
    let v = getCookie(value);
    if (v != "") {
        return true;
    } else {
        return false;
    }
}

/////////接收来自服务器的消息
function ReceiveByServer(type, self, head, name, msg, fromId = 0) {
    if (self) {
        new MessageItem(name, msg, head, 1, fromId, type).addToWin();
    } else {
        new MessageItem(name, msg, head, 0, fromId, type).addToWin();
    }
}

/////弹出提示信息，支持富文本
function openTips(type, content) { //type:1提示，2警告，3错误，4公告
    let tips = document.getElementById("tips");
    tips.style.transform = "scale(1.0)";
    tips.style.opacity = "1.0";
    setTimeout(function () {
        tips.style.backgroundColor = "rgba(0,0,0,0.5)";
    }, 500);
    putInfo(type, content);
}

function putInfo(type, content) {
    let tipsBody = document.getElementById("tipsBody");
    let tipsTitle = document.getElementById("tipsTitle");
    let tipsContent = document.getElementById("tipsContent");

    switch (type) {
        case 1:
            tipsTitle.innerHTML = "提示";
            break;
        case 2:
            tipsTitle.innerHTML = "警告";
            break;
        case 3:
            tipsTitle.innerHTML = "错误";
            break;
        case 4:
            tipsTitle.innerHTML = "公告";
            break;
    }
    tipsContent.innerHTML = content;
    let tipsHeight = tipsBody.clientHeight || tipsBody.offsetHeight;
    tipsBody.style.transform = "translateY(-" + (tipsHeight / 2) + "px)";
}

/////刷新用户列表
function refreshUserList(info) {
    let user = JSON.parse(info);
    let userCount = user[0].loginUserSize;
    let list = document.getElementById("userList");
    list.innerHTML = "<p class=\"menu-title2\" style=\"margin: 0;font-size: 90%\">在线用户</p>";
    addUserItem(list, user[0].VisitorName, "游客数量:" + user[0].VisitorSize, "/img/def.svg", user[0]);
    for (let i = 1; i <= userCount; i++) {
        let sign = user[i].UserProfile == "" ? "这个人什么都没留下" : user[i].UserProfile;
        addUserItem(list, user[i].UserName, sign, '../UserFavicon/' + user[i].UserFavicon, user[i]);
    }
}

/////////登录成功后调用此方法
function logInfo(info) { ///////传入一个json字符串数组，包含用户的所有信息
    let json = JSON.parse(info);
    changeMyInfo(json);
    isLogin = true;
    setEditState(true);
    closeRegLogBox();
    isLogBoxOpen = false;

    if (getUserName() && getPsw()) {
        setCookie("username", getUserName(), 10);
        setCookie("password", getPsw(), 10);
        setCookie("userID", json.UserID, 10);
        setCookie("userHeadUrl", '../UserFavicon/' + json.UserFavicon, 10);
    }

    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
    document.getElementById("checkPsw").value = "";
}

/////////注册成功后调用此方法
function regInfo(info) { ///////传入一个json字符串数组，包含用户的所有信息
    console.log("返回信息:" + info);
    document.getElementById("checkPsw").value = "";
    changeToLog();
}

/////////注销后调用此方法
function signOut() {
    UserSignOut();
    let info = "{\"UserID\": -1,\"UserName\": \"游客\",\"UserProfile\": \"\"}"
    changeMyInfo(JSON.parse(info));

    setCookie("username", "", 100);
    setCookie("password", "", 100);
    setCookie("userID", "", 100);
    setCookie("userHeadUrl", "", 100);

    closeRight();
    isRightOpen = false;

    isLogin = false;
    location.reload();
}

////文件发送
document.getElementById("fileBox").onclick = function () {
    if (isLogin) {
        document.getElementById("files2").click();
    } else {
        openRegLogBox();
        isLogBoxOpen = true;
    }

}
document.getElementById("files2").onchange = function () {

    let file = document.getElementById("files2").files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function (evt) {
        setTimeout(function () {
            let jsonObject = {}
            jsonObject.filename = file.name;
            jsonObject.file = evt.target.result;
            SendMessageToServer(3, JSON.stringify(jsonObject), chatObj);
        }, 1000);
    }
    document.getElementById("files2").value = "";
}

/////图片选择与发送
document.getElementById("picBox").onclick = function () {
    if (isLogin) {
        document.getElementById("files1").click();
    } else {
        openRegLogBox();
        isLogBoxOpen = true;
    }

}
document.getElementById("files1").onchange = function () {
    let file = document.getElementById("files1").files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function (evt) {
        setTimeout(function () {
            let jsonObject = {}
            jsonObject.filename = file.name;
            jsonObject.file = evt.target.result;
            SendMessageToServer(2, JSON.stringify(jsonObject), chatObj);
        }, 1000);

    }
    document.getElementById("files1").value = "";
}

/////选择头像时调用此方法
function choosePic() {
    console.log("选择头像");
}

//点击登录注册按钮
document.getElementById("logBtn").addEventListener("click", function (e) {
    if (this.value == "确认登录") {
        UserLogin(getUserName(), getPsw());
    } else {
        if (checkPsw()) {
            UserRegister(getUserName(), getPsw());
        } else {
            openTips(3, "密码不一致");
        }
    }
    e.stopPropagation();
});

/////获取服务器端口信息
document.getElementById("newPswSet").addEventListener("click", function () {
    let oldP = document.getElementById("oldPsw").value;
    let newP1 = document.getElementById("newPsw").value;
    let newP2 = document.getElementById("checkNewPsw").value;

    if (oldP.length != 0 && newP1.length != 0 && newP2.length != 0 && newP1 == newP2) {
        changePsw(oldP, newP1);
    } else {
        console.log("密码信息有误");
    }
});