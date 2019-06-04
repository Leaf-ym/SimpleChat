#include "ChatUser.h"

ChatUser::ChatUser(QObject* parent)
	: QObject(parent)
{
}

ChatUser::~ChatUser()
{
}
QString ChatUser::ReceiveUserFile(QString filestring)
{
	QJsonObject jsonObject = QJsonDocument::fromJson(filestring.toUtf8()).object();
	QByteArray byteArray1 = jsonObject.value("file").toString().split(',').at(1).toUtf8();
	QByteArray byteArray2 = QByteArray::fromBase64(byteArray1);
	QString filename = QDateTime::currentDateTime().toString("yyyyMMddhhmmss") + jsonObject.value("filename").toString();
	QFile file("../UserResource/File/" + filename);
	if (file.open(QIODevice::WriteOnly))
	{
		file.write(byteArray2);
		file.close();
		return filename;
	}
	return "";
}
bool ChatUser::SendUserMessage(int type, QString content)
{
	Message message;
	message.Type = type;
	if (type == 1)
		message.Content = content;
	else if (type == 2 || type == 3)
	{
		QString filename = ReceiveUserFile(content);
		if (!filename.isEmpty())
			message.Content = filename;
		else
			return false;
	}
	else
		return false;
	QJsonArray jsonArray;
	jsonArray.insert(0, user.ConversionJson());
	jsonArray.insert(1, message.ConversionJson());
	emit UserMessageToServer(this, QJsonDocument(jsonArray).toJson());
	return true;
}

void ChatUser::ReceiveUserMessage(ChatUser* chatUser, QString message)
{
	emit ShowUserMessage(this == chatUser, message);
}
void ChatUser::ReceiveUserlist(QString userlist)
{
	emit ShowUserList(userlist);
}
bool ChatUser::UserRegister(QString name, QString password)
{
	int id = db->UserSelectID(name, password);
	if (id == -1)
	{
		if (db->UserRegister(name, password))
		{
			if (QFile("../UserResource/UserFavicon/-1.svg").copy("../UserResource/UserFavicon/" + QString::number(db->UserSelectID(name, password)) + ".svg"))
			{
				qInfo() << tr("User Register:%1.IP:%2").arg(name).arg(((QWebSocket*)this->parent()->parent()->parent())->peerAddress().toString());
				emit ShowServerTips(1, QString::fromLocal8Bit("ע��ɹ�!"));
				return true;
			}
			else
			{
				emit ShowServerTips(3, QString::fromLocal8Bit("��ʼ���û���Ϣʧ��!"));
				return false;
			}
		}
		else
		{
			emit ShowServerTips(3, QString::fromLocal8Bit("ע��ʧ��!"));
			return false;
		}
	}
	else
	{
		emit ShowServerTips(2, QString::fromLocal8Bit("��ע��!<br/>�����ظ�ע��"));
		return true;
	}

}
bool ChatUser::UserLogin(QString name, QString password)
{
	int id = db->UserSelectID(name, password);
	if (id != -1)
	{
		if (user.ID == id)
		{
			emit ShowServerTips(2, QString::fromLocal8Bit("�ѵ�¼!<br/>�����ظ���¼"));
			return true;
		}
		user = db->UserSelectAll(id);
		emit ShowUserInfo(QJsonDocument(user.ConversionJson()).toJson());
		emit VisitorConversionUser(this);
		emit ShowServerTips(1, QString::fromLocal8Bit("��¼�ɹ�!"));
		qInfo() << tr("User Login:%1.IP:%2").arg(name).arg(((QWebSocket*)this->parent()->parent()->parent())->peerAddress().toString());
		return true;
	}
	else
	{
		if (user.ID != -1)
		{
			user = User();
			emit ShowUserInfo(QJsonDocument(user.ConversionJson()).toJson());
			emit UserConversionVisitor(this);
			emit ShowServerTips(2, QString::fromLocal8Bit("�˺��������!<br/>����"));
			return false;
		}
		else
		{
			emit ShowServerTips(2, QString::fromLocal8Bit("�˺��������!<br/>����"));
			return false;
		}
	}
}
bool ChatUser::UserLogout()
{
	if (user.ID != -1)
	{
		user = User();
		emit ShowUserInfo(QJsonDocument(user.ConversionJson()).toJson());
		emit UserConversionVisitor(this);
		emit ShowServerTips(1, QString::fromLocal8Bit("�ɹ�ע��!"));
		return false;
	}
	else
	{
		emit ShowServerTips(2, QString::fromLocal8Bit("δ��¼!"));
		return false;
	}
}
bool ChatUser::UserChangeInfo(QString name, QString profile)
{
	if (user.ID!=-1)
	{
		User u = user;
		u.Name = name;
		u.Profile = profile;
		if (db->UserChangeAll(u))
		{
			user = db->UserSelectAll(u.ID);
			emit ShowUserInfo(QJsonDocument(user.ConversionJson()).toJson());
			emit VisitorConversionUser(this);
			emit ShowServerTips(1, QString::fromLocal8Bit("�û���Ϣ���ĳɹ�!"));
		}
	}
	emit ShowServerTips(2, QString::fromLocal8Bit("δ��¼!"));
	return false;
}
bool ChatUser::UserChangePassword(QString oldpassword, QString newpassword)
{
	if (user.ID != -1)
	{
		if (oldpassword==newpassword)
		{
			User u = user;
			u.Password = newpassword;
			if (db->UserChangeAll(u))
			{
				user = db->UserSelectAll(u.ID);
				emit ShowServerTips(1, QString::fromLocal8Bit("�û�������ĳɹ�!"));
			}
		}
		emit ShowServerTips(2, QString::fromLocal8Bit("�������!<br/>�û��������ʧ��!"));
		return false;
	}
	emit ShowServerTips(2, QString::fromLocal8Bit("δ��¼!"));
	return false;
}
void ChatUser::UserChangePermission(int permission)
{

	if (user.Permission==-1)
	{
		user.Permission = permission;
	}
	else
	{
		User u = user;
		u.Permission = permission;
		if (db->UserChangeAll(u))
		{
			user = db->UserSelectAll(u.ID);
		}
	}
}