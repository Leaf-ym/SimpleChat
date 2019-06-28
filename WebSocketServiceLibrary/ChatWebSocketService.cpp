#include "ChatWebSocketService.h"

ChatWebSocketService::ChatWebSocketService(QObject* parent)
	: QObject(parent)
{
	webSocketServer = new QWebSocketServer("", QWebSocketServer::NonSecureMode, this);
	ConnectSlots();
	StartWebSocketServer();
}
ChatWebSocketService::~ChatWebSocketService()
{
}
void ChatWebSocketService::ConnectSlots()
{
	QObject::connect(webSocketServer, &QWebSocketServer::newConnection, this, &ChatWebSocketService::CreatChannel);
}
bool ChatWebSocketService::StartWebSocketServer()
{
	Config config;
	if (!webSocketServer->listen(QHostAddress(config.Settings->value("ChatWebSocketServer/Address").toString()), config.Settings->value("ChatWebSocketServer/Port").toInt())) {
		qWarning() << tr("Chat QWebSocketServer not run.");
		return false;
	}
	else
	{
		qInfo() << tr("Chat QWebSocketServer Running on ws://%1:%2/").arg(webSocketServer->serverAddress().toString()).arg(webSocketServer->serverPort());
		return true;
	}
}
void ChatWebSocketService::CreatChannel()
{
	QWebSocket* webSocket = webSocketServer->nextPendingConnection();
	qInfo() << tr("Chat QWebSocketServer Creat New Connect. From ipv4: %1:%2").arg(webSocket->peerAddress().toString()).arg(webSocket->peerPort());
	WebSocketTransport* webSocketTransport = new WebSocketTransport(webSocket);
	QWebChannel* webChannel = new QWebChannel(webSocketTransport);
	ChatUser* chatUser = new ChatUser(webChannel);
	chatUser->db = db;
	chatUser->loginUserList = &loginUserList;
	visitorUserList.append(chatUser);

	QObject::connect(chatUser, &ChatUser::UserMessageToServer, &chatServer, &ChatServer::ReceiveUserMessage);
	QObject::connect(&chatServer, &ChatServer::ForwardUserMessage, chatUser, &ChatUser::ReceiveUserMessage);

	QObject::connect(&chatServer, &ChatServer::ForwardUserlist, chatUser, &ChatUser::ReceiveUserlist);
	QObject::connect(chatUser, &ChatUser::VisitorConversionUser, this, &ChatWebSocketService::AddUser);
	QObject::connect(chatUser, &ChatUser::UserConversionVisitor, this, &ChatWebSocketService::LessUser);
	QObject::connect(chatUser, &ChatUser::destroyed, this, &ChatWebSocketService::DeleatUser);


	webChannel->connectTo(webSocketTransport);
	webChannel->registerObject(QStringLiteral("ChatUser"), chatUser);

	QTimer::singleShot(500, [=] {
		emit chatServer.ForwardUserlist(UserListConversionJson());
		});

}
void ChatWebSocketService::ArrangeUserList(QList<ChatUser*>& UserList)
{
	qSort(UserList.begin(), loginUserList.end(), [](ChatUser* chatUserA, ChatUser* chatUserB) {
		return chatUserA->user.ID < chatUserB->user.ID;
		});
}
void ChatWebSocketService::AddUser(ChatUser* chatUser)
{
	loginUserList.removeAt(loginUserList.indexOf(chatUser));
	visitorUserList.removeAt(visitorUserList.indexOf(chatUser));
	loginUserList.append(chatUser);
	ArrangeUserList(loginUserList);
	emit chatServer.ForwardUserlist(UserListConversionJson());
}
void ChatWebSocketService::LessUser(ChatUser* chatUser)
{
	loginUserList.removeAt(loginUserList.indexOf(chatUser));
	visitorUserList.removeAt(visitorUserList.indexOf(chatUser));
	visitorUserList.append(chatUser);
	ArrangeUserList(loginUserList);
	emit chatServer.ForwardUserlist(UserListConversionJson());
}
void ChatWebSocketService::DeleatUser(QObject* obj)
{
	ChatUser* chatUser = (ChatUser*)obj;
	loginUserList.removeAt(loginUserList.indexOf(chatUser));
	visitorUserList.removeAt(visitorUserList.indexOf(chatUser));
	ArrangeUserList(loginUserList);
	emit chatServer.ForwardUserlist(UserListConversionJson());
}
QString ChatWebSocketService::UserListConversionJson()
{
	ChatUser chatUser;
	QJsonObject json;
	json.insert("VisitorSize", visitorUserList.size());
	json.insert("loginUserSize", loginUserList.size());
	json.insert("VisitorID", chatUser.user.ID);
	json.insert("VisitorName", chatUser.user.Name);
	QJsonArray jsonArray;
	jsonArray.insert(0, json);
	for (int i = 0; i < loginUserList.size(); i++)
	{
		jsonArray.insert(i + 1, loginUserList[i]->ConversionJson());
	}
	return QJsonDocument(jsonArray).toJson();
}