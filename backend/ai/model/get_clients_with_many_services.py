from spacy.tokens import DocBin
from detection.ModelAI import ModelAI

model = ModelAI()
doc_bin = DocBin().from_disk("./creation/train_data/test_data.spacy")
test_docs = list(doc_bin.get_docs(model._nlp.vocab))

def format_for_sql(docs):
    # Extract text from each Doc object and escape single quotes
    formatted = []
    for doc in docs:
        text = doc.text.replace("'", "''")
        formatted.append(f"'{text}'")
    return ", ".join(formatted)

# Get a list of payment assignment texts
keyname_list = format_for_sql(test_docs)

query = f"""
SELECT cl.id, cl.keyname, COUNT(s.id) as service_count
FROM wtKlientBank kb
LEFT JOIN wtServices s ON s.id = kb.service_id
LEFT JOIN refClient cl ON cl.id = s.client
WHERE kb.NaznP IN ({keyname_list})
GROUP BY cl.id, cl.keyname, kb.NaznP
HAVING COUNT(s.id) > 1
"""

print("Executing query:")
print(query)
print("\nResults:")
model._cursor.execute(query)
results = model._cursor.fetchall()
for row in results:
    print(f"Client ID: {row[0]}, Name: {row[1]}, Service Count: {row[2]}")
print(f"Total results: {len(results)}")

# Total results: 1507