import os
import logging

from flask import Flask, request
from flask_cors import CORS
from flask_restful import Api, Resource
import openai

openai.api_key = os.getenv("OPENAI_API_KEY")
model = "gpt-3.5-turbo"
temperature = 0.5
top_p = 1.0
topic_count = 5

logging.basicConfig(level=logging.DEBUG)


class PresentationIdeas(Resource):

    def post(self):
        body = request.get_json()
        # TODO: add logic for generating ideas using openai
        response = openai.ChatCompletion.create(
            model=model,
            messages=[{"role": "user",
                       "content": f"Generate a numbered list of {topic_count} different topic ideas for a PowerPoint presentation. Keep it concise."}],
            temperature=temperature
        )
        response_content = response["choices"][0]["message"]["content"]
        topics = response_content.split("\n")
        for i in range(len(topics)):
            topics[i] = topics[i][3:]  # removes the first three characters from each topic, because those always come out as number + period + space (e.g. "1. ")
        return {"ideas": topics}, 200


class SlideDeck(Resource):

    def post(self):
        body = request.get_json()
        # TODO: add logic for generating text for slides using openai and generating powerpoint file with that text
        response = openai.Completion.create(
            model=model,
            message=[{"role": "user", "content": "Generate "}]
        )
        return {"byteString": ""}, 200


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
    app.run()
    