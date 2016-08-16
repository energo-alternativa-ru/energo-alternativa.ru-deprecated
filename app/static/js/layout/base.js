
/* global $ */

"use strict";

$(function() {
	
	$("nav.navbar ul.nav > li.dropdown").on("show.bs.dropdown", function() {
		$(".page-body").addClass("blur");
	}).on("hide.bs.dropdown", function() {
		$(".page-body").removeClass("blur");
	});
	
});