from pymongo import MongoClient
import json
import os
import sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from module.parse import get_disciplines, get_url_direction
from module.json_transformer import create_hierarchy
# Подключение к базе данных planedu
client = MongoClient("mongodb://mongo:27017")#client = MongoClient("localhost", 27017)("mongodb://mongo:27017")

db = client.planedu

 

async def create_tables():
    db.create_collection('faculties')
    db.create_collection('roadmaps')
    db.create_collection('disciplines')

async def delete_tables():
    db.faculties.drop()
    db.roadmaps.drop()
    db.disciplines.drop()
    print("Коллекции удалены")

async def get_faculties_db():
    #Подключение к папке факультеты
    faculties = db.faculties
    data = (faculties.find_one({"table": 1}))
    if data:
        return data['faculties']
    else:
        script_dir = os.path.dirname(os.path.abspath(__file__))
        file_path = os.path.join(script_dir, "faculties.json")
        with open(file_path, 'r', encoding='utf-8') as file:
            test = json.load(file)
        faculties.insert_one({"faculties": test, "table": 1})

        data = (faculties.find_one({"table": 1}))
        return data['faculties']






async def get_roadmaps_db(discipline:str, link_id:str):
    roadmaps = db.roadmaps
    data = (roadmaps.find_one({"table": 2}))
    try: 
        data = roadmaps.find_one({"table": 2})["roadmaps"][discipline] 
        return data
    except:
        await set_roadmap_db(discipline, link_id) # Если не существует, то подкачиваем и парсим
        return (roadmaps.find_one({"table": 2}))["roadmaps"][discipline]

  

async def set_roadmap_db(discipline_name:str, link_id:str):
    roadmaps = db.roadmaps
    data = create_hierarchy(discipline_name, link_id)
    if (roadmaps.find_one({"table": 2})): # Если коллекция уже существует добавляем новый элемент
        update_one_roadmap(discipline_name, data)
        return
    else:
        roadmaps.insert_one({"roadmaps": data, "table": 2})
        return


async def user_history():
    histories = db.histories


async def get_disciplines_db(direction:str):
    disciplines = db.disciplines
    data = disciplines.find_one({"table": 1})
    try: 
        data = disciplines.find_one({"table": 1})["disciplines"][direction] 
        return data
    except:
        await set_disciplines_db(get_url_direction(direction), direction) # Если не существует, то подкачиваем и парсим
        return (disciplines.find_one({"table": 1}))["disciplines"][direction]



async def set_disciplines_db(url: str, direction: str):
    disciplines = db.disciplines
    data_json = get_disciplines(url, direction)

    if (disciplines.find_one({"table": 1})): # Если коллекция уже существует добавляем новый элемент
        update_one_discipline(direction, data_json[direction])
    else:
        disciplines.insert_one({"disciplines": data_json, "table": 1}) # В противном случае вставляем новую коллекцию


def update_one_discipline(direction: str, data):
    disciplines = db.disciplines
    disciplines.update_one(
    {"table": 1},  
    {"$set": {f"disciplines.{direction}": data}} 
)


def update_one_roadmap(discipline: str, data):
    roadmaps = db.roadmaps
    roadmaps.update_one(
    {"table": 2},  
    {"$set": {f"roadmaps.{discipline}": data[discipline]}} 
)
    