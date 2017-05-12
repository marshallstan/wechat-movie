'use strict'
var Movie = require('../app/api/movie');
var help = '感谢订阅iMovieStan公众号\n' +
	'回复 1~3, 测试文字回复\n' +
	'回复 4, 测试图文回复\n' +
	'回复 首页, 进入电影首页\n' +
	'回复 电影名字, 查询电影信息\n' +
	'回复 语音, 查询电影信息\n' +
	'也可以点击<a href="http://wechat.marshallstan.club/wechat/movie">语音查电影</a>';

exports.reply = function*(next) {
	var message = this.weixin;
	if (message.MsgType === 'event') {
		if (message.Event === 'subscribe') {
			this.body = help;
		} else if (message.Event === 'unsubscribe') {
			console.log('这个娃儿取关了！');
			this.body = '';
		} else if (message.Event === 'LOCATION') {
			console.log('地理位置！');
			this.body = '你娃娃上报的位置是: ' + message.Latitude + '/' + message.Longitude + '-' + message.Precision;
		} else if (message.Event === 'CLICK') {
			var news = [];
			if (message.EventKey === 'movie_hot') {
				let movies = yield Movie.findHotMovies(-1, 8);
				movies.forEach(function(movie) {
					news.push({
						title: movie.title,
						description: movie.original_title,
						picUrl: movie.poster,
						url: 'http://wechat.marshallstan.club/wechat/jump/' + movie._id
					});
				});
			} else if (message.EventKey === 'movie_cold') {
				let movies = yield Movie.findHotMovies(1, 8);
				movies.forEach(function(movie) {
					news.push({
						title: movie.title,
						description: movie.original_title,
						picUrl: movie.poster,
						url: 'http://wechat.marshallstan.club/wechat/jump/' + movie._id
					});
				});
			} else if (message.EventKey === 'movie_crime') {
				let cat = yield Movie.findMovieByCate('犯罪');
				if (cat && cat.movies && cat.movies.length > 0) {
					cat.movies = cat.movies.slice(0, 8);
					cat.movies.forEach(function(movie) {
						news.push({
							title: movie.title,
							description: movie.original_title,
							picUrl: movie.poster,
							url: 'http://wechat.marshallstan.club/wechat/jump/' + movie._id
						});
					});
				} else {
					news = '此分类下暂时没有电影数据';
				}
			} else if (message.EventKey === 'movie_cartoon') {
				let cat = yield Movie.findMovieByCate('动画');
				if (cat && cat.movies && cat.movies.length > 0) {
					cat.movies = cat.movies.slice(0, 8);
					cat.movies.forEach(function(movie) {
						news.push({
							title: movie.title,
							description: movie.original_title,
							picUrl: movie.poster,
							url: 'http://wechat.marshallstan.club/wechat/jump/' + movie._id
						});
					});
				} else {
					news = '此分类下暂时没有电影数据';
				}
			} else if (message.EventKey === 'help') {
				news = help;
			}
			this.body = news;
		} else {
			this.body = ''; /*未定义类型*/
		}
	} else if (message.MsgType === 'voice') {
		var reply = '你说的 ' + message.Content + ' 有点复杂！';
		var voiceText = message.Recognition;
		var movies = yield Movie.searchByName(voiceText);
		if (!movies || movies.length === 0) {
			movies = yield Movie.searchByDouban(voiceText);
		}
		if (movies && movies.length > 0) {
			reply = [];
			movies = movies.slice(0, 8);
			movies.forEach(function(movie) {
				reply.push({
					title: movie.title,
					description: movie.original_title,
					picUrl: movie.poster,
					url: 'http://wechat.marshallstan.club/wechat/jump/' + movie._id
				});
			});
		} else {
			reply = 'Oops! 没有查询到与 ' + voiceText + ' 匹配的电影';
		}
		this.body = reply;
	} else if (message.MsgType === 'text') {
		var content = message.Content;
		var reply = '你说的 ' + message.Content + ' 有点复杂！';
		if (content === '1') {
			reply = '第一';
		} else if (content === '2') {
			reply = '第二';
		} else if (content === '3') {
			reply = '第三';
		} else if (content === '4') {
			reply = [{
				title: 'marshall',
				description: 'mathers',
				picUrl: 'https://img01.sogoucdn.com/app/a/100520122/461fcfb6_fangaomac.jpg',
				url: 'http://www.baidu.com'
			}, {
				title: 'marshall',
				description: 'mathers',
				picUrl: 'https://img01.sogoucdn.com/app/a/100520122/461fcfb6_fangaomac.jpg',
				url: 'http://pan.baidu.com/s/1hsQLwUg'
			}];
		} else {
			var movies = yield Movie.searchByName(content);
			if (!movies || movies.length === 0) {
				movies = yield Movie.searchByDouban(content);
			}
			if (movies && movies.length > 0) {
				reply = [];
				movies = movies.slice(0, 8);
				movies.forEach(function(movie) {
					reply.push({
						title: movie.title,
						description: movie.original_title,
						picUrl: movie.poster,
						url: 'http://wechat.marshallstan.club/wechat/jump/' + movie._id
					});
				});
			} else {
				reply = 'Oops! 没有查询到与 ' + content + ' 匹配的电影';
			}
		}
		this.body = reply;
	} else {
		this.body = 'empty 耍你的！';
	}
	yield next;
};