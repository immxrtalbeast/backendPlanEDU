import PyPDF2
import re
import os
from parse import get_pdf

def extract_text(link, file_name):
    if not os.path.exists(f"{file_name}.pdf"):
        get_pdf(link, file_name)
    pdf_file = open(f'{file_name}.pdf', 'rb')
    pdf_reader = PyPDF2.PdfReader(pdf_file)


    start_page = 0
    end_page = len(pdf_reader.pages) -1 


    text = ''
    for page_num in range(start_page, end_page + 1):
        page = pdf_reader.pages[page_num]
        text += page.extract_text()

    pdf_file.close()
    os.remove(f"{file_name}.pdf")
    return get_topics_and_sections(text)

def get_topics_and_sections(text):
    pattern = re.compile(r'^(\d+\.\d+)\s+(.*?)/(\w+)/', re.MULTILINE | re.DOTALL)

    matches = pattern.findall(text)

    section_pattern = re.compile(r'Раздел \d+\. .*?(?=\n\n|\n\d+\.|\Z)', re.MULTILINE | re.DOTALL)
    trash_pattern = re.compile(r"стр\. \d+.*\.plx")

    sections = section_pattern.findall(text)
    cleaned_sections = []
    for section in sections:

        cleaned_section = trash_pattern.sub("", section)
        cleaned_sections.append(cleaned_section)



    extracted_data = []
    for match in matches:
        section_number = match[0]
        topic_name = re.sub(r'ОПК-?\d+\.\d+\.\d+', '', match[1]).strip()
        class_type = match[2]
        extracted_data.append(f" {section_number} {topic_name} /{class_type}/")


    topics = []

    for data in extracted_data:
        if "/Пр/"  in data:
            topics.append(data.strip())
    return combine_data(cleaned_sections, topics)


def combine_data(sections, topics):
    result = []
    result.append(sections[0])  
    i = 0 

    for topic in topics:

        if topic.split('.')[0] == sections[i].split(' ')[1].split('.')[0]:
            result.append(topic)
        else:
            i += 1
            result.append(sections[i])  
            if topic.split('.')[0] == sections[i].split(' ')[1].split('.')[0]:
                result.append(topic)


    return result


def get_practice_pdf(link, file_name):
    return extract_text(link, file_name)

