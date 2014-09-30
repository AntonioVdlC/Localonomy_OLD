/* -- CHECKIN VIEW -- */
/* ------------------ */
/*
 *  Declares the Check-In View.
 *	
 */

var CheckInView = Backbone.View.extend({

	template: "",

	initialize: function (options) {
		var self = this;

		$.ajax("tpl/checkIn.html")
		.done(function (html) {
			self.template = _.template(html);
			self.render(options.id);	
		});
	},

	render: function (id) {
		for (var i = 0; i < _dishes.length; i++) {
			var dishes = _dishes[i].dishes;
			for (var j = 0; j < dishes.length; j++) {
				if(dishes[j].id == id){
					var data = _.clone(dishes[j]);
					data.flag = _dishes[i].flag;

					this.$el.html(this.template({data: data}));
					return;
				}
			}
		}
	},

	events:{
		'click .back-button': 'onBack',
		'click .confirm-button': 'onConfirm',
		'change #input-rating': 'onInputChange'
	},

	onBack: function (e) {
		//Route back to dish detail
		//this.undelegateEvents();
		window.history.back();
	},

	onConfirm: function (e) {
		//Update localStorage
		var id = $(".dish-name").attr("id");
		var rating = $("#input-rating").val();
		
		//Update tasted dishes list
		this.updateTastedDishes(id, rating);

		//Update the counters
		var counters = this.updateCounters(id);

		//Test for badges
		var newBadges = this.testBadges(counters);

		//Route back to dish detail
		if(newBadges.length == 0)
			this.onBack();
		else
			Backbone.history.navigate('newbadge/' + JSON.stringify(newBadges), {trigger: true});
	},

	//updateTastedDishes
	/*
		@desc		Updates the list of tasted dishes in localStorage.
		@params		id
						@desc	Dish ID
						@type	<String>
						@vals 	/
					rating
						@desc	Rating retrieved from the input range.
						@type	<String>
						@vals 	/
		@return		/
	*/
	updateTastedDishes: function (id, rating) {
		//Retrieve the data
		if(window.localStorage.getItem('tasted-dishes'))
			var tastedDishes = JSON.parse(window.localStorage.getItem('tasted-dishes'));
		else
			var tastedDishes = {};

		//Add the new checked-in dish
		tastedDishes[id] = rating;

		//Save back the data
		window.localStorage.setItem('tasted-dishes', JSON.stringify(tastedDishes));
	},

	//updateCounters
	/*
		@desc		Updates the counters stored in localStorage.
		@params		id
						@desc	Dish ID
						@type	<String>
						@vals 	/
		@return		counters
						@desc	Updated list of counters.
						@type	<Array[Object]>
						@vals 	/
	*/
	updateCounters: function (id) {
		//Get the dish object
		for (var i = 0; i < _dishes.length; i++) {
			var dishes = _dishes[i].dishes;
			for (var j = 0; j < dishes.length; j++) {
				if(dishes[j].id == id){
					var dish = dishes[j];
					break;
				}
			}
		}

		//Update the counters
		if(window.localStorage.getItem('counters'))
			var counters = JSON.parse(window.localStorage.getItem('counters'));
		else
			var counters = {};

		//Update total counter
		if(_.has(counters, 'total'))
			counters.total ++;
		else
			counters.total = 1;

		//Update country counter
		var countryId = id.slice(0, 2);

		if(_.has(counters, countryId))
			counters[countryId] ++;
		else{
			counters[countryId] = 1;
			if(_.has(counters, 'countries'))
				counters.countries ++;
			else
				counters.countries = 1;
		}

		//Update Ingredient counters
		var ingredients = dish.ingredients;
		for (var i = 0; i < ingredients.length; i++) {
			if(_.has(counters, ingredients[i]))
				counters[ingredients[i]] ++;
			else
				counters[ingredients[i]] = 1;
		}

		//Update Contains counters
		var contains = dish.contains;

		if(_.contains(contains, 'meat')){
			if(_.has(counters, 'meat'))
				counters.meat ++;
			else
				counters.meat = 1;
		}
		else if (_.contains(contains, 'seafood')){
			if(_.has(counters, 'seafood'))
				counters.seafood ++;
			else
				counters.seafood = 1;
		}
		else if(_.contains(contains, 'spicy')){
			if(_.has(counters, 'spicy'))
				counters.spicy ++;
			else
				counters.spicy = 1;
		}
		else if (_.contains(contains, 'insect')){
			if(_.has(counters, 'insect'))
				counters.insect ++;
			else
				counters.insect = 1;
		}
		else if (!(_.contains(contains, 'meat'))){
			if(_.has(counters, 'veggie'))
				counters.veggie ++;
			else
				counters.veggie = 1;
		}
		else if (!(_.contains(contains, 'meat') || _.contains(contains, 'egg') || _.contains(contains, 'dairy') || _.contains(contains, 'insect'))){
			if(_.has(counters, 'vegan'))
				counters.vegan ++;
			else
				counters.vegan = 1;
		}

		//Save back the data
		window.localStorage.setItem('counters', JSON.stringify(counters));
		
		return counters;
	},

	//testBadges
	/*
		@desc		Looks through the list of _badges if this check-in has matched any condition.
		@params		
					counters
						@desc	Updated list of counters.
						@type	<Array[Object]>
						@vals 	/
		@return		newBadge
						@desc	Id of the new badges earned (or null if no new badge was earned).
						@type	<Array[String]>
						@vals 	/
	*/
	testBadges: function (counters) {
		var newBadges = [];

		//Retrieve localStorage
		if(window.localStorage.getItem('earned-badges'))
			var earnedBadges = JSON.parse(window.localStorage.getItem('earned-badges'));
		else
			var earnedBadges = [];

		//Test the badge conditions
		for (var i = 0; i < _badges.length; i++) {
			//If the badge is earned, skip this loop!
			if(_.contains(earnedBadges, _badges[i].id))
				continue;

			//Check if the conditions are met
			var conditions = _badges[i].conditions;
			for (var j = 0; j < conditions.length; j++) {
				if(counters[conditions[j].type] >= conditions[j].count){
					newBadges.push(_badges[i].id);
					earnedBadges.push(_badges[i].id);
				}
			}
		}

		//Update localStorage
		window.localStorage.setItem('earned-badges', JSON.stringify(earnedBadges));

		return newBadges;
	},

	onInputChange: function (e) {
		var ratings = ["Not as expected", "So so", "Pretty Good!", "Yummy!", "Orgasmic!"];

		//Update rating-text according to the value of input-rating
		var val = $("#input-rating").val();

		$("#rating-text").html(ratings[val - 1]);
	}
});