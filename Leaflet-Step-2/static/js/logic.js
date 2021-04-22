

// Create layer group for earthquakes
var earthquakes = L.layerGroup();

//Create layer group for plates
var plates = L.layerGroup();

// Adding a tile layer (the background map image) to our map
// We use the addTo method to add objects to our map
var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/satellite-v9",
  accessToken: API_KEY
});

// Adding a tile layer (the background map image) to our map
// We use the addTo method to add objects to our map
var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/outdoors-v11",
  accessToken: API_KEY
});

// Adding a tile layer (the background map image) to our map
// We use the addTo method to add objects to our map
var grayscale = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/dark-v10",
  accessToken: API_KEY
});

// Creating our initial map object
// We set the longitude, latitude, and the starting zoom level
// This gets inserted into the div with an id of 'mapid'

var myMap = L.map("mapid", {
  center: [
    37.09, -95.71
  ],
  zoom: 5,
  layers: [satellite, outdoors]
});

//variable to hold baselayers - one will be able to be chosen at a time
var baseMaps = {
  Satellite: satellite,
  Grayscale: grayscale,
  Outdoors: outdoors
};

//Variable to hold overlay layers that may be toggled on or off
var overlayMaps = {
  "Tectonic Plates": plates,
  Earthquakes: earthquakes
};

L.control.layers(baseMaps, overlayMaps).addTo(myMap);


//Link to get earhtquake geojson data
var earthquakeUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

  //Link to get plate geojson data
  var plateUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";



  // Function that will determine the color of the marker based on depth of earth
  function chooseColor(depth) {

    if (depth >= -10 & depth < 10) {
  return "#00ff00";
} 
  else if (depth >= 10 & depth < 30) {
  return "#ffff66";
}

else if (depth >= 30 & depth < 50) {
  return "#ffbf4c";
}

else if (depth >= 50 & depth < 70) {
  return "#ff8c38";
}

else if (depth >= 70 & depth < 90) {
  return "#ff5924"
}

else {
  return "#ff0000";
};
}



// // Perform a GET request to the earthquake URL
d3.json(earthquakeUrl).then(function (data) {


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

      // console.log(feature.geometry.coordinates[2]);

      // depths.forEach(function (depth) {
      //   console.log(Math.max(depth));

      // });

      layer.bindPopup("Site of earthquake: " + feature.properties.place + "<br>Time occurred: "
        + new Date(feature.properties.time) + "<br>Magnitude: " + feature.properties.mag);
    }
  }).addTo(earthquakes);
  earthquakes.addTo(myMap);

  // // Perform a GET request to the plates URL
  d3.json(plateUrl).then(function (platedata) {
    L.geoJSON(platedata, {
      color: "#ff8000",
      weight: 3
    }).addTo(plates);
    plates.addTo(myMap);
  });



  // Set up the legend
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function () {
    var div = L.DomUtil.create("div", "info legend");
    labels = [" -10-10", " 10-30", " 30-50", " 50-70", " 70-90", " 90+"];
    colors = ["#00ff00", "#ffff66", "#ffbf4c", "#ff8c38", "#ff5924", "#ff0000"];
    div.innerHTML = "<h3>Depth of Earthquake</h3>"
    for (var i = 0; i < labels.length; i++) {
      div.innerHTML += '<li style = "background-color:' + colors[i] + '"></li>' + labels[i] + "<br>";
    }
    return div;
  };


  // Adding legend to the map
  legend.addTo(myMap);
});
