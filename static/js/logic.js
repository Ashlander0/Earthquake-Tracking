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
		var utc = new Date(unix)

		depth.push(data[i].geometry.coordinates[2]);
		place.push(data[i].properties.place);
		date.push(utc);
		mag.push(data[i].properties.mag);
		location.push([lon, lat]);
	};
	console.log(data);
	// console.log(date);

	function depthColor(depth) {
		if (depth > 500) {
			return '#390606';
		} else if (depth > 350) {
			return '#4a0707';
		} else if (depth > 200) {
			return '#5c0909';
		} else if (depth > 100) {
			return '#6e0b0b';
		} else if (depth > 50) {
			return '#800d0d';
		} else if (depth > 20) {
			return '#920f0f';
		} else if (depth > 15) {
			return '#a41010';
		} else if (depth > 10) {
			return '#b51212';
		} else if (depth > 5) {
			return '#c71414';
		} else if (depth <= 5) {
			return '#d91616';
		};
	};
	// Create a map object
	var myMap = L.map('mapid', {
		center: [0, 0],
		zoom: 2
	});
	
	L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
		attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
		tileSize: 512,
		maxZoom: 18,
		zoomOffset: -1,
		id: 'mapbox/streets-v11',
		accessToken: API_KEY
	}).addTo(myMap);
	
	// Loop through the cities array and create one marker for each city object
	for (var i = 0; i < location.length; i++) {
		L.circle(location[i], {
		fillOpacity: 0.9,
		weight: .5,
		color: depthColor(depth[i]),
		fillColor: depthColor(depth[i]),
		radius: (mag[i] * 10000)
		}).bindPopup(`Date: ${date[i]}<br/>
					Location: ${place[i]}<br/>
					Magnitude: ${mag[i]}<br/>
					Depth: ${depth[i]}`).addTo(myMap);
	};
	
	// Legend
	function legend() {
		var depths = [{
			limit: '<= 5',
			color: '#d91616'
		},{
			limit: '5-10',
			color: '#c71414'
		},{
			limit: '10-15',
			color: '#b51212'
		},{
			limit: '15-20',
			color: '#a41010'
		},{
			limit: '20-50',
			color: '#920f0f'
		},{
			limit:'50-100',
			color:'#800d0d'
		},{
			limit:'100-200',
			color:'#6e0b0b'
		},{
			limit:'200-350',
			color:'#5c0909'
		},{
			limit:'350-500',
			color:'#4a0707'
		},{
			limit:'500+',
			color:'#390606'
		}];
	
		var header = `<h3 style = 'margin: 0px; text-align: center; border-width: 1px; border-color: red; border-style: solid'>Depth</h3>`;
	
		var text = '';
	   
		for (i = 0; i < depths.length; i++){
			text += `<p style = 'color: white; background-color: ${depths[i].color}; padding: 0px 5px; margin: 0px'>${depths[i].limit}</p>`;
		};
		    
		return header + text;

	};
	
	var info = L.control({
        position: 'bottomright'
    });

    info.onAdd = function(){
        var div = L.DomUtil.create('div','legend');
        return div;
    }

    info.addTo(myMap);

	document.querySelector('.legend').innerHTML = legend();
};
  