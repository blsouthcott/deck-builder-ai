import os
import re
import logging

from flask import Flask, request
from flask_cors import CORS
from flask_restful import Api, Resource
import openai

from pptx import Presentation
from io import BytesIO
from base64 import b64encode


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

        if not (topic_count := body.get("topicCount")):
            topic_count = TOPIC_COUNT

        prompt = f"Generate a list of {topic_count} different topic ideas for a PowerPoint presentation. Put each topic on a new line and keep it concise."
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
        
        prompt = f'You are an expert on the topic of "{topic}". You are currently writing the content for a PowerPoint presentation on that topic. Start by writing down a clever title for your presentation. Follow that with {slide_count if slide_count else SLIDE_COUNT} slides_info that go from Introduction to Conclusion in a logical order. Each slide must have a Title and Content. Try to use full but very concise sentences for the content. Organize the content into lists. You must not let any slide go over {character_limit if character_limit else CHARACTER_LIMIT} characters in length. Do not add anything before or after the presentation.'
        resp_content = get_chat_completion(prompt)
        response_content_lines = resp_content.split("\n")

        # organizing the data generated by chatgpt
        slides_info = []
        current_slide = -1
        for line in response_content_lines[3:]:
            if line[:7] == "Title: ":
                slides_info.append({"title": line[7:], "content": []})
                current_slide += 1
            elif line[:1] == "-":
                slides_info[current_slide]["content"].append(line[2:])

        # setting up the presentation
        presentation = Presentation()
        title_slide_layout = presentation.slide_layouts[0]
        bullet_slide_layout = presentation.slide_layouts[1]

        # setting up the title slide
        presentation_title = resp_content[7:resp_content.find("\n")].strip('"').strip("'")  # strips quotation marks because the ai sometimes likes to add them to the titles
        slide = presentation.slides.add_slide(title_slide_layout)
        title = slide.shapes.title
        title.text = presentation_title

        # setting up the other slides
        for slide_info in slides_info:
            slide = presentation.slides.add_slide(bullet_slide_layout)

            shapes = slide.shapes
            title_shape = shapes.title
            body_shape = shapes.placeholders[1]

            # adds the slide's title
            title_shape.text = slide_info["title"]

            # adding the first bullet point
            text_frame = body_shape.text_frame
            text_frame.text = slide_info["content"][0]

            # skips the first line and adds the rest as bullet points
            for i in range(1, len(slide_info["content"])):
                p = text_frame.add_paragraph()
                p.text = slide_info["content"][i]
                p.level = 0

        # finally saves the finished pptx file
        pres_bytes = BytesIO()
        presentation.save(pres_bytes)
        pres_bytestring = b64encode(pres_bytes.getvalue()).decode()
        # presentation.save('test.pptx')

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
    