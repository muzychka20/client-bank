from spacy.training import Example
from spacy.tokens import DocBin
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import confusion_matrix, classification_report
from detection.PhoneDetection import PhoneDetection
from detection.NameDetection import NameDetection
from detection.ServiceDetection import ServiceDetection
from detection.ModelAI import ModelAI
from threading import Thread
from queue import Queue


# initialize model
model = ModelAI()
phone_detection = PhoneDetection(model)
name_detection = NameDetection(model)
service_detection = ServiceDetection(model)

print("===================== Test phones =====================")
assert phone_detection.detect_phone("Here are some phone number: +380686068152")['client_phone'] == "0686068152"
assert phone_detection.detect_phone("Here are some phone number: 380686068152")['client_phone'] == "0686068152"
assert phone_detection.detect_phone("Here are some phone number: 0686068152")['client_phone'] == "0686068152"
assert phone_detection.detect_phone("Here are some phone number: 068-606-81-52")['client_phone'] == "0686068152"
assert phone_detection.detect_phone("Here are some phone number: 068-606-81-52")['client_phone'] == "0686068152"
assert phone_detection.detect_phone("Here are some phone number: (068)-606-81-52")['client_phone'] == "0686068152"
assert phone_detection.detect_phone("Here are some phone number: 38(068)-606-81-52")['client_phone'] == "0686068152"
assert phone_detection.detect_phone("Here are some phone number: +38(068)-606-81-52")['client_phone'] == "0686068152"
print("====== All phone test cases passed successfully! ======")

print("=================== Load test data ====================")
doc_bin = DocBin().from_disk("./creation/train_data/test_data.spacy")
test_docs = list(doc_bin.get_docs(model._nlp.vocab))
print(f"Loaded {len(test_docs)} test documents")

print("============ Test services with threads ===============")
def test_service_detection(doc):
    try:
        return service_detection.detect_service(doc.text)        
    except Exception as e:
        print(e)

threads = []
results_queue = Queue()

positive = 0
negative = 0

for doc in test_docs:
    srv = test_service_detection(doc)
    if srv and srv != 0:
        positive += 1
    else:
        negative += 1
   
print(f"Positive: {positive}, Negative: {negative}")
   
print("=== Service detection threading tests completed! ===")

print("=================== Test names =====================")
examples = []
for doc in test_docs:
    example = Example.from_dict(doc, {"entities": [(ent.start_char, ent.end_char, ent.label_) for ent in doc.ents]})
    examples.append(example)

# Extract True & Predicted Labels
y_true = []
y_pred = []
labels = set()  # To store all unique entity labels

for example in examples:
    doc = example.reference  # True annotated doc
    pred_doc = model._nlp(doc.text)  # Model's prediction

    true_ents = {(ent.start_char, ent.end_char, ent.label_)
                 for ent in doc.ents}
    pred_ents = {(ent.start_char, ent.end_char, ent.label_)
                 for ent in pred_doc.ents}

    for ent in true_ents:
        y_true.append(ent[2])  # Append true entity label
        if ent in pred_ents:
            y_pred.append(ent[2])  # Correctly predicted
        else:
            y_pred.append("O")  # Missed entity

    for ent in pred_ents:
        if ent not in true_ents:
            y_true.append("O")  # Extra entity predicted
            y_pred.append(ent[2])

    labels.update([ent[2] for ent in true_ents])
    labels.update([ent[2] for ent in pred_ents])

# Compute Confusion Matrix
labels = sorted(list(labels | {"O"}))  # Ensure "O" (no entity) is included
cm = confusion_matrix(y_true, y_pred, labels=labels)

# Plot Confusion Matrix
plt.figure(figsize=(10, 7))
sns.heatmap(cm, annot=True, fmt="d", cmap="Blues",
            xticklabels=labels, yticklabels=labels)
plt.xlabel("Predicted Labels")
plt.ylabel("True Labels")
plt.title("NER Confusion Matrix")
plt.show()

# Print Classification Report
print("\nClassification Report:")
print(classification_report(y_true, y_pred, labels=labels))
