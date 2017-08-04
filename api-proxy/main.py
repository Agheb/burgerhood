#!/usr/bin/env python3
import requests
from flask import Flask, jsonify
from flask_restful import Resource, Api
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
api = Api(app)


class ProxyQuery(Resource):
    def post(self, query):
        url = 'https://api.yelp.com/v3/graphql'
        yelp_token = ("Bearer YCiqpLcanOThy-y4Ubz2wRvtXez5dwrR_wQhQEADZFcI-"
                      "rIhZoMu2GN_mGP_"
                      "1YWkXQzPjoMbek1kTmFkCQ3LN7lZZqcprQV3yPV4BZXlGA8WPT"
                      "-kYau2nY8C68Z7WXYx")
        headers = {'Authorization': yelp_token,
                   'Content-Type': 'application/graphql'}

        r = requests.post(url, headers=headers, data=query)

        if r.status_code == requests.codes.ok:
            return r.text
        else:
            return r.status_code


api.add_resource(ProxyQuery, '/graphql/<query>')


if __name__ == '__main__':
    app.run(debug=True)
