'use strict'

var Index = require('../app/controllers/index');
var User = require('../app/controllers/user');
var Movie = require('../app/controllers/movie');
var convert = require('koa-convert');
var Comment = require('../app/controllers/comment');
var Game = require('../app/controllers/game');
var Wechat = require('../app/controllers/wechat');
var Category = require('../app/controllers/category');
var koaBody = require('koa-body');

module.exports = function(router) {
	router.get('/', convert(Index.index));

	router.post('/user/signup', convert(User.signup));
	router.post('/user/signin', convert(User.signin));
	router.get('/signin', convert(User.showSignin));
	router.get('/signup', convert(User.showSignup));
	router.get('/logout', convert(User.logout));
	router.get('/admin/user/list', convert(User.signinRequired), convert(User.adminRequired), convert(User.list));

	//wx
	router.get('/wechat/movie', convert(Game.guess));
	router.get('/wechat/movie/:id', convert(Game.find));
	router.get('/wechat/jump/:id', convert(Game.jump));
	router.get('/wx', convert(Wechat.hear));
	router.post('/wx', convert(Wechat.hear));

	router.get('/movie/:id', convert(Movie.detail));
	router.get('/admin/movie/new', convert(User.signinRequired), convert(User.adminRequired), convert(Movie.new));
	router.get('/admin/movie/update/:id', convert(User.signinRequired), convert(User.adminRequired), convert(Movie.update));
	router.post('/admin/movie', convert(User.signinRequired), convert(User.adminRequired), convert(koaBody({
		multipart: true
	})), convert(Movie.savePoster), convert(Movie.save));
	router.get('/admin/movie/list', convert(User.signinRequired), convert(User.adminRequired), convert(Movie.list));
	router.delete('/admin/movie/list', convert(User.signinRequired), convert(User.adminRequired), convert(Movie.del));

	router.post('/user/comment', convert(User.signinRequired), convert(Comment.save));

	router.get('/admin/category/new', convert(User.signinRequired), convert(User.adminRequired), convert(Category.new));
	router.post('/admin/category', convert(User.signinRequired), convert(User.adminRequired), convert(Category.save));
	router.get('/admin/category/list', convert(User.signinRequired), convert(User.adminRequired), convert(Category.list));

	router.get('/results', convert(Index.search));

};