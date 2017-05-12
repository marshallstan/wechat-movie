'use strict'

var Koa = require('koa');
var Router = require('koa-router');
var convert = require('koa-convert');
var fs = require('fs');
var mongoose = require('mongoose');
var env = process.env.NODE_ENV || 'development';

var dbUrl = 'mongodb://wechat_runner:777@127.0.0.1:19999/wechat';

if (env === 'development') {
	dbUrl = 'mongodb://localhost:12345/imooc';
}

mongoose.Promise = require('bluebird');
mongoose.connect(dbUrl);

//models loading
var models_path = __dirname + '/app/models';
var walk = function(path) {
	fs
		.readdirSync(path)
		.forEach(function(file) {
			var newPath = path + '/' + file;
			var stat = fs.statSync(newPath);
			if (stat.isFile()) {
				if (/(.*)\.(js|coffee)/.test(file)) {
					require(newPath);
				}
			} else if (stat.isDirectory()) {
				walk(newPath);
			}
		});
};
walk(models_path);
//loadin end

var menu = require('./wx/menu');
var wx = require('./wx/index');
var wechatApi = wx.getWechat();

wechatApi.deleteMenu().then(function() {
	return wechatApi.createMenu(menu);
}).then(function(msg) {
	// console.log(msg);
});

var session = require('koa-session');
var app = new Koa();
var router = new Router();
var bodyParser = require('koa-bodyparser');
var User = mongoose.model('User');
var views = require('koa-views');
var moment = require('moment');

app.use(views(__dirname + '/app/views', {
	extension: 'jade'
}));

app.keys = ['wechatMovie'];
app.use(session(app));

app.use(bodyParser());
app.use(convert(function*(next) {
	this.state.moment = moment;
	var user = this.session.user;
	if (user && user._id) {
		this.session.user = yield User.findOne({
			_id: user._id
		}).exec();
		this.state.user = this.session.user;
	} else {
		this.state.user = null;
	}
	yield next;
}));

require('./config/routes')(router);
app
	.use(router.routes())
	.use(router.allowedMethods());

app.listen(3004, function() {
	console.log('Listening: 3004');
});