/*global Backbone */
var app = app || {};

(function () {
	'use strict';

	// Video Model
	// ----------

	// Our basic **Video** model
	app.Video = Backbone.Model.extend({
		initialize: function() {
			this.on('add change:url', function() {
				this.set({ yt_id: this.get('url').match(/v=(.*)$/)[1] });
				this.getYtData();
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
		getYtData: function() {
			var model = this;

			$.get('https://www.googleapis.com/youtube/v3/videos?part=snippet&id=' + 
				this.get('yt_id') + '&key=AIzaSyA_RmWcwKvNhUqy8A9hhDx4zY0255daCRU')
					.done(function(data) {
						var vid = data.items[0].snippet;
						model.save({ 
							title: vid.title,
							thumbnail: vid.thumbnails.high.url });
					});
		}
	});
})();
