import "../css/app.scss";
import $ from "jquery";
import "../node_modules/bootstrap/dist/js/bootstrap.min.js";
import { query } from "./gql.js";
var ko = require("knockout");
var LocationModel = require("../locations.json");
var map;
/*
const gql_query = `{ business(id: "yelp-san-francisco") 
            { 
              name 
              id 
              coordinates { 
                latitude 
                longitude 
              } 
            } 
          }`;

query(gql_query);
*/

document.addEventListener("DOMContentLoaded", function() {
  if (document.querySelectorAll("#map").length > 0) {
    var js_file = document.createElement("script");
    js_file.type = "text/javascript";
    js_file.src =
      "https://maps.googleapis.com/maps/api/js?callback=app&key=AIzaSyBeAR2QSBsI-Xch0uTh1yOADUDHifjzWTY";
    document.getElementsByTagName("head")[0].appendChild(js_file);
  }
});

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: {
      lat: 48.137459,
      lng: 11.575231
    },
    zoom: 14
  });
}
window.initMap = initMap; //global scope

/*
LocationModel.Query = ko.observable("");

LocationModel.searchResults = ko.computed(function() {
  var q = LocationModel.Query().toLowerCase();
  return LocationModel.locations.filter(function(i) {
    return i.name.toLowerCase().indexOf(q) >= 0;
  });
});
*/

var Location = function(data) {
  this.name = data.name;
  this.lat = data.coordinates[0];
  this.long = data.coordinates[1];
  this.url = "";
  this.pic_url = "";
  this.address = data.address;
  this.id = data.yelp_id;

  this.visible = ko.observable(true);

  // Yelp Graphql call

  // Info Window

  // Set Marker
  this.marker = new google.maps.Marker({
    position: new google.maps.LatLng(this.lat, this.long),
    map: map,
    title: data.name
  });
};

var ViewModel = function() {
  var _this = this;
  this.locationsList = ko.observableArray([]);

  LocationModel.locations.map(location => {
    this.locationsList.push(new Location(location));
  });

  console.log(this.locationsList);

  // initialize searchquery
  this.Query = ko.observable("");
  // TODO: ES6 Arrow function
  this.searchResults = ko.computed(function() {
    return _this.locationsList().filter(function(location) {
      if (
        location.name.toLowerCase().indexOf(_this.Query().toLowerCase()) >= 0
      ) {
        location.marker.setVisible(true);
        return true;
      } else {
        location.marker.setVisible(false);
        return false;
      }
    });
  });
};

function app() {
  initMap();
  ko.applyBindings(new ViewModel());
}
window.app = app;
