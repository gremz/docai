/*global Backbone */
var app = app || {};

(function () {
	'use strict';

	// Todo Collection
	// ---------------

	// The collection of videos is backed by *Firebase*
	var Videos = Backbone.Firebase.Collection.extend({
		// Reference to this collection's model.
		model: app.Video,

		url: 'https://docai.firebaseio.com/videos',

		// Filter down the list of all video items that are top rated.
		mostLiked: function() {
			// console.log('mostLiked video likes: ', video.get(''))
			return this.filter(function(video) {
				return video.get('likes') > 0;
			});
		},

		sortMostLiked: function () {
			app.videos.comparator = 'likes';
			app.videos.sort();
		},

		sortRecent: function() {
			app.videos.comparator = 'order';
			app.videos.sort();
		},

		// Filter down the list to only todo items that are still not finished.
		watched: function () {
			// TODO
		},

		// We keep the Videos in sequential order, despite being saved by unordered
		// GUID in the database. This generates the next order number for new items.
		nextOrder: function () {
			return this.length ? this.last().get('order') + 1 : 1;
		},

		// Videos are sorted by their original insertion order.
		comparator: 'order'
	});

	// Create our global collection of **Videos**.
	app.videos = new Videos();
})();
