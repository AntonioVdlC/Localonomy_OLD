/* -- MODAL POPUP -- */
/* ----------------- */
/*
 *  Decalre a modalPopup class to build modal popups.
 *	
 */

function modalPopup (title, innerHTML, buttonLabels, callback, data, type){
	//console.log('New modal popup: ' + title + ' ' + innerHTML + ' ' + buttonLabels + ' ' + callback + ' ' + data + ' ' + type);

	//Create the popup and overlay elements
	$('<div></div>').addClass('modalOverlay').appendTo('body');
	$('<div></div>').addClass('modalWindow').appendTo('body');

	//Fill the modalWindowElement
	$('.modalWindow').append('<div class="modalWindowHeader">'+title+'</div>');
	$('.modalWindow').append('<div class="modalWindowContent">'+innerHTML+'</div>');

	if(buttonLabels.length == 1)
		$('.modalWindow').append(	'<div class="modalWindowFooter">' + 
										'<button class="okButton">'+buttonLabels[0]+'</button>'+
									'</div>');

	else if(buttonLabels.length == 2)
		$('.modalWindow').append(	'<div class="modalWindowFooter">' + 
										'<button class="cancelButton">'+buttonLabels[0]+'</button>' +
										'<button class="okButton">'+buttonLabels[1]+'</button>'+
									'</div>');

	//Button events listeners
	if(type != 'info')
		$('.cancelButton').on('click', this.hide);

	if(type == 'multi-choice')
		$('.okButton').on('click', this.hide);
	else if(type == 'info')
		$('.okButton').on('click', this.hide);
	else
		$('.okButton').on('click', callback);

	//Special event handling for Multiple Choice windows
	if(type == 'multi-choice'){
		var self = this;
		$(".modalWindowContent a").each(function () {
			$(this).on('click', self.hide);
		});
	}

	return this;
}

modalPopup.prototype.show = function (){

	var self = this;

	setTimeout(function() {
		$('.modalWindow').css('opacity', 1);
		$('.modalOverlay').css('opacity', 0.4);

		$('.modalOverlay').on('click', self.hide);
	  }, 300);
};

modalPopup.prototype.hide = function () {

	$('.modalWindow').css('opacity', 0);
	$('.modalOverlay').css('opacity', 0);

	$('.modalOverlay').off('click');
	$('.cancelButton').off('click');
	$('.okButton').off('click');

	setTimeout(function() {
		$('.modalOverlay').remove();
		$('.modalWindow').remove();
	}, 400);
};