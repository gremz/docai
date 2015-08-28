/*global Backbone */
var app = app || {};

(function () {
	'use strict';

	// Video Model
	// ----------

	// Our basic **Video** model
	app.Video = Backbone.Model.extend({

		// when a video is added generate a yt_id and get title/thumbnail data
		initialize: function() {
			this.on('add', function() {
				!this.get('yt_id') && this.setYtData();
			});
		},

		defaults: {
			title: '',
			yt_id: '',
			url: '',
			thumbnail: '',
			likes: 0
		},

		// Add the `like` state of this video.
		addLike: function () {
			this.save({
				likes: this.get('likes') + 1
			});
		},

		// return a yt_id based on url
		generateYtId: function(url) {
			return (url || '').match(/v=(.*)$/)[1];
		},

		setYtData: function() {
			var model = this,
				yt_id = this.generateYtId(model.get('url'));

			$.get('https://www.googleapis.com/youtube/v3/videos?part=snippet&id=' + 
				yt_id + '&key=AIzaSyA_RmWcwKvNhUqy8A9hhDx4zY0255daCRU')
					.done(function(data) {
						var vid = data.items[0].snippet;
						model.save({
							yt_id: yt_id,
							title: vid.title,
							thumbnail: vid.thumbnails.high.url });
					});
		}
	});
})();
