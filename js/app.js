import "../css/app.scss";
import $ from "jquery";
import "../node_modules/bootstrap/dist/js/bootstrap.min.js";
import { query } from "./gql.js";
var ko = require("knockout");
var LocationModel = require("../locations.json");

const API_ENDPOINT = "http://localhost:5000/graphql"; // subject for change e.g. production
var map;
var killAnimation;

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
  this.address = data.address;
  this.id = data.yelp_id;
  this.visible = ko.observable(true);
  this.yelp;
  // query Yelp API via GraphQL
  query(API_ENDPOINT, this.id)
    .then(response => {
      let business_data = response.data.business;
      this.yelp = business_data;
    })
    .catch(error => {
      console.error(error);
    });

  // Info Window

  // Set Marker
  this.marker = new google.maps.Marker({
    position: new google.maps.LatLng(this.lat, this.long),
    map: map,
    title: data.name
  });

  // Eventlistener Click
  this.marker.addListener("click", () => {

      var animate = this.marker.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(() => {this.marker.setAnimation(null); }, 1500);
    
    // Create an infoView
    var yelp_id = this.id;
    // helper variables to indicate if business is open
    let b_open = '<span class="text-success">Open</span>';
    let b_closed = '<span class="text-danger">Closed</span>';

    // Content String
    let contentString =
      `<div class="card no-border" style="width: 20rem;">
  <div class="card-block">
    <h4 class="card-title">` +
      this.yelp.name +
      `</h4>
  </div>
  <div class="px-3">
  <table class="table table-m">
  <thead>
    <tr>
      <th>Rating</th>
      <th>Reviews</th>
      <th>Price</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>` +
      this.yelp.rating +
      `</td>
      <td>` +
      this.yelp.review_count +
      `</td>
      <td>` +
      this.yelp.price +
      `</td>
    </tr>
  </tbody>
</table>
</div>

<div class="card-block">
    <p class="card-text">` +
      this.yelp.location.formatted_address +
      `</p>
    <p class="card-text">` +
      (this.yelp.hours.is_open_now ? b_open : b_closed) +
      `</p>
  </div> 
  <div class="card-block">
     <a href="` +
      this.yelp.url +
      `class="card-link">More Information </a>
  </div>
</div>`;

    var infowindow = new google.maps.InfoWindow({
      content: contentString
    });

    // attach infowindow to marker
    infowindow.open(this.marker.get("map"), this.marker);
  });
};

var ViewModel = function() {
  var _this = this;
  this.locationsList = ko.observableArray([]);

  LocationModel.locations.map(location => {
    this.locationsList.push(new Location(location));
  });

  // initialize searchquery
  this.Query = ko.observable("");
  // TODO: ES6 Arrow functions
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

function createInfoWindowContent(yelp_id) {
  // GraphQL Query
}

function animateMarker() {
  if (this.marker.getAnimation() != null) {
    this.marker.setAnimation(null);
  } else {
    this.marker.setAnimation(google.maps.Animation.BOUNCE);
  }
}
