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

function createMap(earthquakes) {
  const myMap = L.map("map", {
    center: [47.5, -120],
    zoom: 4,
    });

  L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
    }).addTo(myMap);

  earthquakes.forEach(earthquake => {
    return L.circle([earthquake.geometry.coordinates[1], 
      earthquake.geometry.coordinates[0]], {
      color: colorFunction(earthquake.properties.mag),
      fillColor: colorFunction(earthquake.properties.mag),
      fillOpacity: 0.75,
      radius: earthquake.properties.mag * 20000
    })
    .addTo(myMap)
    .bindPopup(`<h6>Place: ${earthquake.properties.place}</h6>
    <h6>Time: ${new Date(earthquake.properties.time)}</h6>
    <h6>Magnitude: ${earthquake.properties.mag}</h6>`);
  });

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
  // Once we get a response, send the data.features object to the createFeatures function
  // console.log(data.features);
  createMap(data.features);
})()
