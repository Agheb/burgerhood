# Neighborhood Map Project - Munich's Best Burger Joints

A KnockoutJS SPA that provides an interactive map, showing you the locations of Munich's Best Burgers.
The application utilizes Yelp's GraphQL API. GraphQL queries are executed by a client based on Fetch API.

### Backend API Server

Yelp's Fusion API is intended for backend use (e.g. CORS Headers are not supported). As a possible Workaround, i wrote a simple Flask Application to bounce requests to Yelp. It is currently running on PythonAnywhere.com and the API Proxy can be called from any domain. You can 

### Technologies

* Front-End: Webpack, Babel, Bootstrap v4, Fetch API etc
* Back-End: Flask-Restful, Flask-Cors, Requests

###  run & develop locally 

1. Install all necessary dependencies: 
```
npm install 
```

2. Run application
```
npm run dev
```

###  Run API Proxy Server locally (optional)

1. cd into dir `api-proxy`
2. `pip install requirements.txt` in your environment
3. Run `python main.py` (tested on Python version 3.6)


### Build production version of application with Webpack

1. Replace www.example.com in `webpack.config.js`  with real domain name.
2. Run
```
npm build
```
3. Copy `index.html`, `/dist` and `/images` to your server


### Resources 

 * Webpack Boilerplate