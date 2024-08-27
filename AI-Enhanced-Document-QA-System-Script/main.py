import os
from dotenv import load_dotenv
from pinecone import Pinecone
from bertopic import BERTopic
from transformers import BertTokenizer, BertModel
import torch

load_dotenv()

api_key = os.getenv('PINECONE_API_KEY')
index_name = os.getenv('PINECONE_INDEX_NAME')
target_topic = os.getenv('TARGET_TOPIC')

pineconeClient = Pinecone(api_key=api_key)
index = pineconeClient.Index(index_name)


class CustomBertModel(torch.nn.Module):
    def __init__(self):
        super(CustomBertModel, self).__init__()
        self.bert = BertModel.from_pretrained('bert-large-uncased')
        # Update this if your index has a different dimension
        self.fc = torch.nn.Linear(self.bert.config.hidden_size, 1536)

    def forward(self, input_ids, attention_mask=None, token_type_ids=None):
        # Pass all arguments to the BERT model
        outputs = self.bert(
            input_ids=input_ids, attention_mask=attention_mask, token_type_ids=token_type_ids)
        hidden_state = outputs.last_hidden_state
        cls_token = hidden_state[:, 0, :]  # Use the [CLS] token representation
        return self.fc(cls_token)


tokenizer = BertTokenizer.from_pretrained('bert-large-uncased')
model = CustomBertModel()


def normalize_vector(vector):
    min_val, max_val = -1, 1
    vector = torch.clamp(vector, min=min_val, max=max_val)
    return vector


def encode(text):
    inputs = tokenizer(text, return_tensors="pt")
    with torch.no_grad():
        output = model(**inputs).squeeze()
        output = torch.clamp(output, min=-1, max=1)  # Clamp values to [-1, 1]
        return output.cpu().numpy().tolist()


# Convert your target topic to a vector
# target_topic =  'Action/Adventure'
query_vector = encode(target_topic)


# Verify the query vector length
expected_dim = 1536  # Update this if your index has a different dimension
if len(query_vector) != expected_dim:
    raise ValueError(
        f"Query vector has incorrect dimensionality. Expected {expected_dim}, got {len(query_vector)}")

# Check if all values are within the range [-1, 1]
if not all(-1 <= val <= 1 for val in query_vector):
    raise ValueError("Query vector contains values outside the range [-1, 1]")


# Retrieve documents from Pinecone (assuming they are stored as vectors with metadata)
results = index.query(
    vector=query_vector,
    top_k=10,
    include_values=True,
    include_metadata=True,
)

docs = [match['metadata'].get('text', 'No text found')
        for match in results.get('matches', [])]
# print("values ====>", docs)

# Perform topic modeling using BERTopic
topic_model = BERTopic()
if len(docs) > 0:
    topics, probs = topic_model.fit_transform(docs)
    # Iterate over documents and update Pinecone metadata with the extracted topics
    for i, doc in enumerate(results['matches']):
        doc_id = doc['id']
        topic_id = topics[i]
        topic_label = topic_model.get_topic(topic_id)
        # Update the document metadata with the topic information
        index.update(id=doc_id, set_metadata={
            'related': topic_label[0][0]
        })
