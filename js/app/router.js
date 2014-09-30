/* -- BACKBONE ROUTER -- */
/* --------------------- */
/*
 *  Declares a Backbone Router.
 *	
 */

var Router = Backbone.Router.extend({

	homeView: null,
	dishListView: null,
	dishDetailView: null,
	checkInView: null,
	newBadgeView: null,
	userView: null,
	tastedDishesView: null,
	myBadgesView: null,
	badgeDetalView: null,

	routes: {
		'' : 'homePage',
		'country/:name': 'dishList',
		'dish/:id': 'dishDetail',
		'checkin/:id': 'checkIn',
		'newbadge/:badges': 'newBadge',
		'user/': 'userPage',
		'user/dishes/': 'tastedDishes',
		'user/badges/': 'myBadges',
		'badge/:id': 'badgeDetail'
	},

	homePage: function (){
		console.log("Routing to home ...");
	
		$(".back-button").css("visibility", "hidden");
		$("body").off("touchend", ".nav-bar");

		if(this.homeView)
			this.homeView.render();
		else
			this.homeView = new HomeView({el:$("#content")});
	},

	dishList: function (name) {
		console.log("Routing to dish list from country: " + name);

		$(".back-button").css("visibility", "visible");

		$("body").off("touchend", ".nav-bar");
		$("body").on("touchend", ".nav-bar", function (e) {
		    e.preventDefault();
		    window.history.back();
		});

		if(this.dishListView)
			this.dishListView.render(name);
		else
			this.dishListView = new DishListView({el:$("#content"), country: name});
	},

	dishDetail: function (name) {
		console.log("Routing to dish: " + name);

		$(".back-button").css("visibility", "visible");

		$("body").off("touchend", ".nav-bar");
		$("body").on("touchend", ".nav-bar", function (e) {
		    e.preventDefault();
		    window.history.back();
		});

		if (this.dishDetailView)
			this.dishDetailView.render(name);
		else
			this.dishDetailView = new DishDetailView({el:$("#content"), dish: name});
	},

	checkIn: function (id) {
		console.log("Routing to checkin: " + id);

		if (this.checkInView)
			this.checkInView.render(id);
		else
			this.checkInView = new CheckInView({el:$("#content"), id: id});
	},

	newBadge: function (badges) {
		console.log("Routing to new badge: " + badges);
		
		$(".back-button").css("visibility", "hidden");
		$("body").off("touchend", ".nav-bar");

		if(this.newBadgeView)
			this.newBadgeView.render(badges);
		else
			this.newBadgeView = new NewBadgeView({el:$("#content"), badges: badges});
	},

	userPage: function () {
		console.log("Routing to user page ...");

		$(".back-button").css("visibility", "visible");

		$("body").off("touchend", ".nav-bar");
		$("body").on("touchend", ".nav-bar", function (e) {
		    e.preventDefault();
		    window.history.back();
		});

		if(this.userView)
			this.userView.render();
		else
			this.userView = new UserView({el:$("#content")});
	},

	tastedDishes: function () {
		console.log("Routing to tasted dishes ...");

		if(this.tastedDishesView)
			this.tastedDishesView.render();
		else
			this.tastedDishesView = new TastedDishesView({el:$("#content")});
	},

	myBadges: function () {
		console.log("Routing to my badges ...");

		if(this.myBadgesView)
			this.myBadgesView.render();
		else
			this.myBadgesView = new MyBadgesView({el:$("#content")});
	},

	badgeDetail: function (id) {
		console.log("Routing to badge: " + id);

		if(this.badgeDetalView)
			this.badgeDetalView.render(id);
		else
			this.badgeDetalView = new BadgeDetailView({el:$("#content"), id: id});
	}
});