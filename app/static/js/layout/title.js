
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
	
	
	
	
	// Поиск по карте
	
	
	$.get("/api/alternativa-data").done(function(data, textStatus) {
		
		if (!data.points) throw new Error("Не удалось загрузить объекты для карты.");
		
		data.points.forEach(function(point) {

			var coord = [point.latitude, point.longitude];
			
			var body = [];
			body.push("Объект: " + point.object.name);
			body.push("Заказчик: " + point.customer.name);
			body.push("Адрес объекта: " + point.object.description);
			var footer = [];
			footer.push(`Сделано техотчетов: ${point.reports.length} шт.`);
			footer.push("Последний техотчет выдан 12 февраля 2016 года");
			
			var color = point.customer.isIndividual ? "darkGreen" : "blue";
			
			myMap.geoObjects.add(new ymaps.Placemark(coord, {
				balloonContentHeader: point.object.name,
				balloonContentBody: body.join("<br/>"),
				balloonContentFooter: footer.join("<br/>"),
				hintContent: point.customer.name
			}, {
				preset: `islands#${color}Icon`
			}));
				

			
		});
	}).fail(function() {
		console.error("Ошибка при запросе /api/alternativa-data.");
		console.error(arguments);
	});
	
	
});



