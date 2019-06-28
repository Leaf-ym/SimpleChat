#pragma once

#include <QObject>
#include <QList>
#include <QString>
#include <QJsonObject>
#include <QJsonArray>
#include <QJsonDocument>
#include <QWebSocket>
#include <QFile>
#include <QDebug>
#include "../UserManagementLibrary/User.h"
#include "../UserManagementLibrary/Message.h"
#include "../UserManagementLibrary/DataBase.h"
class ChatUser : public QObject
{
	Q_OBJECT

public:
	ChatUser(QObject* parent = nullptr);
	~ChatUser();
	DataBase* db;
	QList<ChatUser*>* loginUserList;
	User user;
	QJsonObject ConversionJson();
public slots:
	bool UserRegister(QString, QString);
	bool UserLogin(QString, QString);
	bool UserLogout();
	bool UserChangeInfo(QString, QString);
	bool UserChangePassword(QString, QString);
	bool UserChangeFavicon(QString);
	bool SendUserMessage(int, QString, int);
	void ReceiveUserMessage(ChatUser*, QString, int, int);
	void ReceiveUserlist(QString);
signals:
	void VisitorConversionUser(ChatUser*);
	void UserConversionVisitor(ChatUser*);
	void UserMessageToServer(ChatUser*, QString, int, int);
	void ShowUserMessage(bool, QString, int);
	void ShowUserList(QString);
	void ShowUserInfo(QString);

	void ShowServerTips(int, QString);
private:
	QString ReceiveUserFile(QString);
	void UserChangePermission(int);
	bool UserCheckLogin(int);

};
