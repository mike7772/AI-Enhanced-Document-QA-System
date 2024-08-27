# AI Enhanced Document QA System Explanation

## Backend Development

The backend is built with Node.js and Express, featuring endpoints for document ingestion and question answering. The ingestion endpoint processes PDF and plain text files, while the question-answering endpoint responds to user queries based on the ingested documents. 

The document processing pipeline includes text extraction from PDFs and vector embedding generation. These embeddings are stored in Pinecone for efficient search and retrieval. I have also used openai for embedding the texts using the text-embedding-ada-002 model which uses 1536 dimensions. 

besides that, The backend ensures input validation and robust error handling to manage file format issues, processing errors, and invalid queries.

### Technologies used
- Express, OpenAI, Pinecone

## Frontend Development
 features a user-friendly interface designed for seamless interaction. It includes a document upload section where users can submit files and monitor their processing status in real time. Additionally, a question and answer form allows users to enter queries and view the generated responses. To enhance the user experience, the interface also visualizes relevant document chunks and displays confidence scores for the answers, providing clear insights into the system's responses.

### Technologies used
- React, tailwind , antd

AI Integration: Leverage advanced AI APIs for text analysis and question answering, implementing RAG for improved response accuracy.

## Python Script
The Python script performs basic topic modeling on ingested documents using BERTopic, an NLP library designed for topic extraction. It processes the text to identify and categorize key topics, which are then used to update the document metadata in Pinecone. This integration enhances document organization and retrieval by associating each document with relevant topics, thus improving search accuracy and thematic categorization.

### Technologies used
- Python, BERTopic, Pinecone

## Challenges Faced

- One of the key challenges encountered was the lack of a proper OpenAI API key capable of performing the necessary embeddings. This issue impacted the ability to generate and utilize vector embeddings effectively for document processing and retrieval.