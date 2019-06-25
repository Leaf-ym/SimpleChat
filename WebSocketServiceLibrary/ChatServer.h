#pragma once

#include <QObject>
#include <QString>


#include "ChatUser.h"
class ChatServer : public QObject
{
	Q_OBJECT

public:
	ChatServer(QObject* parent = nullptr);
	~ChatServer();
public slots:
	void ReceiveUserMessage(ChatUser*, QString, int, int);
signals:
	void ForwardUserMessage(ChatUser*, QString, int, int);
	void ForwardUserlist(QString);
};
