#!/usr/bin/env python3
import requests
import logging
import json
from flask import Flask, request, jsonify
from flask_restful import Resource, Api
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
api = Api(app)

"""
try:
    import http.client as http_client
except ImportError:
    # Python 2
    import requests.packages.urllib3.connectionpool as httplib
http_client.HTTPConnection.debuglevel = 1

# You must initialize logging, otherwise you'll not see debug output.
logging.basicConfig()
logging.getLogger().setLevel(logging.DEBUG)
requests_log = logging.getLogger("requests.packages.urllib3")
requests_log.setLevel(logging.DEBUG)
requests_log.propagate = True
"""


class ProxyQuery(Resource):
    def post(self):
        url = 'https://api.yelp.com/v3/graphql'
        yelp_token = ("Bearer YCiqpLcanOThy-y4Ubz2wRvtXez5dwrR_wQhQEADZFcI-"
                      "rIhZoMu2GN_mGP_"
                      "1YWkXQzPjoMbek1kTmFkCQ3LN7lZZqcprQV3yPV4BZXlGA8WPT"
                      "-kYau2nY8C68Z7WXYx")
        headers = {'Authorization': yelp_token,
                   'Content-Type': 'application/graphql'}
        resp = requests.post(url, headers=headers, data=request.data)

        json_resp = json.loads(resp.text)

        """return errors in a standardized way as JSON
        e.g. { msg: 'HELP ! My house is burning'}"""

        if resp.status_code != requests.codes.ok:
            return {'msg': 'API Proxy could not connect to Yelp'}, 502
        if 'errors' in json_resp:
            return {'msg': 'could not find resource'}, 404

        return json.loads(resp.text)


api.add_resource(ProxyQuery, '/graphql')


if __name__ == '__main__':
    app.run(debug=True)
