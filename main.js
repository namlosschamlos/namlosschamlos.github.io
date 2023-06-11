const abtBtn = document.getElementById("abt")
const mapContainer = document.querySelector(".map")
const buttonContainer = document.querySelector(".button-bar")
const allBtns = document.querySelectorAll(".btn")
const germanStatesURL = "https://raw.githubusercontent.com/isellsoap/deutschlandGeoJSON/main/2_bundeslaender/2_hoch.geo.json"

let clickedButton = [];

let jsonResponse
let germanStates;


fetch(germanStatesURL)
  .then(response => response.json())
  .then(data => {
    jsonResponse = data;
    console.log("JSON-Daten wurden erfolgreich geladen:", jsonResponse);
    germanStates = L.geoJSON(jsonResponse, {
      style: function (feature) {
        return { color: "red" };
      }
    }).addTo(map)
    map.fitBounds(germanStates.getBounds())
  })
  .catch(error => {
    console.log("Fehler beim Laden der JSON-Daten:", error);
  });


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
  map.fitBounds(workLayer.getBounds())
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


const testGeoJson = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [13.438998, 52.523405]
      },
      "properties": {
        "name": "Berliner Immobilienmanagement GmbH",
        "address": "Werneuchener Str. 27, 13055 Berlin",
        "job_title": "GIS Entwickler",
        "job_position": "Angestellter",
        "img_link:": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/DLR_Logo.svg/1024px-DLR_Logo.svg.png"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [13.402085, 52.414654]
      },
      "properties": {
        "name": "Deutsches Luft- und Raumfahrtzentrum",
        "address": "Rutherfordstraße 2, 12489 Berlin",
        "job_position": "Praktikant",
        "job_title": "Praktikum",
        "img_link": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/DLR_Logo.svg/1024px-DLR_Logo.svg.png"
      }
    }
  ]
}

const anotherGeoJson = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [13.438998, 52.523405]
      },
      "properties": {
        "name": "Berliner Immobilienmanagement GmbH",
        "address": "Werneuchener Str. 27, 13055 Berlin",
        "job_title": "GIS Entwickler",
        "job_position": "Angestellter",
        "img_link:": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/DLR_Logo.svg/1024px-DLR_Logo.svg.png"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [13.402085, 52.414654]
      },
      "properties": {
        "name": "Deutsches Luft- und Raumfahrtzentrum",
        "address": "Rutherfordstraße 2, 12489 Berlin",
        "job_position": "Praktikant",
        "job_title": "Praktikum",
        "img_link": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/DLR_Logo.svg/1024px-DLR_Logo.svg.png"
      }
    }
  ]
}


function loopThroughLayer(layerName){
  layerName.eachLayer(function(layer){
    let featureColor = layer.options.color
    let featureDescribtion = layer.feature.properties.job_title
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



const workLayer = L.geoJSON(testGeoJson, {
  onEachFeature(feature) {
    feature.properties.featureID = "work"
  },
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