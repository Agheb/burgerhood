export function query(url,business_id) {
 // Simple GraphQL client for Yelp GraphQL API 
 
 var yelp_id = business_id;

  // raw GraphQL query string according to Documentation.Thanks to ES6 similiar like in Python
  const query_template = `{
  business(id: "${yelp_id}") {
    name
    rating
    review_count
    price
    url
    location {
      formatted_address
    }
    hours {
      is_open_now
    }
  }
}`;
  
  const g_header = { method: "POST", body: query_template };

  return fetch(url, g_header).then(handleResponse, handleNetworkError);
}

function handleResponse(response) {
  if (response.ok) {
    return response.json();
  } else {
    return response.json().then(proxy_error => {
      // query error handled by API Proxy and returns message as JSON with statuscode
      throw proxy_error;
    });
  }
}

function handleNetworkError(error) {
  // throw JSON instead of TypeError for general network failures
  var error_msg = error.message
  throw { msg: `Yelp API not responding as expected.Please reload site to try again: ${error_msg}` };
}
