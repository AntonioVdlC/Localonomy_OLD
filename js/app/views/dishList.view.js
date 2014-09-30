/* -- DISH LIST VIEW -- */
/* -------------------- */
/*
 *  Declares and returns the Dish List View.
 *	
 */

var DishListView = Backbone.View.extend({

	template: "",

	initialize: function (options) {
		var self = this;

		$.ajax("tpl/dishList.html")
		.done(function (html) {
			self.template = _.template(html);
			self.render(options.country);	
		});
	},

	render: function (country) {
		for (var i = 0; i < _dishes.length; i++) {
			if(_dishes[i].country == country){
				this.$el.html(this.template({data: _dishes[i]}));

				//Filter the dish list
				this.filterDishes(_dishes[i].dishes);

				//Show the checked-in dishes
				if(window.localStorage.getItem('tasted-dishes'))
					this.checkInTastedDishes(_dishes[i].dishes);

				break;
			}
		}
	},

	//filterDishes
	/*
		@desc		Filter the list of dishes by hidding the dishes that contains unselected filters.
		@params		dishes
						@desc	List of dishes for the given country
						@type	<Array>
						@vals 	/
		@return		/
	*/
	filterDishes: function (dishes) {
		//Retrieve the active filters
		var activeFilters = [];
		for (var i = 0; i < _filters.length; i++) {
			if(window.localStorage.getItem(_filters[i]) == "false")
				activeFilters.push(_filters[i]);
		}

		if(activeFilters.length == 0) //No filters
			return;

		//Select the dishes to hide based on the active filters
		for (var i = 0; i < dishes.length; i++) {
			var contains = dishes[i].contains;
			var id = dishes[i].id;
			for (var j = 0; j < contains.length; j++) {
				if(_.contains(activeFilters, contains[j])){
					$("#" + id).css("display", "none");
				}
			}
		}
	},

	//checkInTastedDishes
	/*
		@desc		Shows the check-in image next to all the tasted dishes!
		@params		dishes
						@desc	List of dishes for the given country
						@type	<Array>
						@vals 	/
		@return		/
	*/
	checkInTastedDishes: function (dishes) {
		//Retrieve localStorage
		var tasted = JSON.parse(window.localStorage.getItem('tasted-dishes'));

		//Retrieve the ids of the tasted dishes
		var tastedID = _.keys(tasted);

		//Compares the tastedID with the id of the dishes in the list
		for (var j = 0; j < dishes.length; j++) {
			if(_.contains(tastedID, dishes[j].id))
				$("#check-" + dishes[j].id).css("visibility", "visible");
		}
	},

	events:{
		'click .list-item': 'clickItem'
	},

	//clickItem
	/*
		@desc		Click item event handler.
		@params		e
						@desc	Click event Object
						@type	<Object>
						@vals 	/
		@return		/
	*/
	clickItem: function (e) {
		var id = e.currentTarget.id;

		for (var i = 0; i < _dishes.length; i++) {
			var dishes = _dishes[i].dishes;
			for (var j = 0; j < dishes.length; j++) {
				if(dishes[j].id == id){
					var name = dishes[j].name;
					break;
				}
			}
		}

		console.log(name);

		//this.undelegateEvents();
		
		Backbone.history.navigate('dish/' + name, {trigger: true});
	}
});