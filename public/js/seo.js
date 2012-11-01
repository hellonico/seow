$(document).ready(function () {
	var path = $(location).attr('pathname');
	var active = path.substring(1);
	var ind = active.indexOf("/");

	if( ind > -1 ) 
	active.substring(0,ind);

	$("#nav"+active).toggleClass("active");
});

