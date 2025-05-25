from .PhoneDetection import PhoneDetection
from .NameDetection import NameDetection
from threading import Thread
import queue

class ServiceDetection:
    def __init__(self, model):
        self.model = model
        self.queue = queue.Queue()
        self.phone_detection = PhoneDetection(self.model)
        self.name_detection = NameDetection(self.model)
        print("ServiceDetection initialized")

    def detect_phone(self):        
        data = self.phone_detection.detect_phone(self.string)
        self.queue.put(data)
        print(data)
        return data

    def detect_name(self):
        data = self.name_detection.detect_name(self.string)
        self.queue.put(data)
        print(data)        
        return data    
    
    def __detect_client_id(self):
        th1 = Thread(target=self.detect_phone)
        th1.start()

        th2 = Thread(target=self.detect_name)
        th2.start()

        th1.join()
        th2.join()
        
        ids = []
        while not self.queue.empty():
            item = self.queue.get()
            ids.append(item['client_id'])

        client_id_by_phone, client_id_by_name = ids[0], ids[1] 
        
        if client_id_by_phone and client_id_by_name:
            client_id = client_id_by_name if client_id_by_name == client_id_by_phone else 0
        else:
            client_id = client_id_by_phone or client_id_by_name
        return client_id 
    
    def detect_service(self, string):
        self.string = string
        
        client_id = self.__detect_client_id()           
        location_id = 0
        check_login = 1

        self.model._cursor.execute(f"EXEC CB_DetectService ?, ?, ?, ?", self.string, client_id, location_id, check_login)    
        return self.model._cursor.fetchone()[0]        