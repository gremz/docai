/*global Backbone */
var app = app || {};

(function () {
	'use strict';

	// Todo Model
	// ----------

	// Our basic **Todo** model has `title`, `order`, and `completed` attributes.
	app.Todo = Backbone.Model.extend({
		initialize: function() {
			this.on('add change:url', function() {
				this.set({ yt_id: this.get('url').match(/v=(.*)$/)[1] });
				this.getYtData();
			});
		},
		// Default attributes for the todo
		// and ensure that each todo created has `title` and `completed` keys.
		defaults: {
			title: '',
			yt_id: '',
			url: '',
			thumbnail: '',
			completed: false
		},

		// Toggle the `completed` state of this todo item.
		toggle: function () {
			this.save({
				completed: !this.get('completed')
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
