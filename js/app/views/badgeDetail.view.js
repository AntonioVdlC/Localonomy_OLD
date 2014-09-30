/* -- BADGE DETAIL VIEW -- */
/* ----------------------- */
/*
 *  Declares the Badge Detail View.
 *	
 */

var BadgeDetailView = Backbone.View.extend({

	template: "",

	initialize: function (options) {
		var self = this;

		$.ajax("tpl/badgeDetail.html")
		.done(function (html) {
			self.template = _.template(html);
			self.render(options.id);	
		});
	},

	render: function (id) {
		for (var i = 0; i < _badges.length; i++) {
			if(_badges[i].id == id)
				var badge = _.clone(_badges[i]);
		}

		this.$el.html(this.template({badge: badge}));
	},

	events:{
	
	}
});