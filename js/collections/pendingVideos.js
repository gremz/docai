/*global Backbone */
var app = app || {};

(function () {
	'use strict';

	// Todo Collection
	// ---------------

	// The collection of videos is backed by *Firebase*
	var PendingVideos = Backbone.Firebase.Collection.extend({
		// Reference to this collection's model.
		model: app.Video,

		url: 'https://docai.firebaseio.com/videos/pending',

		initialize: function() {
			this.on('all', function(event) {
				console.log(event);
			});

			// this.on('sync', function(model) {
			// 	!model.isValid() && model.remove();
			// })
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
	app.pendingVideos = new PendingVideos();
})();
