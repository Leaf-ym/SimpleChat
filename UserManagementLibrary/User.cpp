#include "User.h"

User::User(QObject* parent)
	: QObject(parent)
{
	Name = QString::fromLocal8Bit("��");
}

User::~User()
{
}
