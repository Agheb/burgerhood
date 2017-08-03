export function query(gql_string){

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