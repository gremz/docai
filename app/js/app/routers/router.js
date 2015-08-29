/*global Backbone */
var app = app || {};

(function () {
	'use strict';

	// Video Router
	// ----------
	var VideoRouter = Backbone.Router.extend({
		routes: {
			'*filter': 'setFilter'
		},

		setFilter: function (param) {

			// Set the current filter to be used
			app.VideoFilter = param || '';

			// Trigger a collection filter to sort/filter Videos
			app.videos.trigger('filter');
		}
	});

	app.VideoRouter = new VideoRouter();
	Backbone.history.start();
})();
