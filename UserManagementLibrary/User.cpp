#include "User.h"

User::User(QObject* parent)
	: QObject(parent)
{
}
User::User(const User& user)
{
	ID = user.ID;
	Name = user.Name;
	Password = user.Password;
	Profile = user.Profile;
	Favicon = user.Favicon;
	Permission = user.Permission;
}
User& User::operator =(const User& user)
{
	ID = user.ID;
	Name = user.Name;
	Password = user.Password;
	Profile = user.Profile;
	Favicon = user.Favicon;
	Permission = user.Permission;
	return *this;
}
User::~User()
{
}
QJsonObject User::ConversionJson()
{
	QJsonObject json;
	json.insert("UserID", ID);
	json.insert("UserName", Name);
	//json.insert("UserPassword", Password);
	json.insert("UserProfile", Profile);
	if (Favicon.isEmpty())
		json.insert("UserFavicon", "-1.svg");
	else
		json.insert("UserFavicon", Favicon);
	json.insert("UserPermission", Permission);
	return json;
}