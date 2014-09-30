/* -- APP CONFIGURATION -- */
/* ----------------------- */
/*
 *  Declares global configuration variables and starts the app!
 *
 */

var _dishes;
var _badges;
var _names;
var _filters = ["meat", "pork", "seafood", "dairy", "egg", "insect", "gluten", "nuts", "spicy"];

//Retrieves the data.
$.getJSON("data/data.json")
.done(function (data) {
    _dishes = data.dishes;
    _badges = data.badges;
    _names = data.names;
})
.fail(function( jqxhr, textStatus, error ) {
    var err = textStatus + ", " + error;
    alert( "Request Failed: " + err );
});

$(document).ready(function () { //!\\ Must be on device ready if using PhoneGap API
    var router = new Router();

    //Simulates Android Action Bar.
    /*$('body').on('touchend', '.nav-bar', function (e) {
        e.preventDefault();
        window.history.back();
    });*/
    
    //Kicks it off!
    Backbone.history.start();  
});