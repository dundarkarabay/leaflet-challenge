function colorFunction(value) {
  if (value >= 5){
      return "#FF0000";
  }
  else if (value >= 4){
      return "#FF6900";
  }
  else if (value >= 3){
      return "#FFC100";
  }
  else if (value >= 2){
    return "#F7FF00";
  }
  else if (value >= 1){
    return "#B0FF00";
  }
  else{
      return "#35FF00";
  }  
};

function createMap(earthquakes,faultLinesData) {
  const earthquakeMarkers = earthquakes.map(earthquake => {
    return L.circle([earthquake.geometry.coordinates[1], 
      earthquake.geometry.coordinates[0]], {
      color: colorFunction(earthquake.properties.mag),
      fillColor: colorFunction(earthquake.properties.mag),
      fillOpacity: 0.75,
      radius: earthquake.properties.mag * 20000
      }).bindPopup(`<h6>Place: ${earthquake.properties.place}</h6>
      <h6>Time: ${new Date(earthquake.properties.time)}</h6>
      <h6>Magnitude: ${earthquake.properties.mag}</h6>`);
    });
  
  const earthquakeLayer = L.layerGroup(earthquakeMarkers);
  
  const satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
    });

  const grayscale = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
    });
  
  const outdoors = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.outdoors",
    accessToken: API_KEY
    });
  
  const baseMaps = {
    Satellite: satellite,
    Grayscale: grayscale,
    Outdoors: outdoors
    };

  const mapStyle = {
    color: "yellow",
    fillColor: "none",
    weight: 1.5
    };
  
  const faultLines = L.geoJson(faultLinesData, {style: mapStyle})
  
  const overlayMaps = {
    "Fault Lines": faultLines,
    Earthquakes: earthquakeLayer
    };

  // Create map object and set default layers
  const myMap = L.map("map", {
    center: [40, -60],
    zoom: 3,
    layers: [satellite, faultLines]
    });

  // Pass our map layers into our layer control
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {collapsed: false}).addTo(myMap);

  // Set up the legend
  const legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
      const div = L.DomUtil.create("div", "info legend");
      const limits = [0, 1, 2, 3, 4, 5];
      const colors = ["#35FF00", "#B0FF00", "#F7FF00", "#FFC100", "#FF6900", "#FF0000"];
      const texts = ["0-1", "1-2", "2-3", "3-4", "4-5", "5+" ]
      const labels = limits.map((limit, index) => {
        return `<li style="background-color:  ${colors[index]}">${texts[index]}</li>`
      })

      div.innerHTML += "<ul>" + labels.join("") + "</ul>";
      return div;
  };

  // Adding legend to the map
  legend.addTo(myMap);
}

(async function(){
  const data = await d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson");
  const faultLinesData = await d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json");
  // Once we get a response, send the data.features object to the createFeatures function
  // console.log(data.features);
  createMap(data.features, faultLinesData);
})()
