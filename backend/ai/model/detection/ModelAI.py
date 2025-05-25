from ..const_values import connectionString
import pyodbc
import spacy


class ModelAI:
    _instance = None

    def __new__(cls, *args, **kwargs):
        if not cls._instance or True:
            cls._instance = super().__new__(cls)
            cls._instance._initialize(*args, **kwargs)
            print("ModelAI initialized")
        return cls._instance


    def _initialize(self):
        self._nlp = spacy.load("./ai/model/model-ai")   

        self.__connection = pyodbc.connect(connectionString)
        self._cursor = self.__connection.cursor()   
          
        query = """
            SELECT cl.id, cl.keyname, cl_ai.name_variation
            FROM refClient_AI as cl_ai
            LEFT JOIN refClient as cl on cl.id = cl_ai.client_id
            order by id desc
        """

        self.index = {}
        
        self._cursor.execute(query)
        records = self._cursor.fetchall()
        
        for record in records:
            self.index[record.name_variation.title()] = {"client_id": record.id, "client_name": record.keyname.title()}    