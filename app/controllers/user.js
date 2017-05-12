var User = require('../models/user');

exports.showSignup = function*(next) {
	yield this.render('pages/signup', {
		title: '注册页面'
	});
};

exports.showSignin = function*(next) {
	yield this.render('pages/signin', {
		title: '登录页面'
	});
};

exports.signup = function*(next) {
	var _user = this.request.body.user;
	var user = yield User.findOne({
		name: _user.name
	}).exec();

	if (user) {
		this.redirect('/signin');
		return next;
	} else {
		var user = new User(_user);
		yield user.save();
		this.session.user = user;
		this.redirect('/');
	}
};

exports.signin = function*(next) {
	var _user = this.request.body.user;
	var name = _user.name;
	var password = _user.password;

	var user = yield User.findOne({
		name: name
	}).exec();
	if (!user) {
		this.redirect('/signup');
		return next;
	}

	var isMatch = yield user.comparePassword(password, user.password);
	if (isMatch) {
		this.session.user = user;
		this.redirect('/');
	} else {
		this.redirect('/signin');
	}
};

exports.logout = function*(next) {
	delete this.session.user;
	this.redirect('/');
};

exports.list = function*(next) {
	var users = yield User
		.find({})
		.sort('meta.updateAt')
		.exec();

	yield this.render('pages/userlist', {
		title: 'imooc 用户列表页',
		users: users
	});
};

exports.signinRequired = function*(next) {
	var user = this.session.user;
	if (!user) {
		this.redirect('/signin');
	} else {
		yield next;
	}
};

exports.adminRequired = function*(next) {
	var user = this.session.user;
	if (user.role <= 10) {
		this.redirect('/signin');
	} else {
		yield next;
	}
};