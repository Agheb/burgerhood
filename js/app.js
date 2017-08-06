import "../css/app.scss";
import $ from "jquery";
import "../node_modules/bootstrap/dist/js/bootstrap.min.js";
import { query } from "./gql.js";
var ko = require("knockout");
var LocationModel = require("../locations.json");

const API_ENDPOINT = "http://agheb.pythonanywhere.com/graphql"; // subject for change e.g. production
var map;
var infoWindow;



function initMap() {
  // initialize  map and InfoWindow
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
window.initMap = initMap; // add function to global scope (https://stackoverflow.com/questions/40575637/how-to-use-webpack-with-google-maps-api)



var Location = function(data) {
  this.name = data.name;
  this.lat = data.coordinates[0];
  this.long = data.coordinates[1];
  this.address = data.address;
  this.id = data.yelp_id;
  // fire click event from list view 
  this.clickInfoView = () => {
    let _this = this;
    createInfoView(this);
  };

  // Set marker
  this.marker = new google.maps.Marker({
    position: new google.maps.LatLng(this.lat, this.long),
    map: map,
    title: data.name
  });

  // set InfoWindow 
  this.infowindow = new google.maps.InfoWindow();


  this.marker.addListener("click", () => {
    let _this = this;
    createInfoView(_this);
  });
};


var ViewModel = function() {
  this.locationsList = ko.observableArray([]);
  // load data from locations.json  file 
  LocationModel.locations.map(location => {
    this.locationsList.push(new Location(location));
  });

  // initialize searchquery
  this.Query = ko.observable("");

  this.searchResults = ko.computed(() => {
    return this.locationsList().filter(location => {
      if (
        // checks if searchquery is substring of any location name  
        location.name.toLowerCase().indexOf(this.Query().toLowerCase()) >= 0
      ) {
        location.marker.setVisible(true);
        return true;
      } else {
        // no match therefor markers removed from map 
        location.marker.setVisible(false);
        return false;
      }
    });
  });
};



function createContentString(data) {
   // create template strings for infoWindow from API Response
  
   // text color if business is open 
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

  // execute API request via GraphQL asynchronously
  query(API_ENDPOINT, clickedBusiness.id)
    .then(response => {
      // OK !  
      let data = response.data.business;
      let content = createContentString(data);
        infoWindow.setContent(content);
        infoWindow.open(
        clickedBusiness.marker.get("map"),
        clickedBusiness.marker
      );
    })
    // NOT OK ! inform user gracefully 
    .catch(error => {
      alert(error.msg);
      console.error(error);
    });
}

function app() {
  initMap();
  ko.applyBindings(new ViewModel());
}
window.app = app; 