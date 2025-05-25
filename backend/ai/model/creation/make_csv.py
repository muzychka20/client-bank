import pyodbc
import csv
from backend.ai.model.const_values import connectionString


connection = pyodbc.connect(connectionString)
cursor = connection.cursor()


def extract_and_save(category, sql_query, output_file, entity_label, ignored_words=None):
    """
    Extracts data from the database, filters it and saves it to a CSV.
    :param category: Category ("STREET" or "CITY")
    :param sql_query: SQL query to get data
    :param output_file: Output file name
    :param entity_label: Entity label ("STREET" or "CITY")
    :param ignored_words: Ignored words (for streets)
    """
    records = cursor.execute(sql_query)

    res = []
    with open(output_file, 'w', encoding='utf-8', newline='') as f:
        writer = csv.writer(f, delimiter='|')
        for record in records:
            split_record = record[0].split(',')
            for item in split_record:
                item = item.strip()

                if ignored_words and item.lower() in ignored_words:
                    continue  # Skip ignored words

                if item and item not in res and not item.isdigit():
                    res.append(item)
                    writer.writerow([item, entity_label])

    return res


# SQL query for streets
SQL_STREETS = """
    select RTRIM(LTRIM(keyname_ii)) from refStreet where id != 0 and keyname_ii is not null and RTRIM(LTRIM(keyname_ii)) not like '' and RTRIM(LTRIM(keyname_ii)) not like '-' and RTRIM(LTRIM(keyname_ii)) not like '...'
    union all
    select RTRIM(LTRIM(keyname)) from refStreet where id != 0 and keyname is not null and RTRIM(LTRIM(keyname)) not like '' and RTRIM(LTRIM(keyname)) not like '-' and RTRIM(LTRIM(keyname)) not like '...'
    union all
	select RTRIM(LTRIM(fullname)) from refStreet where id != 0 and fullname is not null and RTRIM(LTRIM(fullname)) not like '' and RTRIM(LTRIM(fullname)) not like '-' and RTRIM(LTRIM(fullname)) not like '...'
    union all
	select RTRIM(LTRIM(oldname)) from refStreet where id != 0 and oldname is not null and RTRIM(LTRIM(oldname)) not like '' and RTRIM(LTRIM(oldname)) not like '-' and RTRIM(LTRIM(oldname)) not like '...'
    union all
    select RTRIM(LTRIM(keyname_ukr)) from refStreet where id != 0 and keyname_ukr is not null and RTRIM(LTRIM(keyname_ukr)) not like '' and RTRIM(LTRIM(keyname_ukr)) not like '-' and RTRIM(LTRIM(keyname_ukr)) not like '...'
"""

# SQL query for cities
SQL_CITIES = """
    select RTRIM(LTRIM(name_ii)) from refCity where id != 0 and name_ii is not null and RTRIM(LTRIM(name_ii)) not like '' and RTRIM(LTRIM(name_ii)) not like '-' and RTRIM(LTRIM(name_ii)) not like '...'
    union all
    select RTRIM(LTRIM(name)) from refCity where id != 0 and name is not null and RTRIM(LTRIM(name)) not like '' and RTRIM(LTRIM(name)) not like '-' and RTRIM(LTRIM(name)) not like '...'
    union all
    select RTRIM(LTRIM(name_ukr)) from refCity where id != 0 and name_ukr is not null and RTRIM(LTRIM(name_ukr)) not like '' and RTRIM(LTRIM(name_ukr)) not like '-' and RTRIM(LTRIM(name_ukr)) not like '...'
"""

SQL_NAMES = """
    select keyname from refClient 
    where id != 0 and keyname is not null and LTRIM(RTRIM(keyname)) <> ''
	AND keyname NOT LIKE '%ЗАКРЫТ%'
	AND keyname NOT LIKE 'Абон'
	AND keyname NOT LIKE 'Абонент'
	AND keyname NOT LIKE '%[0-9]%'
	AND keyname NOT LIKE '%[A-Z]%'
	AND keyname NOT LIKE 'ааа'
	AND keyname IS NOT NULL
	AND (LEN(LTRIM(RTRIM(keyname))) - LEN(REPLACE(LTRIM(RTRIM(keyname)), ' ', '')) + 1) = 3
    union all
    select keyname_ukr from refClient 
    where id != 0 and keyname_ukr is not null and LTRIM(RTRIM(keyname_ukr)) <> ''
	AND keyname_ukr NOT LIKE '%ЗАКРЫТ%'
	AND keyname_ukr NOT LIKE 'Абон'
	AND keyname_ukr NOT LIKE 'Абонент'
	AND keyname_ukr NOT LIKE '%[0-9]%'
	AND keyname_ukr NOT LIKE '%[A-Z]%'
	AND keyname_ukr NOT LIKE 'ааа'
	AND keyname_ukr IS NOT NULL
	AND (LEN(LTRIM(RTRIM(keyname_ukr))) - LEN(REPLACE(LTRIM(RTRIM(keyname_ukr)), ' ', '')) + 1) = 3	
"""

# Ignored words for streets
IGNORED_WORDS_STREETS = {'вул.', 'вул',
                         'ул', 'ул.', 'пр', 'пр.', 'пер', 'пер.'}

# Process streets
streets = extract_and_save(
    "STREET", SQL_STREETS, "./csv/streets.csv", "STREET", IGNORED_WORDS_STREETS)

# Process cities
cities = extract_and_save("CITY", SQL_CITIES, "./csv/cities.csv", "CITY")

# Process names
names = extract_and_save("NAME", SQL_NAMES, "./csv/names.csv", "NAME")


# Function to find and save matches
def find_and_save_matches(category, data_list, output_file):
    SQL = """select NaznP from wtKlientBank"""

    records = cursor.execute(SQL)

    with open(output_file, 'w', encoding='utf-8', newline='') as f:
        writer = csv.writer(f, delimiter='|')
        for record in records:
            naznp = record[0]
            for r in data_list:
                words = naznp.split()

                # If category is NAME, check if full name matches
                if category == "NAME" and r in naznp:
                    start = naznp.find(r)
                    if start != -1:
                        end = start + len(r)
                        print(r, "  :  ", naznp)
                        writer.writerow([naznp, r, category, start, end])

                # For STREET or CITY, check if the word is part of the list
                elif r in words:
                    start = naznp.find(r)
                    if start != -1:
                        end = start + len(r)
                        print(r, "  :  ", naznp)
                        writer.writerow([naznp, r, category, start, end])


# Find and save cities
find_and_save_matches("CITY", cities, "./csv/city_train_data.csv")

# Find and save streets
find_and_save_matches("STREET", streets, "./csv/street_train_data.csv")

# Find and save names
find_and_save_matches("NAME", names, "./csv/name_train_data.csv")
