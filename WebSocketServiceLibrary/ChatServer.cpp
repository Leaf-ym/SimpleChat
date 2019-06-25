#include "ChatServer.h"

ChatServer::ChatServer(QObject* parent)
	: QObject(parent)
{
}

ChatServer::~ChatServer()
{
}
void ChatServer::ReceiveUserMessage(ChatUser* chatUser, QString message, int fromID,int toID)
{
	emit ForwardUserMessage(chatUser, message, fromID,toID);
}