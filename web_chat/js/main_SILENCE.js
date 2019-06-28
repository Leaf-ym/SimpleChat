onresize = function () {
    ////////////////////////////////////////////////////////////////////////////////////屏幕大小是否合适
    if (isSmall()) {
        smallScreen();
    } else {
        let w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        bigScreen(w);
    }
}

//////屏幕大小是否合适并作相应反馈
function softWindow() {
    if (isSmall()) {
        smallScreen();
    } else {
        let w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        bigScreen(w);
    }
}

///////清空输入框
function clearEdit() {
    let edit = document.getElementById("edit");
    edit.value = "";
    edit.focus();
}

///////获取输入框内容
function getEdit() {
    return document.getElementById("edit").value;
}

//////////当前用户发送消息的动作
function meSend(msg) {
    ///清空键值
    event.keyCode = 0;
    event.returnValue = false;
    if (msg.length != 0) {
        ///向服务器发送消息
        SendMessageToServer(1, getEdit(), chatObj);
        clearEdit();
    } else {
        console.log("内容为空");
    }
}

///////点击发送按钮
document.getElementById("send").onmousedown = function () {
    meSend(getEdit());
}

//////点击侧边栏之外的地方关闭侧边栏
document.getElementById("whole").addEventListener("click", function () {
    if (isSmall()) {
        if (isLeftOpen) {
            closeLeft();
            isLeftOpen = false;
        }
        if (isRightOpen) {
            closeRight();
            isRightOpen = false;
        }
    }
});
//////Ctrl+Enter键发送
document.getElementById("edit").onkeydown = function (e) {
    if (13 == e.keyCode && e.ctrlKey) {
        meSend(getEdit());
    } else if (13 == e.keyCode) {
        this.value = this.value + "<br>";
    }
}
///////手势判断
let startPoint = null;
document.addEventListener("touchstart", function (e) {
    var e = e || window.event;
    startPoint = e.touches[0];
});
document.addEventListener("touchmove", function (e) {
    var e = e || window.event;
    //e.changedTouches能找到离开手机的手指，返回的是一个数组
    let endPoint = e.changedTouches[0];
    //计算终点与起点的差值
    let x = endPoint.clientX - startPoint.clientX;
    let y = endPoint.clientY - startPoint.clientY;

    let d = 80; //滑动距离的参考值
    if (Math.abs(x) > d && (!isLogBoxOpen)) {
        if (x > 0 && isSmall()) {
            if (isRightOpen) {
                closeRight();
                isRightOpen = false;
            } else {
                openLeft();
                isLeftOpen = true;
            }
            var e = e || window.event;
            startPoint = e.touches[0];
        } else if (isSmall()) {
            if (isLeftOpen) {
                closeLeft();
                isLeftOpen = false;
            } else {
                openRight();
                isRightOpen = true;
            }

            var e = e || window.event;
            startPoint = e.touches[0];
        }
    }
});

//////设置//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
let isRightOpen = false; //右边栏(设置)是否打开

////打开右边栏
function openRight() {
    document.getElementById("rightMenu").style.transform = "translateX(-300px)";
    document.getElementById("whole").style.transform = "translateX(-200px)";
}

/////关闭右边栏
function closeRight() {
    document.getElementById("rightMenu").style.transform = "translateX(0px)";
    document.getElementById("whole").style.transform = "translateX(0px)";
    closeUserDetail();
    closePswSet();
    closeAbout();
    closeUser();
}

//////打开用户设置
function openUser() {
    document.getElementById("user-setting-menu").style.transform = "translateX(-300px)";
}

/////关闭用户设置
function closeUser() {
    document.getElementById("user-setting-menu").style.transform = "translateX(0px)";
}

/////打开密码设置
function openPswSet() {
    if (isLogin) {
        document.getElementById("net-menu").style.transform = "translateX(-300px)";
    } else {
        openRegLogBox();
        isLogBoxOpen = true;
    }

}

//////关闭密码设置
function closePswSet() {
    document.getElementById("net-menu").style.transform = "translateX(0px)";
}

function openAbout() {
    document.getElementById("about-menu").style.transform = "translateX(-300px)";
}

function closeAbout() {
    document.getElementById("about-menu").style.transform = "translateX(0px)";
}

function closeTips() {
    let tips = document.getElementById("tips");
    tips.style.opacity = "0.0";
    tips.style.transform = "scale(1.2)";
    setTimeout(function () {
        tips.style.backgroundColor = "rgba(0,0,0,0.0)";
        tips.style.transform = "scale(0.0)";
    }, 500);
}

let isSetItemOpen = false;

