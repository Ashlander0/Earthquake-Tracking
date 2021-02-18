var url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson';


d3.json(url, function(response) {
	createFeatures(response.features);	
});

var map = L.map("mapid", {
	center: [45.52, -122.67],
	zoom: 13
});
  
// Adding a tile layer (the background map image) to our map
// We use the addTo method to add objects to our map
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
	attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
	tileSize: 512,
	maxZoom: 18,
	zoomOffset: -1,
	id: "mapbox/streets-v11",
	accessToken: API_KEY
}).addTo(map);

function createFeatures(data) {
	// console.log(data);
	var mag = 10000000;
	var location = [];

	for (i = 0; i < Object.keys(data).length; i++) {
		var lat = data[i].geometry.coordinates[0];
		var lon = data[i].geometry.coordinates[1];
		var depth = data[i].geometry.coordinates[2];
		
		// mag.push(data[i].properties.mag);
		location.push([lat, lon]);
	};
	console.log(location);
	
	var earthquakes = [];

	for (i = 0; i < location.length; i++) {
		earthquakes.push(
			L.circle(location[i], {
				color: depth[i],
				// radius: mag[i],
			})
		);
	};

	var EQlayer = L.layerGroup(earthquakes);
	EQlayer.addTo(map);
};

