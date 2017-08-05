import "../css/app.scss";
import $ from "jquery";
import "../node_modules/bootstrap/dist/js/bootstrap.min.js";
import { query } from "./gql.js";
var ko = require("knockout");
var LocationModel = require("../locations.json");

const API_ENDPOINT = "http://localhost:5000/graphql"; // subject for change e.g. production
var map;
var infoWindow;


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
    zoom: 13
  });
  
  infoWindow = new google.maps.InfoWindow({
        content: ''
    });
}
window.initMap = initMap; //global scope

var Location = function(data) {
  this.name = data.name;
  this.lat = data.coordinates[0];
  this.long = data.coordinates[1];
  this.address = data.address;
  this.id = data.yelp_id;
  this.visible = ko.observable(true);
  this.clickInfoView = () => {
    let _this = this;
    createInfoView(this);
  };
  // Set Marker
  this.marker = new google.maps.Marker({
    position: new google.maps.LatLng(this.lat, this.long),
    map: map,
    title: data.name
  });

  this.infowindow = new google.maps.InfoWindow();

  this.marker.addListener("click", () => {
    let _this = this;
    createInfoView(_this);
  });
};

var ViewModel = function() {
  this.locationsList = ko.observableArray([]);
  LocationModel.locations.map(location => {
    this.locationsList.push(new Location(location));
  });

  // initialize searchquery
  this.Query = ko.observable("");

  this.searchResults = ko.computed(() => {
    return this.locationsList().filter(location => {
      if (
        location.name.toLowerCase().indexOf(this.Query().toLowerCase()) >= 0
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

function createContentString(data) {
  // show User if business is open or not
  let b_open = '<span class="text-success">Open</span>';
  let b_closed = '<span class="text-danger">Closed</span>';
  // Content String
  let contentString =
    `<div class="card no-border" style="width: 20rem;">
  <div class="card-block">
    <h4 class="card-title">` +
    data.name +
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
    data.rating +
    `</td>
      <td>` +
    data.review_count +
    `</td>
      <td>` +
    data.price +
    `</td>
    </tr>
  </tbody>
</table>
</div>

<div class="card-block">
    <p class="card-text">` +
    data.location.formatted_address +
    `</p>
    <p class="card-text">` +
    (data.hours[0].is_open_now ? b_open : b_closed) +
    `</p>
  </div> 
  <div class="card-block">
     <a href="` +
    data.url +
    `class="card-link">More Information </a>
  </div>
</div>`;

  return contentString;
}

function createInfoView(clickedBusiness) {
  infoWindow.close();
  // animate marker
  clickedBusiness.marker.setAnimation(google.maps.Animation.BOUNCE);
  setTimeout(() => {
    clickedBusiness.marker.setAnimation(null);
  }, 750);

  // Wrapper for GraphQL Client
  query(API_ENDPOINT, clickedBusiness.id)
    .then(response => {
      let data = response.data.business;
      let content = createContentString(data);
        infoWindow.setContent(content);
        infoWindow.open(
        clickedBusiness.marker.get("map"),
        clickedBusiness.marker
      );
    })
    .catch(error => {
      alert(error.msg);
      console.error(error);
    });
}