function openCloseSetting() {
    let setItemBox = document.getElementById("setItemBox");

    if (isSetItemOpen) {
        document.getElementById("settingBtn").style.color = "rgba(100, 100, 100, 0.00)";
        document.getElementById("userList").style.transform = "translateY(0px)";
        setItemBox.style.transform = "scale(0.1) translateY(0px)";
        setItemBox.style.right = "27px";
    } else {
        document.getElementById("settingBtn").style.color = "rgba(100, 100, 100, 1.00)";
        document.getElementById("userList").style.transform = "translateY(280px)";
        setItemBox.style.transform = "scale(1.0) translateY(80px)";
        setItemBox.style.right = "20px";
    }
    isSetItemOpen = !isSetItemOpen;
}

/////点击设置打开右侧栏
document.getElementById("setBtn").addEventListener("click", function (event) {
    if (isRightOpen && isSmall()) {
        closeRight();
        isRightOpen = false;
    } else if (isSmall()) {
        if (isLeftOpen) {
            closeLeft();
            isLeftOpen = false;
        }
        openRight();
        isRightOpen = true;
    }
    event.stopPropagation();
});

//////用户设置
let isLogin = false;
document.getElementById("userSettings").addEventListener("click", function () {
    if (isLogin) {
        openUser();
    } else {
        openRegLogBox();
        isLogBoxOpen = true;
    }
});

document.getElementById("closeUserMenu").addEventListener("click", closeUser);

////网络设置
document.getElementById("pswSettings").addEventListener("click", openPswSet);

document.getElementById("closeNet").addEventListener("click", closePswSet);

/////坦克大战
document.getElementById("addTank").addEventListener("click", function () {
    if (isLogin) {
        window.location.href = "game";
    } else {
        openRegLogBox();
        isLogBoxOpen = true;
    }
});


//////关于
document.getElementById("about").addEventListener("click", openAbout);

document.getElementById("closeAbout").addEventListener("click", closeAbout);

document.getElementById("tipsBtn").addEventListener("click", closeTips);

document.getElementById("settingBtn").addEventListener("click", openCloseSetting);

///////聊天列表//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
let isLeftOpen = false; //左边栏是否打开

//打开左边栏
function openLeft() {
    document.getElementById("leftMenu").style.transform = "translateX(300px)";
    document.getElementById("whole").style.transform = "translateX(200px)";
}

//关闭左边栏
function closeLeft() {
    document.getElementById("leftMenu").style.transform = "translateX(0px)";
    document.getElementById("whole").style.transform = "translateX(0px)";
}

function addUserItem(obj, name, subTitle, headUrl, info) {

    let userItem = document.createElement("div");
    userItem.setAttribute("class", "user-list-item");

    let userHead = document.createElement("img");
    userHead.setAttribute("alt", "#");

    userHead.setAttribute("class", "user-list-head");

    let userName = document.createElement("div");
    userName.setAttribute("class", "user-list-name");

    let userInfo = document.createElement("div");
    userInfo.setAttribute("class", "user-list-info");

    if (info.VisitorID) {
        userHead.setAttribute("src", headUrl);
        userName.innerHTML = name;
        userInfo.innerHTML = subTitle;
    } else {
        userHead.setAttribute("src", headUrl);
        userName.innerHTML = name;
        userInfo.innerHTML = subTitle;
    }

    userItem.appendChild(userHead);
    userItem.appendChild(userName);
    userItem.appendChild(userInfo);

    obj.appendChild(userItem);

    if (info.VisitorID) {} else {
        userItem.addEventListener("click", function () {
            openUserDetail(JSON.stringify(info));
        });
    }

}

//用户详细信息
document.getElementById("closeDetail").addEventListener("click", function () {
    closeUserDetail();
});

function openUserDetail(info) {
    let userInfo = JSON.parse(info);
    document.getElementById("detailHead").setAttribute("src", "../UserFavicon/" + userInfo.UserFavicon);
    document.getElementById("detailName").innerHTML = userInfo.UserName + "  ID:" + userInfo.UserID;
    document.getElementById("detailSign").innerHTML = userInfo.UserProfile;
    document.getElementById("regTime").innerHTML = "注册时间:20xx.xx.xx";
    if (getCookie("userID") == userInfo.UserID) {
        document.getElementById("sendPerMsg").style.display = "none";
    } else {
        document.getElementById("sendPerMsg").style.display = "block";
    }
    document.getElementById("userInfoBox").style.transform = "translateX(-300px)";
}

function closeUserDetail() {
    document.getElementById("userInfoBox").style.transform = "translateX(0px)";
}

