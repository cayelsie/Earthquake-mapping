// Creating our initial map object
// We set the longitude, latitude, and the starting zoom level
// This gets inserted into the div with an id of 'mapid'

var myMap = L.map("mapid", {
  center: [
    37.09, -95.71
  ],
  zoom: 5,
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
}).addTo(myMap);

//Link to get geojson data
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// // Perform a GET request to the query URL
d3.json(queryUrl).then(function (data) {


//Add circle markers for each earthquake recorded, based on the latitude and longitude of the earthquake site


  L.geoJSON(data, {
    pointToLayer: function (feature, latlng) {

        var geojsonMarkerOptions = {
        radius: (feature.properties.mag) * 5,
        fillColor: "#ff7800",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
          };

      
      return L.circleMarker(latlng, geojsonMarkerOptions);
    },

    // Binding a pop-up to each layer with place and time the earthquake occurred
    onEachFeature: function (feature, layer) {

      layer.bindPopup("Site of earthquake: " + feature.properties.place + "<br>Time occurred: " +
        + new Date(feature.properties.time) +"<br>Magnitude: " + feature.properties.mag);
    }
  }).addTo(myMap);
  });
