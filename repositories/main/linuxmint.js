var async = require('async');
var sugar = require('sugar');

function first(a) { return a[0]; }
module.exports = function(request,callback) {
	var distributionurl = 'http://mirrors.kernel.org/linuxmint/stable/';
	request.dom(distributionurl,function(err,$) {
		var versions = $('pre a').map(function(a) {
			return (/^\d+(\.\d+)*/).exec(a.attr('href'));
		}).compact().map(first);
		var distribution = {
			id: 'linuxmint',
			name: 'Linux Mint',
			url: 'http://www.linuxmint.com/'
		};

		async.map(versions,function(version,callback) {
			var isosurl = distributionurl+version+'/';
			request.dom(isosurl,function(err,$) {
				var urls = $('pre a').map(function(a) {
					return a.attr('href');
				}).compact().filter(function(filename) {
					return (/\.iso$/).test(filename);
				}).map(function(filename) {
					return isosurl + filename;
				});
				async.map(urls,function(url,callback) {
					request.contentlength(url,function(err,contentLength) {
						if (err) { return callback(err); }
						var release = {
							version: version,
							url: url,
							size: contentLength
						};
						var archMatch = /[-\.](32bit|64bit)[-\.]/.exec(release.url);
						if (archMatch) { release.arch = archMatch[1]; }
						callback(null,release);
					});
				},callback);
			});
		},function(err,releases) {
			distribution.releases = releases.flatten();
			callback(null,distribution);
		});
	});
};