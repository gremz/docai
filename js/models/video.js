/*global Backbone */
var app = app || {};

(function () {
	'use strict';

	// Video Model
	// ----------

	// Our basic **Video** model
	app.Video = Backbone.Model.extend({

		// generate data if video was just created
		initialize: function() {
			this.on('add', function() {
				if (!this.get('yt_id')) {
					if (!this.isValid()) {
						// this.trigger('remove');
					} else {
						this.setYtData();
					}
				}
			});

			this.on('invalid', function(model, error) {
				app.pendingVideos.trigger('invalid', this, error);
			});
		},

		defaults: {
			title: '',
			yt_id: '',
			url: '',
			thumbnail: '',
			likes: 0
		},

		ytRegExp: /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/,

		validate: function(attrs, options) {
			if (!(attrs.url.match(this.ytRegExp) || []).length)
				return 'The link you provided doesn\'t appear to be valid';
		},

		// Increase like by 1
		addLike: function () {
			this.save({
				likes: this.get('likes') + 1
			});
		},

		// return a yt_id based on url
		generateYtId: function(url) {
			return (url || '').match(this.ytRegExp)[1];
		},

		// fetch YouTube data based on yt_id and save
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
