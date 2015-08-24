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

		// Delegated events for creating new items, and clearing completed ones.
		events: {
			'keypress #new-vid': 'createOnEnter',
			'click #clear-completed': 'clearCompleted',
		},

		// At initialization we bind to the relevant events on the `Videos`
		// collection, when items are added or changed. Kick things off by
		// loading any preexisting videos that might be saved in *localStorage*.
		initialize: function () {
			this.$input = this.$('#new-vid');
			this.$footer = this.$('#footer');
			this.$main = this.$('#main');
			this.$list = $('#vid-list');

			this.listenTo(app.videos, 'add', this.addOne);
			this.listenTo(app.videos, 'reset', this.addAll);
			this.listenTo(app.videos, 'change:likes', this.filterOne);
			this.listenTo(app.videos, 'filter', this.filterAll);
			this.listenTo(app.videos, 'all', _.debounce(this.render, 0));



			// Suppresses 'add' events with {reset: true} and prevents the app view
			// from being re-rendered for every model. Only renders when the 'reset'
			// event is triggered at the end of the fetch.
			app.videos.fetch({reset: true});
			// view.fetch();
		},

		fetch: function() {
			$.get('https://www.reddit.com/r/Documentaries.json')
				.done(function(data) {
					var vids = data.data.children;
				});
		},

		// Re-rendering the App just means refreshing the statistics -- the rest
		// of the app doesn't change.
		render: function () {
			var completed = app.videos.completed().length;
			var remaining = app.videos.remaining().length;

			if (app.videos.length) {
				this.$main.show();
				this.$footer.show();

				this.$footer.html(this.statsTemplate({
					completed: completed,
					remaining: remaining
				}));

				this.$('#filters li a')
					.removeClass('selected')
					.filter('[href="#/' + (app.TodoFilter || '') + '"]')
					.addClass('selected');
			} else {
				this.$main.hide();
				this.$footer.hide();
			}
		},

		// Add a single video item to the list by creating a view for it, and
		// appending its element to the `<ul>`.
		addOne: function (video) {
			var view = new app.VideoView({ model: video });
			this.$list.prepend(view.render().el);
		},

		// Add all items in the **videos** collection at once.
		addAll: function () {
			this.$list.html('');
			app.videos.each(this.addOne, this);
		},

		filterOne: function (video) {
			video.trigger('liked');
		},

		filterAll: function () {
			app.videos.each(this.filterOne, this);
		},

		// Generate the attributes for a new Todo item.
		newAttributes: function () {
			return {
				url: this.$input.val().trim(),
				order: app.videos.nextOrder(),
				likes: 0
			};
		},

		// If you hit return in the main input field, create new **Video** model,
		createOnEnter: function (e) {
			if (e.which === ENTER_KEY && this.$input.val().trim()) {
				app.videos.create(this.newAttributes());
				this.$input.val('');
			}
		},

		// Clear all completed video items, destroying their models.
		// clearCompleted: function () {
		// 	_.invoke(app.videos.completed(), 'destroy');
		// 	return false;
		// }
	});
})(jQuery);
