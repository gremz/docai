/*global Backbone, jQuery, _, ENTER_KEY */
var app = app || {};

(function ($) {
	'use strict';

	// The Application
	// ---------------

	// Our overall **AppView** is the top-level piece of UI.
	app.AppView = Backbone.View.extend({

		// Instead of generating a new element, bind to the existing skeleton of
		// the App already present in the HTML.
		el: '#ytfaves',

		// Our template for the line of statistics at the bottom of the app.
		statsTemplate: _.template($('#stats-template').html()),

		// Delegated events for creating new videos
		events: {
			'keypress #new-vid': 'createOnEnter',
		},

		// At initialization we bind to the relevant events on the `Videos`
		// collection, when items are added or changed. Kick things off by
		// loading any preexisting videos that might be saved in *Firebase*.
		initialize: function () {
			this.$input = this.$('#new-vid');
			this.$nav = this.$('nav');
			this.$main = this.$('#main');
			this.$list = $('#vid-list');
			this.$errorContainer = $('.errorContainer');
			this.$successContainer = $('.successContainer');

			this.listenTo(app.videos, 'add', this.addOne);
			this.listenTo(app.videos, 'reset', this.addAll);
			this.listenTo(app.videos, 'change:likes', this.filterOne);
			this.listenTo(app.videos, 'filter sync', this.filterAll);
			// this.listenTo(app.videos, 'invalid', this.showBannerError);
			this.listenTo(app.videos, 'all', _.debounce(this.render, 0));

			this.listenTo(app.pendingVideos, 'invalid', this.showBannerError);
			// no fetch needed with *Firebase* autoSync = true
		},

		// Re-rendering the App just means refreshing the statistics -- the rest
		// of the app doesn't change.
		render: function () {
			var filterTotal = app.VideoFilter == 'liked' ? app.videos.mostLiked().length : app.videos.length,
				watched; // TODO

			if (filterTotal) {
				this.$main.show();
				this.$nav.show();

				this.$nav.html(this.statsTemplate({
					total: filterTotal,
					watched: 0 // TODO
				}));

				this.$('#filters li a')
					.removeClass('selected')
					.filter('[href="#/' + (app.VideoFilter || '') + '"]')
					.addClass('selected');
			} else {
				this.$main.hide();
				this.$nav.hide();
			}
		},

		// Add a single video item to the list by creating a view for it, and
		// prepending its element to the `<ul>`.
		addOne: function (video) {
			var view = new app.VideoView({ model: video });
			this.$list.prepend(view.render().el);
		},

		// Add all items in the **videos** collection at once.
		addAll: function () {
			this.$list.html('');
			app.videos.each(this.addOne, this);
		},

		// decide if video should be shown
		filterOne: function (video) {
			video.trigger('showhide');
		},

		// display videos based on filter
		filterAll: function () {
			switch (app.VideoFilter) {
				case 'liked':
					app.videos.sortMostLiked();
					break;
				case 'watched':
					// TODO
					break;
				default:
					app.videos.sortRecent();
					break;
			}
			app.videos.trigger('reset');
			app.videos.each(this.filterOne, this);
		},

		// Generate the attributes for a new Video item.
		newAttributes: function () {
			return {
				url: this.$input.val().trim(),
				order: app.pendingVideos.nextOrder(),
				likes: 0
			};
		},

		// If you hit return in the main input field, create new **Video** model,
		createOnEnter: function (e) {
			if (e.which === ENTER_KEY && this.$input.val().trim()) {
				var video = new app.Video(this.newAttributes());

				if (video.isValid()) {
					app.pendingVideos.create(this.newAttributes());
					this.showBannerSuccess(video, 'Your link has been submitted for approval');
					this.$input.val('');
				} else {
				}
			}
		},

		showBannerSuccess: function(model, message) {
			console.log(arguments);
			var view = this,
				successContainer = _.template($('#success-template').html());

			this.$errorContainer.append(successContainer({ message: message}));
			setTimeout(function() {
				view.$errorContainer.children().first().remove();
			}, 5000);
		},

		showBannerError: function(model, error) {
			var view = this,
				errorContainer = _.template($('#error-template').html());

			this.$errorContainer.append(errorContainer({error: error}));
			setTimeout(function() {
				view.$errorContainer.children().first().remove();
			}, 5000);
		}
	});
})(jQuery);
