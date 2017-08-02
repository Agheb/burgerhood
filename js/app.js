import "../css/app.scss";
import $ from "jquery";
import "../node_modules/bootstrap/dist/js/bootstrap.min.js";

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

function query(gql_string){

  const query_url =
  "http://localhost:5000/graphql/" + gql_string.replace(/(\r\n|\n|\r)/gm, "");

  fetch(query_url, {
  method: "post"
})
  .then(function(response) {
    if (response.status !== 200) {
      console.log(
        "Looks like there was a problem. Status Code: " + response.status
      );
      return;
    }
    // Examine the text in the response
    response.json().then(function(data) {
      console.log(data);
    });
  })
  .catch(function(err) {
    console.log("Fetch Error :-S", err);
  });

}

query(gql_query);



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
      lat: -34.397,
      lng: 150.644
    },
    zoom: 8
  });
}
window.initMap = initMap; //global scope
