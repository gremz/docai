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
		mostLiked: function () {
			// return this.where({completed: true});
			return this.orderByChild('mostLiked');
		},

		// Filter down the list to only todo items that are still not finished.
		remaining: function () {
			return this.where({completed: false});
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
