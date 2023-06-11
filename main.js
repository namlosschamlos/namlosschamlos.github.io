const abtBtn = document.getElementById("abt")
const mapContainer = document.querySelector(".map")
const buttonContainer = document.querySelector(".button-bar")
const allBtns = document.querySelectorAll(".btn")
const germanStatesURL = "https://raw.githubusercontent.com/isellsoap/deutschlandGeoJSON/main/2_bundeslaender/2_hoch.geo.json"
const workJsonUrl = "https://raw.githubusercontent.com/namlosschamlos/namlosschamlos.github.io/main/jobs.json"

let clickedButton = [];

let germanStates;
let workLayer;

fetch(germanStatesURL)
  .then(response => response.json())
  .then(data => {
    jsonResponse = data;
    console.log("JSON-Daten wurden erfolgreich geladen:", jsonResponse);
    germanStates = L.geoJSON(jsonResponse, {
      style: function (feature) {
        return { color: "white" };
      }
    }).addTo(map)
    map.fitBounds(germanStates.getBounds())
  })
  .catch(error => {
    console.log("Fehler beim Laden der JSON-Daten:", error);
  });

let jobsJson; // Variable zum Speichern der GeoJSON-Daten

fetch(workJsonUrl)
  .then(response => response.json())
  .then(data => {
    jobsJson = data; // Speichern der GeoJSON-Daten in der Variable
    console.log('GeoJSON-Daten wurden erfolgreich geladen:', jobsJson);
    workLayer = L.geoJSON(jobsJson, {
      pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, {
          radius: 8,
          color: "green",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
        });
      }
    })

    // Weitere Verarbeitung der GeoJSON-Daten...
  })
  
  .catch(error => {
    console.log('Fehler beim Laden der GeoJSON-Daten:', error);
  });

// Du kannst die Variable geojsonData später verwenden
// um auf die geladenen Daten zuzugreifen



function zoomToMapExtent() {
  map.fitBounds(germanStates.getBounds())
}

function addEducationLayer(){
  map.removeLayer(workLayer)
  educationLayer.addTo(map)
  loopThroughLayer(educationLayer)
  map.fitBounds(educationLayer.getBounds()).setZoom(10)
}

function addWorkLayer(){
  map.removeLayer(educationLayer)
  workLayer.addTo(map)
  loopThroughLayer(workLayer)
  map.fitBounds(workLayer.getBounds()).setZoom(5)
}

function startButton(attribute) {
  switch(attribute){
    case "Education":
      addEducationLayer();
      break;
    case "Work":
      addWorkLayer()
      break;
  }
}

function sameButton(buttonClicked){
  switch(buttonClicked){
    case "Education":
      map.removeLayer(educationLayer)
      zoomToMapExtent()
      break;
    case "Work":
      map.removeLayer(workLayer);
      zoomToMapExtent()
      break;
  }
}

function differentButton(clickedButton){
  switch(clickedButton){
    case "Work":
      map.removeLayer(educationLayer)
      removeTableContent()
      addWorkLayer()
      break;
    case "Education":
      map.removeLayer(workLayer);
      removeTableContent()
      addEducationLayer()
      break;
  }
}

function removeTableContent(){
  let rows = document.querySelectorAll(".row-container")
  rows.forEach(function(row){
    row.remove()
  })
}


allBtns.forEach(function (btn) {
  btn.addEventListener("click", function () {
    clickedButton.push(btn.innerHTML)
    moveControlBar()
    if (clickedButton.length == 1) {
      //Kein Button gedrückt
      startButton(clickedButton[0])

    } else if (clickedButton.length == 2 && clickedButton[0] == clickedButton[1]) {
      //selber Button gedrückt
      sameButton(clickedButton[0])
      removeTableContent()
      undoControlBar()
      clickedButton = [];

    } else if (clickedButton.length == 2 && clickedButton[0] != clickedButton[1]) {
      //anderer Button gedrückt
      differentButton(clickedButton[1])
      clickedButton.shift()
    }

  })
})

function loopThroughLayer(layerName){
  layerName.eachLayer(function(layer){
    let featureColor = layer.options.color
    let featureDescribtion = layer.feature.properties.business
    createRow(featureColor,featureDescribtion)
  })
}

function createRow(featureColor, featureDescribtion) {
  let tableContent = document.querySelector(".table-content")

  let row = document.createElement("div")
  row.classList.add("row-container")
  tableContent.appendChild(row)

  let imgContainer = document.createElement("div")
  imgContainer.classList.add("img-container")
  row.appendChild(imgContainer)

  imgContainer.style.borderColor = featureColor


  let textContainer = document.createElement("div")
  let textHeader = document.createElement("h1")
  textHeader.innerText = featureDescribtion
  textContainer.classList.add("text-container")
  row.appendChild(textContainer)
  textContainer.appendChild(textHeader)

}

function moveControlBar() {
  mapContainer.classList.add("map-active")
  buttonContainer.classList.add("button-bar-active")
}

function undoControlBar() {
  mapContainer.classList.remove("map-active")
  buttonContainer.classList.remove("button-bar-active")

}

var map = L.map("map", {
  zoom: 6,
  center: [52.15000, 10.333333],
  attributionControl: false,
  zoomControl: false,
  dragging: false
})


const educationLayer = L.geoJSON(anotherGeoJson, {
  onEachFeature(feature) {
    feature.properties.featureID = "education"
  },
  pointToLayer: function (feature, latlng) {
    return L.circleMarker(latlng, {
      radius: 8,
      color: "red",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    });
  }
})


function setBundeslaenderExtent() {
  bounds = germanStates.getBounds()
  map.fitBounds(bounds)
}