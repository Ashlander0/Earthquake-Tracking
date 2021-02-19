var url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson';


d3.json(url, function(response) {
	createFeatures(response.features);	
});

function createFeatures(data) {
	// console.log(data);
	var mag = [];
	var location = [];

	for (i = 0; i < Object.keys(data).length; i++) {
		var lat = data[i].geometry.coordinates[0];
		var lon = data[i].geometry.coordinates[1];
		var depth = data[i].geometry.coordinates[2];
		var place = data[i].properties.place;
		var unix = data[i].properties.time;
		var date = Date(unix*1000);
		
		mag.push(data[i].properties.mag);
		location.push([lon, lat]);
	};
	console.log(data);
	console.log(mag);

	// Create a map object
	var myMap = L.map("mapid", {
		center: [0, 0],
		zoom: 2
	});
	
	L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
		attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
		tileSize: 512,
		maxZoom: 18,
		zoomOffset: -1,
		id: "mapbox/streets-v11",
		accessToken: API_KEY
	}).addTo(myMap);
	
	// Loop through the cities array and create one marker for each city object
	for (var i = 0; i < location.length; i++) {
		L.circle(location[i], {
		fillOpacity: 0.75,
		weight: 0,
		fillColor: depth,
		radius: (mag[i] * 25000)
		}).bindPopup(`Date: ${date}<br/>
					Magnitude: ${mag[i]}<br/>
					Depth: ${depth}`).addTo(myMap);
	}
}
  