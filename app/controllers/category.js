'use strict'
var Category = require('../models/category');

exports.new = function*(next) {
	yield this.render('pages/category_admin', {
		title: '后台分类录入页',
		category: {}
	});
};

exports.save = function*(next) {
	var _category = this.request.body.category;
	var category = new Category(_category);

	yield category.save();
	this.redirect('/admin/category/list');
};

exports.list = function*(next) {
	var categories = yield Category.find({}).exec();
	yield this.render('pages/categorylist', {
		title: '分类列表页',
		categories: categories
	});
};