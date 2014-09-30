/* -- USER VIEW -- */
/* --------------- */
/*
 *  Declares and returns the User View.
 *	
 */

var UserView = Backbone.View.extend({

	template: "",

	initialize: function () {
		var self = this;

		$.ajax("tpl/user.html")
		.done(function (html) {
			self.template = _.template(html);
			self.render();	
		});
	},

	render: function () {
		var data = {};

		//Retrieve the number of dishes and badges earned
		data.dishes = (_.keys(JSON.parse(window.localStorage.getItem('tasted-dishes')))).length;
		data.badges = (_.keys(JSON.parse(window.localStorage.getItem('earned-badges')))).length;

		//TODO: Facebook connect

		this.$el.html(this.template({data: data}));
	},

	events:{
		'click #tasted-dishes-list-button': 'tastedDishesList',
		'click #earned-badges-list-button': 'earnedBadgesList',
		'click #fb-connect': 'facebookConnect'
	},

	tastedDishesList: function (e) {
		//Route to the tasted dishes list
		//this.undelegateEvents();
		Backbone.history.navigate('user/dishes/', {trigger: true});
	},

	earnedBadgesList: function (e) {
		//Route to the tasted dishes list
		//this.undelegateEvents();
		Backbone.history.navigate('user/badges/', {trigger: true});
	},

	facebookConnect: function (e) {
		// TODO
	}
});