# Neighborhood Map Project - Munich's Best Burger Joints

A KnockoutJS SPA that provides an interactive map, showing you the locations of Munich's Best Burgers.
The SPA uses Yelp's GraphQL API and even includes a simple GraphQL Client for the API.


### Backend API Server

Yelp's API is intended for backend use (e.g. CORS Headers are not supported). As a possible Workaround, i wrote a simple Flask Application to bounce requests to Yelp. It is currently running on PythonAnywhere.com and the API Proxy can be called from any domain.

### Technologies

* Front-End: Webpack, Babel, Bootstrap v4, Fetch API etc
* Back-End: Flask-Restful, Flask-Cors, Requests

### Usage 

Open index.html 

### Local Development

```
npm run dev
```
You can also run a local API Proxy Server. Install all the dependencies from requirements.txt into your environment and run:

```
python main.py
```
