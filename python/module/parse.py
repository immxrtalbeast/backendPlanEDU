import requests
from bs4 import BeautifulSoup
import chardet
import re

def get_disciplines(url: str, direction_name: str):

    response = requests.get(url)

    if response.status_code == 200:
        # Получаем всю HTML страничку
        #dammit = UnicodeDammit(response.content)

        detected_encoding = chardet.detect(response.content)['encoding']
        html_doc = response.content.decode(detected_encoding)
        #html_doc = dammit.unicode_markup
        clean_html = re.sub(r'[^\x00-\x7F]+', '', html_doc)
        soup = BeautifulSoup(html_doc, 'html.parser')
        
        # Находим все ссылки
        aLinks = soup.find_all('a', class_='aLink')


        disciplines = {f'{direction_name}': []}
        # Найдём все ссылки на РПД
        for a_tag in aLinks:

            if "РПД" in a_tag.get_text():
                


                filename = a_tag.find_parent().find_parent().find(class_="dxgv dx-al") # Ссылка на html элемент с именем
                file_url = a_tag['href'].split("=")[1].split('&')[0]
                print(filename.get_text(), file_url)
                parent_element = filename.find_parent() # Ссылка на родителя чтобы найти курс и семестр
                ac_elements = parent_element.find_all(class_="dxgv dx-ac") # Все элементы с классом как у курса и семестра
                kyrs = ac_elements[2]
                semestr = ac_elements[3]

                disciplines[f'{direction_name}'].append(
                    {"name": filename.get_text(),
                     "course": (kyrs.get_text()),
                     "semester": (semestr.get_text()),
                     "link" : file_url
                    }
                     )

        return disciplines
def get_pdf(id_url, name):
        url = f"https://lk.donstu.ru/RPDPrint/printrp?id={id_url}&isPDF=true"
        try:
            # Выполняем GET-запрос
            response = requests.get(url)
            response.raise_for_status()

            # Сохраняем содержимое в файл
            with open(f"{name}.pdf", "wb") as file:
                file.write(response.content)

            print(f"Файл успешно сохранен как '{name}'")

        except requests.exceptions.RequestException as e:
            print(f"Ошибка при загрузке файла: {e}")



def get_url_direction(direction: str) -> str:

    dic = {
        # ИиВТ
        "ВКБ" : "https://edu.donstu.ru/Plans/Plan.aspx?id=50117",
        "ВИАС" : "https://edu.donstu.ru/Plans/Plan.aspx?id=48732",
        "ВПР" : "https://edu.donstu.ru/Plans/Plan.aspx?id=50104",
        "ВМО" : "https://edu.donstu.ru/Plans/Plan.aspx?id=50288",

        #АгроПром
        "ЭИБ" : "https://edu.donstu.ru/Plans/Plan.aspx?id=48767",
        "АТК" : "https://edu.donstu.ru/Plans/Plan.aspx?id=48601",
        "АЗТК" : "https://edu.donstu.ru/Plans/Plan.aspx?id=51236",
        "АБ" : "https://edu.donstu.ru/Plans/Plan.aspx?id=49735",


        #Авиа
        "АВЗТ" : "https://edu.donstu.ru/Plans/Plan.aspx?id=49811",
        "АВЭ" : "https://edu.donstu.ru/Plans/Plan.aspx?id=49812",
        "АВТ": "https://edu.donstu.ru/Plans/Plan.aspx?id=50951",
        "АВЗН" : "https://edu.donstu.ru/Plans/Plan.aspx?id=49796",

        #АМиУ
        "УМТ" : "https://edu.donstu.ru/Plans/Plan.aspx?id=48803",
        "УЗМТ" : "https://edu.donstu.ru/Plans/Plan.aspx?id=48800",
        "УНЭ" : "https://edu.donstu.ru/Plans/Plan.aspx?id=48792",
        "ПФМ": "https://edu.donstu.ru/Plans/Plan.aspx?id=48574"
        

    }
    return dic[direction]
