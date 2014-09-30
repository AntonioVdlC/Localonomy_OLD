/* -- DISH DETAIL VIEW -- */
/* ---------------------- */
/*
 *  Declares and returns the Dish Detail View.
 *	
 */

var DishDetailView = Backbone.View.extend({

	template: "",

	initialize: function (options) {
		var self = this;

		$.ajax("tpl/dishDetail.html")
		.done(function (html) {
			self.template = _.template(html);
			self.render(options.dish);	
		});
	},

	render: function (dish) {
		//Retrieve the data about the dish
		for (var i = 0; i < _dishes.length; i++) {
			var dishes = _dishes[i].dishes;
			for (var j = 0; j < dishes.length; j++) {
				if(dishes[j].name == dish){
					var data = _.clone(dishes[j]);
					data.flag = _dishes[i].flag;
		
					//Retrieve the rating of the dish
					if(window.localStorage.getItem('tasted-dishes')){
						var tasted = JSON.parse(window.localStorage.getItem('tasted-dishes'));
						
						if(_.has(tasted, data.id))
							data.rating = tasted[data.id];
					}

					this.$el.html(this.template({data: data}));
					break;
				}
			}
		}
	},

	events:{
		'click .check-in-button': 'checkIn'
	},

	//checkIn
	/*
		@desc		Check-in event handler.
		@params		e
						@desc	Click event Object
						@type	<Object>
						@vals 	/
		@return		/
	*/
	checkIn: function (e) {
		var id = $(".dish-name").attr("id");

		//this.undelegateEvents();

		Backbone.history.navigate('checkin/' + id, {trigger: true});
	}
});