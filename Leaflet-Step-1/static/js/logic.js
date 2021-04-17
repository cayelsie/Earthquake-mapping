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



// Function that will determine the color of the marker based on depth of earth
function chooseColor(depth) {

  if (depth >= -10 & depth < 10) {
      return "green";
  } 
  else if (depth >= 10 & depth < 30) {
      return "pink";
  } 
  
  else if (depth >= 30 & depth < 50) {
      return "red";
  } 
  
  else if (depth >= 50 & depth < 70) {
      return "yellow";
  } 
  
  else if (depth >= 70 & depth < 90) {
      return "blue"
  } 
  
  else {
      return "#F02908";
  };
}


// // Perform a GET request to the query URL
d3.json(queryUrl).then(function (data) {


//Add circle markers for each earthquake recorded, based on the latitude and longitude of the earthquake site


  L.geoJSON(data, {
    pointToLayer: function (feature, latlng) {

        var geojsonMarkerOptions = {
        radius: (feature.properties.mag) * 5,
        fillColor: chooseColor(feature.geometry.coordinates[2]),
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
          };

      
      return L.circleMarker(latlng, geojsonMarkerOptions);
    },

    // Binding a pop-up to each layer with place and time the earthquake occurred
    onEachFeature: function (feature, layer) {

      console.log(feature.geometry.coordinates[2]);
      
      // depths.forEach(function (depth) {
      //   console.log(Math.max(depth));

      // });

      layer.bindPopup("Site of earthquake: " + feature.properties.place + "<br>Time occurred: " +
        + new Date(feature.properties.time) +"<br>Magnitude: " + feature.properties.mag);
    }
  }).addTo(myMap);

    // Set up the legend
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
      var div = L.DomUtil.create("div", "info legend");
      var limits = geojson.options.limits;
      var colors = geojson.options.colors;
      var labels = [];
  
      // Add min & max
      var legendInfo = "<h1>Median Income</h1>" +
        "<div class=\"labels\">" +
          "<div class=\"min\">" + limits[0] + "</div>" +
          "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
        "</div>";
  
      div.innerHTML = legendInfo;
  
      limits.forEach(function(limit, index) {
        labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
      });
  
      div.innerHTML += "<ul>" + labels.join("") + "</ul>";
      return div;
    };
  });
