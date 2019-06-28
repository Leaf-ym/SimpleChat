#pragma once
#include "usermanagementlibrary_global.h"
#include <QObject>
#include <QSqlDatabase>
#include <QSqlQuery>
#include <QSqlError>
#include <QDebug>
#include "User.h"
class USERMANAGEMENTLIBRARY_EXPORT DataBase : public QObject
{
	Q_OBJECT

public:
	DataBase(QObject* parent = nullptr);
	~DataBase();
	QSqlDatabase userDataBase;
	QSqlDatabase messageDataBase;

	void CreatBaseDDataBase();
	void OpenDataBase();
	bool UserRegister(QString, QString);
	int UserCheckName(QString name);
	int UserSelectID(QString, QString);
	User UserSelectAll(int);
	bool UserChangeAll(User);
private:

};