document.getElementById("sendPerMsg").addEventListener("click", function (e) {
    chatObj = parseInt(document.getElementById("detailName").innerHTML.split(":", 2)[1]);
    if (!document.getElementById("W" + chatObj)) {
        let winId = "W" + chatObj;
        let hUrl = document.getElementById("detailHead").getAttribute("src");
        let n = document.getElementById("detailName").innerHTML.split(" ", 2)[0];
        let t = new MessageItem(n, "Echo", hUrl, 1, chatObj);
        t.addToWin()
        t.destroy();
        closeRight();
        isRightOpen = false;
    }
});

//////点击logo打开左侧栏
document.getElementById("logo").addEventListener("click", function (event) {
    if (isLeftOpen && isSmall()) {
        closeLeft();
        isLeftOpen = false;
    } else if (isSmall()) {
        if (isRightOpen) {
            closeRight();
            isRightOpen = false;
        }
        openLeft();
        isLeftOpen = true;
    } else {
        window.location.reload;
    }
    event.stopPropagation();
});

//////登录////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
let isLogBoxOpen = false;
let regOrLog = false;

//改变用户信息
function changeMyInfo(info) {
    document.getElementById("myName").innerHTML = info.UserName;
    document.getElementById("newNameEdit").value = info.UserName;
    let h = document.getElementById("myHead");
    if (info.UserID == -1) {
        h.removeEventListener("click", openUser);
        h.addEventListener("click", openRegLogBox);
        document.getElementById("myState").innerHTML = "未登录";
    } else {
        h.removeEventListener("click", openRegLogBox);
        h.addEventListener("click", openUser);
        document.getElementById("myState").innerHTML = "在线";
    }
    if (info.UserProfile == "") {
        let s = document.getElementById("mySign");
        s.innerHTML = "这个人什么都没有留下";
        s.title = "这个人什么都没有留下";
        document.getElementById("newSignEdit").placeholder = "这个人什么都没有留下";
    } else {
        let s = document.getElementById("mySign");
        document.getElementById("newSignEdit").value = info.UserProfile;
        s.innerHTML = info.UserProfile;
        s.title = info.UserProfile;
    }
}

//////////获取框中用户名
function getUserName() {
    let userName = document.getElementById("username").value;
    if (userName.replace(/\s+/g, "").length != 0) {
        return userName;
    } else {
        console.log("用户名不规范");
        return false;
    }
}

////////获取框中密码
function getPsw() {
    let passWd = document.getElementById("password").value;
    if (passWd.replace(/\s+/g, "").length != 0) {
        return passWd;
    } else {
        console.log("密码不规范");
        return false;
    }
}

document.getElementById("password").onkeydown = function (e) {
    if (e.keyCode == 13) {
        UserLogin(getUserName(), getPsw());
    }
}

document.getElementById("myHead").addEventListener("click", openRegLogBox);

document.getElementById("regBtn").addEventListener("click", function (e) {
    if (this.value == "注册账号") {
        changeToReg();
    } else {
        changeToLog();
    }
    e.stopPropagation();
});

document.getElementById("closeLogBox").addEventListener("click", function (e) {
    closeRegLogBox();
    e.stopPropagation();
});

document.getElementById("checkPsw").addEventListener("focus", function (e) {
    this.style.transform = "scale(1.1)";
    e.stopPropagation();
});

document.getElementById("checkPsw").addEventListener("blur", function (e) {
    this.style.transform = "scale(1.0)";
    e.stopPropagation();
});

document.getElementById("lrMain").addEventListener("click", function (e) {
    e.stopPropagation();
});

document.getElementById("logRegBox").addEventListener("click", function (e) {
    closeRegLogBox();
    e.stopPropagation();
});

document.getElementById("signOut").addEventListener("click", function (e) {
    signOut();
});

/////////打开登陆注册框
function openRegLogBox() {
    if (!isLogBoxOpen) {
        let rBox = document.getElementById("logRegBox");
        rBox.style.transform = "scale(1.0)";
        rBox.style.opacity = "1.0";
        setTimeout(function (e) {
            rBox.style.backgroundColor = "rgba(0,0,0,0.50)";
        }, 500);
        isLogBoxOpen = true;
        if (isSmall()) {
            closeRight();
            isRightOpen = false;
        }
    }

}

/////关闭登录注册框
function closeRegLogBox() {
    if (isLogBoxOpen) {
        let rBox = document.getElementById("logRegBox");
        rBox.style.backgroundColor = "rgba(0,0,0,0.00)";
        rBox.style.opacity = "0.0";
        setTimeout(function () {
            rBox.style.transform = "scale(0.0)";
        }, 500);
        isLogBoxOpen = false;
    }

}


