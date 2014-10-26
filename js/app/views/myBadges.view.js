/* -- MY BADGES VIEW -- */
/* -------------------- */
/*
 *  Declares and returns the Earned Badges View.
 *	
 */

var MyBadgesView = Backbone.View.extend({

	template: "",

	initialize: function () {
		var self = this;

		$.ajax("tpl/myBadges.html")
		.done(function (html) {
			self.template = _.template(html);
			self.render();	
		});
	},

	render: function () {
		var data = [];

		//Retrieve data
		if(window.localStorage.getItem('earned-badges')){
			var myBadges = JSON.parse(window.localStorage.getItem('earned-badges'));
		}

		for (var i = 0; i < _badges.length; i++) {
			data.push(_badges[i]);
			if(_.contains(myBadges, _badges[i].id)){
				data[i].earned = true;
			}
			else
				data[i].earned = false;
		}

		console.log(data);

		this.$el.html(this.template({data: data}));
	},

	events:{
		'click .badge-el': 'showBadgeDetail'
	},

	showBadgeDetail: function (e) {
		//Get the name
		var id = e.currentTarget.id;

		//Route to Dish Detail Page
		//this.undelegateEvents();
		Backbone.history.navigate('badge/' + id, {trigger: true});
	}
});