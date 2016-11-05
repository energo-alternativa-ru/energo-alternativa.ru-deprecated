
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
			
			var multi = point.reports.length > 1;
			var textReportMade = `Сделано техотчетов: ${point.reports.length} шт.`;
			
			var isIndividual = point.customer.isIndividual;
			
			var body = [];
			body.push("Заказчик: " + point.customer.name);
			body.push("Адрес объекта: " + point.object.description);
			var footer = [];
			if (multi) footer.push(textReportMade);
			footer.push("Последний техотчет выдан 12 февраля 2016 года");
			
			var color = isIndividual ? "darkGreen" : (multi ? "red" : "blue");
			
			myMap.geoObjects.add(new ymaps.Placemark(coord, {
				iconContent: multi ? point.reports.length : null,
				balloonContentHeader: `Объект: ${point.object.name}`,
				balloonContentBody: body.join("<br/>"),
				balloonContentFooter: footer.join("<br/>"),
				hintContent: (isIndividual ? point.object.name : `${point.customer.name}<br/>${point.object.name}`) + (multi ? `<br/>${textReportMade}` : "")
			}, {
				preset: `islands#${color}Icon`
			}));
				

			
		});
	}).fail(function() {
		console.error("Ошибка при запросе /api/alternativa-data.");
		console.error(arguments);
	});
	
	
});



