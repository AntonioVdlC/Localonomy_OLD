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
			self.render(options.badges);	
		});
	},

	render: function (newBadges) {
		var badges = JSON.parse(newBadges);

		//Select the earned badges
		var earnedBadges = [];
		for (var i = 0; i < _badges.length; i++) {
			if(_.contains(badges, _badges[i].id))
				earnedBadges.push(_badges[i]);
		}

		this.$el.html(this.template({badges: earnedBadges}));
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