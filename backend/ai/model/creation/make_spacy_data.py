import spacy
from spacy.tokens import DocBin
import pandas as pd
import random

# Load the pretrained SpaCy model
nlp = spacy.load("uk_core_news_lg")

def load_training_data(file_path):
    """
    Loads data from CSV and prepares it for SpaCy.
    
    :param file_path: Path to the CSV file with the markup
    :return: List of tuples (text, [(start, end, label)])
    """
    df = pd.read_csv(file_path, delimiter="|", names=[
                     "naznp", "entity", "label", "start", "end"], dtype={"start": "Int64", "end": "Int64"})
    training_data = []

    for _, row in df.iterrows():
        if pd.notna(row["start"]) and pd.notna(row["end"]):
            training_data.append(
                (row["naznp"], [(int(row["start"]), int(row["end"]), row["label"])]))

    return training_data


# Function to split data (90% train / 10% test) at the level of each file
def split_data(data, train_ratio=0.9):
    random.shuffle(data)
    split_idx = int(len(data) * train_ratio)
    return data[:split_idx], data[split_idx:]


# Load data from each file and immediately split into train/test
file_paths = [
    "./csv/city_train_data.csv",
    "./csv/street_train_data.csv",
    "./csv/name_train_data.csv",
]

train_data, test_data = [], []

for path in file_paths:
    print("loaded: ", path)
    data = load_training_data(path)
    train, test = split_data(data)
    train_data.extend(train)
    test_data.extend(test)

# Shuffling
random.shuffle(train_data)
random.shuffle(test_data)

# Function to save data in SpaCy format
def save_spacy_data(data, output_file):
    db = DocBin()

    for text, annotations in data:
        doc = nlp(text)
        ents = []

        for start, end, label in annotations:
            span = doc.char_span(start, end, label=label)
            if span is not None:
                ents.append(span)

        if ents:
            doc.ents = ents
            db.add(doc)

    db.to_disk(output_file)
    print(f"✅ Данные сохранены: {output_file}")


# Save training and test data
save_spacy_data(train_data, "./training_data.spacy")
save_spacy_data(test_data, "./test_data.spacy")


# Step 4: Training model
# 1. Create a config file for training SpaCy, if it doesn't exist
# python -m spacy init config ./config.cfg --lang uk --pipeline ner --optimize accuracy

# last one with train and test data in config train model
# python -m spacy train config_ai.cfg --output ./output/model-ai
