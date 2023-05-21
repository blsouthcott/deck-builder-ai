from dataclasses import dataclass
import re


@dataclass
class Slide:
    # class to hold the title and content for each slide in the presentation
    title: str = ""
    content: list[str] or None = None


def get_info_from_line(line, info_keyword):
    # replace 'title' or 'content' with nothing, returning the title or content of the slide
    return re.sub(fr"{info_keyword}:?\s*", "", line, flags=re.IGNORECASE).strip().strip('"').strip("'")


def get_slide_content_from_lines(lines, idx):
    # returns the bullet points for a slide as a list of strings
    slide_content = []

    while idx < len(lines):
        if lines[idx].lower().startswith("slide"):
            break

        if lines[idx].lower().startswith("content"):
            content = get_info_from_line(lines[idx], "content")
            if content:
                slide_content.append(content)
        else:
            slide_content.append(lines[idx].strip("-").strip())

        idx += 1

    return slide_content, idx-1


def text_to_slide_objs(text):
    # returns the slides for the presentation as a list of Slide objects 
    lines = [line for line in text.split("\n") if line]
    slides = []

    presentation_title = get_info_from_line(lines[0], "title")
    slides.append(Slide(presentation_title))
    # 0 index slide count
    slide_count = 0

    line_idx = 1
    while line_idx < len(lines):
        if lines[line_idx].lower().startswith("slide"):
            slides.append(Slide())
            slide_count += 1
        elif lines[line_idx].lower().startswith("title"):
            slides[slide_count].title = get_info_from_line(lines[line_idx], "title")
        elif lines[line_idx].lower().startswith("content"):
            slide_content, line_idx = get_slide_content_from_lines(lines, line_idx)
            slides[slide_count].content = slide_content
        line_idx += 1

    return slides
