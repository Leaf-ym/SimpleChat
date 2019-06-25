#include "DataBase.h"

DataBase::DataBase(QObject* parent)
	: QObject(parent)
{
}

DataBase::~DataBase()
{
	userDataBase.close();
	messageDataBase.close();
}
void DataBase::OpenDataBase()
{
	userDataBase = QSqlDatabase::database("UserDataBase");
	messageDataBase = QSqlDatabase::database("MessageDataBase");
}
void DataBase::CreatBaseDDataBase()
{
	userDataBase = QSqlDatabase::addDatabase("QSQLITE", "UserDataBase");
	userDataBase.setDatabaseName("../UserResource/User.db");
	if (!userDataBase.open())
		qWarning() << tr("Failed to connect UserDataBase.%1").arg(userDataBase.lastError().text());
	else
		qDebug() << tr("Succeed Connect To UserDataBase.");
	if (userDataBase.isOpen())
	{
		QSqlQuery sqlQuery(userDataBase);
		if (sqlQuery.exec("select count(*) from sqlite_master where type = 'table' and name = 'user'") && sqlQuery.next() && sqlQuery.value(0).toInt() == 0)
		{
			sqlQuery.exec("CREATE TABLE user (id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT NOT NULL UNIQUE,password TEXT NOT NULL,profile TEXT,favicon TEXT,permission INT DEFAULT 0)");
			sqlQuery.prepare("INSERT INTO user (id,name, password, profile,favicon, permission) VALUES(:id,:name,:password,:profile,:favicon,:permission)");
			sqlQuery.bindValue(":id", 1);
			sqlQuery.bindValue(":name", "admin");
			sqlQuery.bindValue(":password", "admin");
			sqlQuery.bindValue(":profile", QString::fromLocal8Bit("ÏµÍ³Ä¬ÈÏÕËºÅ"));
			sqlQuery.bindValue(":favicon", "1.svg");			
			sqlQuery.bindValue(":permission", 2);
			sqlQuery.exec();
			qInfo() << "Creat Base User Table.Add admin user.";
		}
	}

	messageDataBase = QSqlDatabase::addDatabase("QSQLITE", "MessageDataBase");
	messageDataBase.setDatabaseName("../UserResource/Message.db");
	if (!messageDataBase.open())
		qWarning() << tr("Failed to connect MessageDataBase.%1").arg(messageDataBase.lastError().text());
	else
		qDebug() << tr("Succeed Connect To MessageDataBase.");
	if (messageDataBase.isOpen())
	{
		QSqlQuery sqlQuery(messageDataBase);
		if (sqlQuery.exec("select count(*) from sqlite_master where type = 'table' and name = 'message'") && sqlQuery.next() && sqlQuery.value(0).toInt() == 0)
		{
			sqlQuery.exec("CREATE TABLE message (id INTEGER PRIMARY KEY AUTOINCREMENT,type int NOT NULL,content TEXT NOT NULL,time TEXT NOT NULL)");
			qInfo() << "Creat Base Message Table.";
		}
	}
}
bool DataBase::UserRegister(QString name, QString password)
{
	if (userDataBase.isOpen())
	{
		QSqlQuery sqlQuery(userDataBase);
		sqlQuery.prepare("INSERT INTO user (name, password) VALUES(:name,:password)");
		sqlQuery.bindValue(":name", name);
		sqlQuery.bindValue(":password", password);
		return sqlQuery.exec();
	}
	else
	{
		qDebug() << tr("Not Connect To UserDataBase.");
		return false;
	}
}
int DataBase::UserSelectID(QString name, QString password)
{
	if (userDataBase.isOpen())
	{
		QSqlQuery sqlQuery(userDataBase);
		sqlQuery.exec("select id from user WHERE name='" + name + "' and password='" + password + "'");
		if (sqlQuery.next())
			return sqlQuery.value(0).toInt();
		else
			return -1;
	}
	else
	{
		qDebug() << tr("Not Connect To UserDataBase.");
		return -1;
	}
}
User DataBase::UserSelectAll(int id)
{
	User user;
	user.ID = -1;
	if (userDataBase.isOpen())
	{
		QSqlQuery sqlQuery(userDataBase);
		sqlQuery.exec("select * from user WHERE id='" + QString::number(id) + "'");
		if (sqlQuery.next())
		{
			user.ID = sqlQuery.value("id").toInt();
			user.Name = sqlQuery.value("name").toString();
			user.Password = sqlQuery.value("password").toString();
			user.Profile = sqlQuery.value("profile").toString();
			user.Favicon = sqlQuery.value("favicon").toString();
			user.Permission = sqlQuery.value("permission").toInt();
			return user;
		}
		else
			return user;
	}
	else
	{
		qDebug() << tr("Not Connect To UserDataBase.");
		return user;
	}
}
bool DataBase::UserChangeAll(User user)
{
	if (userDataBase.isOpen())
	{
		QSqlQuery sqlQuery(userDataBase);
		return sqlQuery.exec("update user set name='" + user.Name + "',password='" + user.Password + "',profile='" + user.Profile + "',favicon='" + user.Favicon + "',permission='" + QString::number(user.Permission) + "' WHERE id='" + QString::number(user.ID) + "'");
	}
	else
	{
		qDebug() << tr("Not Connect To UserDataBase.");
		return false;
	}
}