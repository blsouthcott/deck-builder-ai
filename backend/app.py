import os
import re
import logging
from io import BytesIO
from base64 import b64encode

from flask import Flask, request
from flask_cors import CORS
from flask_restful import Api, Resource
import openai

from pptx_utils import text_to_slide_objs, gen_presentation


openai.api_key = os.getenv("OPENAI_API_KEY")
MODEL = "gpt-3.5-turbo"
TEMPERATURE = 0.5

# defaults if not in request body
TOPIC_COUNT = 5
SLIDE_COUNT = 10
CHARACTER_LIMIT = 300


logging.basicConfig(level=logging.DEBUG)


def get_chat_completion(prompt, model=MODEL, temperature=TEMPERATURE):

    resp = openai.ChatCompletion.create(
        model=model,
        messages=[{
            "role": "user",
            "content": prompt
        }],
        temperature=temperature
    )

    return resp["choices"][0]["message"]["content"]


class PresentationIdeas(Resource):

    def post(self):
        body = request.get_json()

        previous_topics = body.get("previousTopics")
        if not (topic_count := body.get("topicCount")):
            topic_count = TOPIC_COUNT

        prompt = f"Generate a list of {topic_count} different topic ideas for a PowerPoint presentation. Put each topic on a new line and keep it concise."
        if previous_topics:
            prompt += f" Do not include any of the following topics: {','.join(previous_topics)}"

        resp_content = get_chat_completion(prompt)
        topics = resp_content.split("\n")
        for i in range(len(topics)):
            topics[i] = re.sub("\d+\.?\s*", "", topics[i]).strip('"').strip("-")

        logging.debug(f"Here are the topics: {topics}")
        return {"topics": topics}, 200


class SlideDeck(Resource):

    def post(self):
        body = request.get_json()

        # collecting data from chatgpt
        if not (topic := body.get("topic")):
            return "Presentation topic is required. Please include a 'topic' field in the request body", 400
        
        slide_count = body.get("slide_count")
        character_limit = body.get("character_limit")
        
        prompt = f'''You are an expert on the topic of "{topic}". Generate the content for a PowerPoint presentation on that topic. The following text, enclosed in ", is the format for a complete presentation that is 3 slides long. Parts that you should fill out start with [ and end with ].\n"\nPresentation Title: [catchy title for your presentation]\nSlide 1\nTitle: [catchy title for Slide 1 (cannot be the word 'Introduction')]\nContent:\n[bulleted list of points for Slide 1] (use full but very concise sentences)\nSlide 2\nTitle: [catchy title for Slide 2]\nContent:\n[bulleted list of points for Slide 2] (use full but very concise sentences)\nSlide 3\nTitle: [clever title for Slide 3 (cannot be the word 'Conclusion')]\nContent:\n[bulleted list of points for Slide 3] (use full but very concise sentences)\n"\nUse this format to create exactly {slide_count if slide_count else SLIDE_COUNT} slides, which should include a conclusive final slide. The slide content must not exceed {character_limit if character_limit else CHARACTER_LIMIT}. Do not add anything before or after the presentation.'''
        resp_content = get_chat_completion(prompt)
        logging.debug("This is the response: ", resp_content)
        
        slides = text_to_slide_objs(resp_content)
        theme = body.get("theme")
        pres_bytestring = gen_presentation(slides, theme)

        return {"byteString": pres_bytestring}, 200


def create_app():
    app = Flask(__name__)
    CORS(app, origins=os.environ["ALLOWED_HOSTS"])
    app.config["SECRET_KEY"] = os.environ["SECRET_KEY"]
    return app


app = create_app()
api = Api(app)
api.add_resource(PresentationIdeas, "/api/topics")
api.add_resource(SlideDeck, "/api/slideDeck")


if __name__ == "__main__":
    app.run()
    