import "../css/app.scss";
import $ from "jquery";
import "../node_modules/bootstrap/dist/js/bootstrap.min.js";
import {query} from "./gql.js"
var ko = require('knockout');

var viewModel = {
  items: [ { Name: "Apple part" }, { Name: "Apple sauce" }, { Name: "Apple juice" }, { Name: "Pear juice" }, { Name: "Pear mush" }, { Name: "Something different" } ]
};

viewModel.Query = ko.observable('');

viewModel.searchResults = ko.computed(function() {
    var q = viewModel.Query().toLowerCase();
    return viewModel.items.filter(function(i) {
      return i.Name.toLowerCase().indexOf(q) >= 0;
    });
});


ko.applyBindings(viewModel, document.getElementById('root'));



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
      "https://maps.googleapis.com/maps/api/js?callback=initMap&key=AIzaSyBeAR2QSBsI-Xch0uTh1yOADUDHifjzWTY";
    document.getElementsByTagName("head")[0].appendChild(js_file);
  }
});

var map;

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
