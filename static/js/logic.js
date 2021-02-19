var url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson';


d3.json(url, function(response) {
	createFeatures(response.features);	
});

function createFeatures(data) {
	// console.log(data);
	var mag = [];
	var location = [];
	var depth = [];
	var place = [];
	var date = [];

	for (i = 0; i < Object.keys(data).length; i++) {
		var lat = data[i].geometry.coordinates[0];
		var lon = data[i].geometry.coordinates[1];
		var unix = data[i].properties.time;
		var convertedUnix = Date(unix*1000);

		depth.push(data[i].geometry.coordinates[2]);
		place.push(data[i].properties.place);
		date.push(convertedUnix);
		mag.push(data[i].properties.mag);
		location.push([lon, lat]);
	};
	console.log(data);
	console.log(mag);

	function depthColor(depth) {
		if (depth > 10) {
			return '#390606';
		} else if (depth > 8) {
			return '#4a0707';
		} else if (depth > 6) {
			return '#5c0909';
		} else if (depth > 4) {
			return '#6e0b0b';
		} else if (depth > 2) {
			return '#800d0d';
		} else if (depth <= 2) {
			return '#920f0f';
		};
	};
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
		fillColor: depthColor(depth[i]),
		radius: (mag[i] * 25000)
		}).bindPopup(`Date: ${date[i]}<br/>
					Location: ${place[i]}<br/>
					Magnitude: ${mag[i]}<br/>
					Depth: ${depth[i]}`).addTo(myMap);
	}
}
  