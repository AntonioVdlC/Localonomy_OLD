/* -- HOME VIEW -- */
/* --------------- */
/*
 *  Declares and returns the Home View.
 *	
 */

var HomeView = Backbone.View.extend({

	template: "",

	initialize: function () {
		var self = this;

		$.ajax("tpl/home.html")
		.done(function (html) {
			self.template = _.template(html);
			self.render();	
		});
	},

	render: function () {
		this.$el.html(this.template());

		this.initFilters();
	},

	//initFilters
	/*
		@desc		Initialize the filters to their selected or unselected form depending on localStorage.
		@params		/
		@return		/
	*/
	initFilters: function () {
		for (var i = 0; i < _filters.length; i++) {
			if(window.localStorage.getItem(_filters[i]) == null)
				window.localStorage.setItem(_filters[i], "true");

			if(window.localStorage.getItem(_filters[i]) == "false")
				$("#" + _filters[i]).addClass("unselected");
			else
				$("#" + _filters[i]).removeClass("unselected").addClass("selected");
		}
	},

	events: {
		'click #filter-box .filter-img': 'toggleFilter',
		'keydown #search-field input': 'onKeydown',
		'blur #search-field input': 'onBlur',
		'focus #search-field input': 'onFocus',
		'click #search-button': 'search'
	},

	//toggleFilter
	/*
		@desc		Selects/Unselects filters.
		@params		e
						@desc	Click event Object
						@type	<Object>
						@vals 	/
		@return		/
	*/
	toggleFilter: function (e) {
		var id = e.currentTarget.id;

		if(window.localStorage.getItem(id) == "false"){
			window.localStorage.setItem(id, "true");
			$("#" + id).removeClass("unselected").addClass("selected");
		}
		else{
			window.localStorage.setItem(id, "false");
			$("#" + id).removeClass("selected").addClass("unselected");
		}
	},

	onKeydown: function (e) {
		if(e.keyCode === 13)
			this.search(e.currentTarget.value);
	},

	onBlur: function (e) {
		if(e.currentTarget.value === "")
			$("#search-field input").val("Enter a country or dish name ...");
	},

	onFocus: function (e) {
		if(e.currentTarget.value === "Enter a country or dish name ...")
			$("#search-field input").val("");
	},

	//Search
	/*
		@desc		Retrieves the search text and routes to the dishes list or dish details result page.
		@params		e
						@desc	Click event Object
						@type	<Object>
						@vals 	/
		@returns 	/
	*/
	search: function (e) {

		if(typeof e === "string") //Value from GO button
			var val = e;
		else //Value from search-button
			var val = e.currentTarget.previousElementSibling.value;
		
		var text = val.charAt(0).toUpperCase() + val.substr(1).toLowerCase();

		//Validate searchText
		if(text !== "" && text !== "Enter a country or dish name ..."){
			//Look for a matching text in countries or dishes
			var match = this.matchText(text);
			//var route = this.selectRoute(text);

			//Route to country or dish depending on the text
			if(match.route !== null && _.isString(match.text)){
				//this.undelegateEvents();
				Backbone.history.navigate(match.route + '/' + match.text, {trigger: true});
			}
			else if(_.isArray(match)){ //There are many possible matches - Show popup with the selection!
				//console.log(match);

				$.ajax("tpl/multiChoice.html")
				.done(function (html) {
					var template = _.template(html);
					var infoWindow = new modalPopup(
						"Multiple Choices",
						template({routes: match}),
						["Dismiss"],
						null,
						null,
						"multi-choice"
					);

					infoWindow.show();
				});
			}
			else{ //Show pop-up or text explaining their was no match for the text entered
				$("#error-text").html("No results were found for '" + val + "'.");
			}
		}
	},

	//Select Route
	/*
		@desc		Retrieves the search text and tests to where it has to route.
		@params		text
						@desc	Search input
						@type	<String>
						@vals 	/
		@returns 	route
						@desc	Route to where the app has to navigate
						@type	<String>
						@vals 	"country", "dish" or null
	*/
	selectRoute: function (text) {
		var countries = _names.countries;
		var dishes = _names.dishes;

		//If text value is a country
		for (var i = 0; i < countries.length; i++) {
			if (countries[i] == text)
				return "country";
		}
		//Else if text value is a dish
		for (var i = 0; i < dishes.length; i++) {
			if (dishes[i] == text)
				return "dish";
		}
		//Else
		return null;
	},

	//Match Text
	/*
		@desc		Matches the text input with names in the _names dictionnary and routes to the right page.
		@params		text
						@desc	Search input
						@type	<String>
						@vals 	/
		@returns 	object
						@desc	Object containing the route and the text.
						@type	<Object>
						@vals 	{
									route: "country" | "dish" | null
									text: <String> | <Array[Sting]>
								}
	*/
	matchText: function (text) {
		var countries = _names.countries;
		var dishes = _names.dishes;

		var route = this.selectRoute(text);

		if (route !== null)
			return {'route': route, 'text': text};

		//Fuzzy string matching

		//Calculate distances between the text and the names
		var distance = [];
		var names = _.union(countries, dishes);
		for (var i = 0; i < names.length; i++) {
			distance.push(this.fuzzyStringDistance(text, names[i]));
		}

		//Select the best matching string (shorter distance) OR if several good matches, return an array
		var min = _.min(distance);

		//If the min distance is too big (> 3) return null
		if(min > 3)
			return {'route': null, 'text': text};

		//Retrieve all the indexes of min distance
		var indexes = [];

		for (var i = 0; i < distance.length; i++) {
			if(distance[i] == min)
				indexes.push(i);
		}

		//If there is only one match
		if(indexes.length == 1){
			var fuzzText = names[indexes[0]];
			route = this.selectRoute(fuzzText);

			return {'route': route, 'text': fuzzText};
		}

		//Else, return the array of matches for suggestion modal popup
		else{
			var multiMatches = [];
			//var route = [],
			//	text = [];

			for (var i = 0; i < indexes.length; i++) {
				multiMatches.push({
					'route': this.selectRoute(names[indexes[i]]),
					'text': names[indexes[i]]
				});
				//route.push(this.selectRoute(names[indexes[i]]));
				//text.push(names[indexes[i]]);
			}

			return multiMatches; //{'route': route, 'text': text};
		}
	},

	//Fuzzy String Calculation
	/*
		@desc		Calculates the Levenshtein distance between 2 strings and returns it.
		@params		text
						@desc	Search input
						@type	<String>
						@vals 	/ (not "")
					name
						@desc	A string from the dictonnary _names
						@type	<String>
						@vals 	/ (not "")
		@returns 	distance
						@desc	The Levenshtein distance between text and name.
						@type	<Int>
						@vals 	/
	*/
	fuzzyStringDistance: function (text, name) {
		//Fuzzy stuff going on ... Calculating Levenshtein distance
		var v0 = [],
			v1 = [];

		for (var i = 0; i < name.length + 1; i++) {
			v0[i] = i;
		}

		for (var i = 0; i < text.length; i++) {
			v1[0] = i + 1;

			for (var j = 0; j < name.length; j++) {
				var cost = (text[i] == name[j]) ? 0 : 1;
				v1[j + 1] = Math.min(v1[j] + 1, v0[j + 1] + 1, v0[j] + cost); 	
			}

			for (var j = 0; j < v0.length; j++) {
				v0[j] = v1[j];
			}
		}

		return v1[name.length];
	}
});