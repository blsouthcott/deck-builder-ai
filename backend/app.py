import os
import logging

from flask import Flask, request
from flask_cors import CORS
from flask_restful import Api, Resource
import openai

model = "gpt-3.5-turbo"
temperature = 0.5
top_p = 1.0


logging.basicConfig(level=logging.DEBUG)


class PresentationIdeas(Resource):

    def post(self):
        body = request.get_json()
        # TODO: add logic for generating ideas using openai


class SlideDeck(Resource):

    def post(self):
        body = request.get_json()
        # TODO: add logic for generating text for slides using openai and generating powerpoint file with that text


def create_app():
    app = Flask(__name__)
    CORS(app, origins=os.environ["ALLOWED_HOSTS"])
    app.config["SECRET_KEY"] = os.environ["SECRET_KEY"]
    return app


app = create_app()
api = Api(app)
api.add_resource(PresentationIdeas, "/api/presentationIdeas")
api.add_resource(SlideDeck, "/api/slideDeck")


if __name__ == "__main__":
    app.run(PORT=int(os.environ["PORT"]))
    