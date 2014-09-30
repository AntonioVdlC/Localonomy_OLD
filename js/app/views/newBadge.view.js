/* -- NEW BADGE VIEW -- */
/* -------------------- */
/*
 *  Declares and returns the New Badge View.
 *	
 */

var NewBadgeView = Backbone.View.extend({

	template: "",

	initialize: function (options) {
		var self = this;

		$.ajax("tpl/newBadge.html")
		.done(function (html) {
			self.template = _.template(html);
			self.render(JSON.parse(options.badges));	
		});
	},

	render: function (newBadges) {
		//Select the earned badges
		var badges = [];
		for (var i = 0; i < _badges.length; i++) {
			if(_.contains(newBadges, _badges[i].id))
				badges.push(_badges[i]);
		}

		this.$el.html(this.template({badges: badges}));
	},

	events:{
		'click .continue-button': 'onContinue'
	},

	onContinue: function (e) {
		var next = false;
		var oldID;
		var newID;

		$(".badge-info").each(function (index, value) {
			if($(this).css('display') == 'block' && $(this).next().css('display') == 'none'){
				next = true;
				oldID = $(this).attr("id");
				newID = $(this).next().attr("id");
			}
		});

		//If several badges, display next badge!
		if(next){
			$("#" + oldID).hide();
			$("#" + newID).show();
		}

		//Else, back to the dish detail page
		else{	
			//this.undelegateEvents();
			window.history.go(-2); 	
		}
	}
});