from ..Utils import Utils


class NameDetection:
    def __init__(self, model): 
        self.model = model                   
        print("NameDetection initialized")       
        
    def spacy_detect_name(self, string):
        string = Utils.normalize_string(string)

        # Process the text with spaCy for original, lowercase, and titlecase variants
        entities = []
        for variant in [string, string.lower(), string.title()]:
            doc = self.model._nlp(variant)
            entities.extend(ent.text for ent in doc.ents if ent.label_ == 'PER' or ent.label_ == 'NAME')

        # Remove overlapping names
        entities = sorted(set(entities), key=len, reverse=True)

        # Combine related entities based on proximity or context
        combined_entities = self.combine_related_entities(entities)

        # Проверяем, что строка содержит ровно 3 слова и каждое слово длиннее 1 символа
        unique_entities = []
        for el in combined_entities:
            words = el.split()
            if len(words) == 3 and all(len(word) > 1 for word in words):
                formatted_entity = el.title()
                if formatted_entity not in unique_entities:
                    unique_entities.append(formatted_entity)

        return unique_entities

    def combine_related_entities(self, entities):
        combined = []

        for i, entity in enumerate(entities):
            # Добавляем текущую сущность в результат
            combined.append(entity)

            # Проверяем, можно ли объединить текущую сущность с другими
            for j in range(len(entities)):
                if i != j and len(entity.split()) == 2 and len(entities[j].split()) == 1:
                    combined_name = f"{entities[j]} {entity}"
                    combined.append(combined_name)

        return combined
    
    def detect(self, predicted_entities):
        if not predicted_entities:            
            return {"client_id": 0, "client_name": ''}
         
        predicted_entities = [prediction.replace('і', 'i').replace('І', 'I').strip() for prediction in predicted_entities]
        
        for prediction in predicted_entities:
            if prediction in self.model.index:
                return self.model.index[prediction]

        return {"client_id": 0, "client_name": ''}
 
    def detect_name(self, string):        
        entities = self.spacy_detect_name(string)  
        result = self.detect(entities)
        return result        