//////切换到登录模式
function changeToLog() {
    let l = document.getElementById("logBtn");
    let r = document.getElementById("regBtn");
    document.getElementById("checkPsw").style.transform = "scale(0)";
    l.style.transform = "translateY(-50px)";
    r.style.transform = "translateY(-50px)";
    document.getElementById("logTitle").innerHTML = "登录";
    l.value = "确认登录";
    r.value = "注册账号";
}


/////////切换到注册模式
function changeToReg() {
    let l = document.getElementById("logBtn");
    let r = document.getElementById("regBtn");
    document.getElementById("checkPsw").style.transform = "scale(1)";
    l.style.transform = "translateY(0px)";
    r.style.transform = "translateY(0px)";
    document.getElementById("logTitle").innerHTML = "注册";
    l.value = "确认注册";
    r.value = "用户登录";
}

//////判断两次密码是否相同
function checkPsw() {
    let p1 = document.getElementById("password").value;
    let p2 = document.getElementById("checkPsw").value;
    if (p1 == p2) {
        return true;
    } else {
        return false;
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////发送消息后滚动到底部
function scrollToBottom(obj) {
    obj.scrollIntoView({
        block: "start",
        behavior: "smooth"
    });
}

////////判断屏幕宽度是否大于2000
function isSmall() {
    let w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    if (w < 2000) return true;
    else return false;
}

////////屏幕足够宽时调用此方法
function bigScreen(width) {
    let w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    document.getElementById("setBtn").innerHTML = "<div style='font-size:16px'>一个简单的群聊网站<div>";
    openRight();
    openLeft();
    isRightOpen = true;
    isLeftOpen = true;
    let d = (width - 1400) / 2;
    document.getElementById("rightMenu").style.transform = "translateX(-" + d + "px) translateY(60px)";
    document.getElementById("leftMenu").style.transform = "translateX(" + d + "px) translateY(60px)";
    document.getElementById("whole").style.transform = "translateX(0px)";
}

/////小屏幕调用此方法
function smallScreen() {
    document.getElementById("setBtn").innerHTML = "设置";
    closeRight();
    closeLeft();
    isRightOpen = false;
    isLeftOpen = false;
}

//////////服务器连接失败的提示信息
function setConnectError(error) {
    let c = document.getElementById("connect");
    c.title = "无法连接到服务器";
    c.innerHTML = "×";
    c.style.backgroundColor = "rgba(255, 120, 120, 1.00)";
}

////////服务器连接成功的提示信息
function connectSuccess() {
    let c = document.getElementById("connect");
    c.title = "已连接到服务器";
    c.innerHTML = "√";
    c.style.backgroundColor = "rgba(118, 178, 74, 1.00)";
}

////////服务器断开后点击发送给予反馈
let isToasted = false;

function errorInfo(error) {
    let c = document.getElementById("connect");
    if (!isToasted) {
        c.style.backgroundColor = "rgba(255, 0, 0, 1.00)";
        c.style.transform = "scale(1.1)";
        isToasted = true;
    }
    setTimeout(function () {
        c.style.backgroundColor = "rgba(255, 120, 120, 1.00)";
        c.style.transform = "scale(1.0)";
        isToasted = false;
    }, 100);
}

////////输入框缩放
let isPress = false;
let barStartY = null;
let oldY = null;

document.getElementById("toolBar").addEventListener("mousedown", function (e) {
    startResize(e);
});

document.getElementById("toolBar").addEventListener("touchstart", function (e) {
    startResize(e);
});

document.addEventListener("mousemove", function (e) {
    reSizeEdit(e);
});

document.addEventListener("touchmove", function (e) {
    reSizeEdit(e);
});

document.addEventListener("mouseup", function (e) {
    isPress = false;
});

document.addEventListener("touchend", function (e) {
    isPress = false;
});

function startResize(e) {
    if (!isPress) {
        let chatBox = document.getElementById("chatBox");
        var e = e || window.event;
        barStartY = e.clientY || e.touches[0].clientY;
        oldY = parseInt(getComputedStyle(chatBox, null).getPropertyValue("bottom"));
        isPress = true;
    }
}

function reSizeEdit(e) {
    if (isPress) {
        let chatBox = document.getElementById("chatBox");
        var e = e || window.event;
        let limit = parseInt(getComputedStyle(chatBox, null).getPropertyValue("bottom"));
        let editBox = document.getElementById("editBox");
        let distance = oldY - ((e.clientY || e.changedTouches[0].clientY) - barStartY) + "px";

        chatBox.style.bottom = distance;
        editBox.style.height = distance;

        if (limit > 510) {
            chatBox.style.bottom = "500px";
            editBox.style.height = "500px";
            isPress = false;
        } else if (limit < 90) {
            chatBox.style.bottom = "100px";
            editBox.style.height = "100px";
            isPress = false;
        }
    }
}