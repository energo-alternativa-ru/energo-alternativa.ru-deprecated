
/* global $, ymaps */

"use strict";

ymaps.ready(function() {
	
	var myMap = new ymaps.Map("map", {
		// При инициализации карты обязательно нужно указать
		// её центр и коэффициент масштабирования.
		center: [55.76, 37.64], // Москва
		zoom: 10,
		controls: ["zoomControl", "fullscreenControl"]
	}, {
		searchControlProvider: "yandex#search"
	});

	//myMap.behaviors.disable(["scrollZoom"]);
	
	
	
	var points = [{
		coord: [55.81, 37.75],
		options: {
			balloonContentHeader: "ООО «Трансинжстрой»",
			balloonContentBody: "Офис, замеры сопротивления",
			balloonContentFooter: "Техотчет выдан 12 февраля 2016 года",
			hintContent: "ООО «Трансинжстрой»"
		}
	}, {
		coord: [55.73, 37.75],
		options: {
			balloonContentHeader: "ООО «Миратос»",
			balloonContentBody: "Складские помещения, замеры сопротивления",
			balloonContentFooter: "Техотчет выдан 12 февраля 2016 года",
			hintContent: "ООО «Миратос»"
		}
	}];
	
	var collection = new ymaps.GeoObjectCollection();
	
	points.forEach(function(point) {
		collection.add(new ymaps.Placemark(point.coord, point.options));
	});
	
	
	myMap.geoObjects.add(collection);
	
	collection.get(0).balloon.open();
	
});



