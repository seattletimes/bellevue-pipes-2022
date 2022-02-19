// var paywall = require("./lib/paywall");
// setTimeout(() => paywall(12345678), 5000);

require("component-responsive-frame/child");
require("component-leaflet-map");


const dataJSON = require("./BellevueCityBorder.geo.json");
const acPipesJSON = require("./FourAndSixClean.geo.json");

//get access to Leaflet and the map
var element = document.querySelector("leaflet-map");
var L = element.leaflet;
var map = element.map;

var ich = require("icanhaz");
var templateFile = require("./_popup.html");
ich.addTemplate("popup", templateFile);
var focused = false;

acPipesJSON.features.forEach(function(f) {
  ["SITEADDRES"].forEach(function(prop) {
    f.properties[prop] = f.properties[prop] != null ? f.properties[prop] : "No assigned address";
  });
  ["INSTALLDAT"].forEach(function(prop) {
    f.properties[prop] = f.properties[prop] != null ? f.properties[prop] : "No build date";
  });
});






var onEachFeature = function(feature, layer) {
  // console.log("hi");
  layer.bindPopup(ich.popup(feature.properties));
  layer.on({
    mouseover: function(e) {
      layer.setStyle({ weight: 5, fillOpacity: 1 });
    },
    mouseout: function(e) {
      if (focused && focused == layer) { return }
      layer.setStyle({ weight: 3, fillOpacity: 0.8 });
    }
  });
};

var geojson = L.geoJson(dataJSON, {
  // onEachFeature: onEachFeature
}).addTo(map);

var geojsonPipes = L.geoJson(acPipesJSON, {
  onEachFeature: onEachFeature
}).addTo(map);



geojsonPipes.eachLayer(function(featureInstanceLayer) {
  var color = featureInstanceLayer.feature.properties["DIAMETER"] < 5 ? "#2475B0" : "#294B6D";
      featureInstanceLayer.setStyle({
          fillColor: color,
          opacity: 1,
          color: color,
          fillOpacity: 0.8,
          weight: 3,
          lineCap: "square",
          lineJoin: "miter"
      });
  });

geojson.eachLayer(function(featureInstanceLayer) {
      featureInstanceLayer.setStyle({
          fillColor: "none",
          opacity: 1,
          color: '#B79878',
          fillOpacity: 0,
          weight: 2,
          lineCap: "square",
          lineJoin: "miter"
      });
  });


var zoom = document.getElementById("interactive").offsetWidth > 500 ? 13 : 12;
var min_zoom = document.getElementById("interactive").offsetWidth > 500 ? 12 : 11;
// map.fitBounds(geojson.getBounds());
map.options.minZoom = min_zoom;
map.setView(new L.LatLng(47.61503483328471, -122.15792484082786), zoom);
