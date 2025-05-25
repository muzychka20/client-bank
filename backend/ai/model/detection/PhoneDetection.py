import spacy
from spacy.matcher import Matcher
from ..Utils import Utils


class PhoneDetection:
    def __init__(self, model):        
        self.model = model
        print("PhoneDetection initialized")       
        
    def __spacy_detect_phone(self, string):        
        string = Utils.normalize_string(string)

        # Initialize spaCy's Matcher
        matcher = Matcher(self.model._nlp.vocab)

        # Define patterns for different phone number formats
        patterns = [
            # +38(068)-606-81-52 / 38(068)-606-81-52
            [{"TEXT": {"REGEX": r"\+?\d{2}"}}, {'ORTH': '('}, {'SHAPE': 'ddd'}, {'ORTH': ')'}, {'ORTH': '-'},
             {'SHAPE': 'ddd'}, {'ORTH': '-'}, {'SHAPE': 'dd'}, {'ORTH': '-'}, {'SHAPE': 'dd'}],

            # Format: +380686068152 / 380686068152
            [{"TEXT": {"REGEX": r"^\+?38\d{10}$"}}],

            # Format: 0686068152 but must start with 0
            [{"TEXT": {"REGEX": r"^0\d{9}$"}}],

            # Format: (068)-606-81-52
            [{'ORTH': '('}, {'SHAPE': 'ddd'}, {'ORTH': ')'}, {'ORTH': '-'}, {'SHAPE': 'ddd'}, {'ORTH': '-'},
             {'SHAPE': 'dd'}, {'ORTH': '-'}, {'SHAPE': 'dd'}],

            # Format: 068-606-81-52
            [{'SHAPE': 'ddd'}, {'ORTH': '-'}, {'SHAPE': 'ddd'}, {'ORTH': '-'}, {'SHAPE': 'dd'}, {'ORTH': '-'},
             {'SHAPE': 'dd'}],

            # Format: 068-606-8152
            [{"SHAPE": "ddd"}, {"ORTH": "-"}, {"SHAPE": "ddd"}, {"ORTH": "-"}, {"SHAPE": "dddd"}]
        ]

        # Add patterns to the matcher
        matcher.add("PHONE_NUMBER", patterns)

        # Update tokenizer infixes to handle phone-specific characters
        infixes = self.model._nlp.Defaults.infixes + [r"[\(\)-]"]
        self.model._nlp.tokenizer.infix_finditer = spacy.util.compile_infix_regex(infixes).finditer

        # Process the string with spaCy
        doc = self.model._nlp(string)
        matches = matcher(doc)

        # Extract and normalize matched phone numbers
        spans = []
        for _, start, end in matches:
            span = doc[start:end]
            spans.append(span.text)
        
        # Normalize numbers (remove non-numeric characters and leading country code '38')
        normalized_numbers = set(Utils.normalize_phone(el) for el in spans)
        return list(normalized_numbers)

    def __detect(self, predicted_entities):
        data = []
        
        query = """
            SELECT client AS client_id, title AS client_phone 
            FROM refContactActive 
            WHERE title LIKE ?
        """

        # Query the database for each predicted phone number
        for prediction in predicted_entities:
            self.model._cursor.execute(query, [f"%{prediction}%"])
            result = self.model._cursor.fetchone()
            if result:
                data.append({"client_id": result[0], "client_phone": result[1]})
        return data[0] if len(data) == 1 else {"client_id": 0, "client_phone": ''}

    def detect_phone(self, string):      
        phones = self.__spacy_detect_phone(string) # Detect phone numbers in the string
        phone = self.__detect(phones) # Validate the detected phone numbers against the database
        return phone