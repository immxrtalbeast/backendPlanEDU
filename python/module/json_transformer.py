import json
import os
import sys
import random as rnd
sys.path.append(os.path.dirname(__file__))
from pdfread_new import get_practice_pdf


#TODO
# Функция для создания иерархии
def create_hierarchy(discipline_name:str, link_id) -> list:
    data = get_practice_pdf(link_id, discipline_name)
    root = {
        discipline_name:{
                "categories" : []
        }
    }
    
    result = {}
    topics = []
    for item in data:
        if "Раздел" in item:
            if result:
                result["topics"] = topics
                root[discipline_name]["categories"].append(result)
                result = {}
                topics = []
            item = item.replace("Раздел", '')
            parts = item.split()
            name = ' '.join(parts[1:])
            result["name"] = name

        else:
            parts = item.split()
            name = ' '.join(parts[1:])
            name = name.replace('/Пр/', '')
            topics.append(name)


    
    return root
