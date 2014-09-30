/* -- TASTED DISHES VIEW -- */
/* ------------------------ */
/*
 *  Declares and returns the Tasted Dishes View.
 *	
 */

var TastedDishesView = Backbone.View.extend({

	template: "",

	initialize: function () {
		var self = this;

		$.ajax("tpl/tastedDishes.html")
		.done(function (html) {
			self.template = _.template(html);
			self.render();	
		});
	},

	render: function () {
		var data = [];

		//Retrieve data
		if(window.localStorage.getItem('tasted-dishes')){
			var tastedDishes = (JSON.parse(window.localStorage.getItem('tasted-dishes')));

			var tastedDishesId = _.keys(tastedDishes);

			for (var i = 0; i < _dishes.length; i++) {
				var dishes = _dishes[i].dishes;
				for (var j = 0; j < dishes.length; j++) {
					if(_.contains(tastedDishesId, dishes[j].id)){ //If the dish has been tasted
						//If the country is already in the data set
						var isCountry = false;

						for (var k = 0; k < data.length; k++) {
							if(data[k].name == _dishes[i].country){
								//Add the new dish to the list
								data[k].dishes.push({
									'id': dishes[j].id,
									'name': dishes[j].name,
									'rating': tastedDishes[dishes[j].id]
								});

								isCountry = true;
							}
						}
						
						//Else, we create a new object
						if(!isCountry){
							//Push a new object
							data.push({
								'name': _dishes[i].country,
								'flag': _dishes[i].flag,
								'dishes': [
									{
										'id': dishes[j].id,
										'name': dishes[j].name,
										'rating': tastedDishes[dishes[j].id]
									}
								]
							});
						}
					}
				}
			}
		}

		this.$el.html(this.template({data: data}));
	},

	events:{
		'keyup #search-input': 'onSearch',
		'click .dish-item': 'showDishDetail'
	},

	onSearch: function (e) {
		//Get the input value
		var val = $.trim(e.currentTarget.value)
		val = val.charAt(0).toUpperCase() + val.substr(1).toLowerCase();

		//Save references
		var $countries = $(".country-item");
        var $dishes = $(".dish-item");

        //Hide / Show
        if(val === ""){
        	$countries.show();
        	$dishes.show();
        }
        else{
            $countries.hide();
            $dishes.hide();

            $countries.has("li:contains(" + val + ")").show();
            $dishes.has("span:contains(" + val + ")").show();
        }
	},

	showDishDetail: function (e) {
		//Get the name
		var name = e.currentTarget.firstElementChild.innerText;
		/*var id = e.currentTarget.id;

		for (var i = 0; i < _dishes.length; i++) {
			var dishes = _dishes[i].dishes;
			for (var j = 0; j < dishes.length; j++) {
				if(dishes[j].id == id){
					var name = dishes[j].name;
					break;
				}
			}
		}*/

		console.log(name);

		//Route to Dish Detail Page
		//this.undelegateEvents();
		Backbone.history.navigate('dish/' + name, {trigger: true});
	}
});