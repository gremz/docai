/*global Backbone, jQuery, _, ENTER_KEY, ESC_KEY */
var app = app || {};

(function ($) {
	'use strict';

	// Video Item View
	// --------------

	// The DOM element for a video item...
	app.VideoView = Backbone.View.extend({
		//... is a list tag.
		tagName:  'li',

		// Cache the template function for a single item.
		template: _.template($('#item-template').html()),

		// The DOM events specific to an item.
		events: {
			'click .heart': 'addLike',
			'dblclick label': 'edit',
			'click .destroy': 'clear',
			'keypress .edit': 'updateOnEnter',
			'keydown .edit': 'revertOnEscape',
			'blur .edit': 'close',
			'click .play-button': 'loadYtIFrame'
		},

		// The VideoView listens for changes to its model, re-rendering. Since
		// there's a one-to-one correspondence between a **Video** and a
		// **VideoView** in this app, we set a direct reference on the model for
		// convenience.
		initialize: function () {
			this.listenTo(this.model, 'change', this.render);
			this.listenTo(this.model, 'destroy', this.remove);
			this.listenTo(this.model, 'showhide', this.toggleView);
		},

		// Re-render the titles of the todo item.
		render: function () {
			// Backbone LocalStorage is adding `id` attribute instantly after
			// creating a model.  This causes our VideoView to render twice. Once
			// after creating a model and once on `id` change.  We want to
			// filter out the second redundant render, which is caused by this
			// `id` change.  It's known Backbone LocalStorage bug, therefore
			// we've to create a workaround.
			// https://github.com/tastejs/todomvc/issues/469
			if (this.model.changed.id !== undefined) {
				return;
			}

			this.$el.html(this.template(this.model.toJSON()));
			// this.$el.toggleClass('liked', this.isLiked());
			this.$input = this.$('.edit');
			return this;
		},

		toggleView: function () {
			switch (app.VideoFilter) {
				case 'liked':
					this.$el.toggleClass('hidden', !this.isLiked());
					break;
				case 'watched':
					// TODO
					break;
				default:
					this.$el.toggleClass('hidden', false);
					break;
			}
		},

		isLiked: function () {
			return this.model.get('likes') > 0;
		},

		// Add like to model.
		addLike: function () {
			this.model.addLike();
		},

		// Switch this view into `"editing"` mode, displaying the input field.
		edit: function () {
			this.$el.addClass('editing');
			this.$input.focus();
		},

		// Close the `"editing"` mode, saving changes to the todo.
		close: function () {
			var value = this.$input.val();
			var trimmedUrl = value.trim();

			// We don't want to handle blur events from an item that is no
			// longer being edited. Relying on the CSS class here has the
			// benefit of us not having to maintain state in the DOM and the
			// JavaScript logic.
			if (!this.$el.hasClass('editing')) {
				return;
			}

			if (trimmedUrl) {
				this.model.save({ url: trimmedUrl });

				if (value !== trimmedUrl) {
					// Model values changes consisting of whitespaces only are
					// not causing change to be triggered Therefore we've to
					// compare untrimmed version with a trimmed one to check
					// whether anything changed
					// And if yes, we've to trigger change event ourselves
					this.model.trigger('change');
				}
			} else {
				this.clear();
			}

			this.$el.removeClass('editing');
		},

		// If you hit `enter`, we're through editing the item.
		updateOnEnter: function (e) {
			if (e.which === ENTER_KEY) {
				this.close();
			}
		},

		// If you're pressing `escape` we revert your change by simply leaving
		// the `editing` state.
		revertOnEscape: function (e) {
			if (e.which === ESC_KEY) {
				this.$el.removeClass('editing');
				// Also reset the hidden input back to the original value.
				this.$input.val(this.model.get('title'));
			}
		},

		// Remove the item, destroy the model from *localStorage* and delete its view.
		clear: function () {
			this.model.destroy();
		},
		loadYtIFrame: function() {
			// window.location = this.model.get('url');
			this.$el.find('.thumbnail-container').html('<iframe id="ytplayer" type="text/html" ' + 
				'src="http://www.youtube.com/embed/' + this.model.get('yt_id') + 
				'?autoplay=1&fs=1&origin=http://ssor.local.assets" frameborder="0"/>');
		}
	});
})(jQuery);
