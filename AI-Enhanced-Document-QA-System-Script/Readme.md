# Getting Started with AI Enhanced Document QA System Topic Modelling

This Python script performs topic modeling on ingested documents using BERTopic and updates their metadata in Pinecone with the extracted topics. It enhances the searchability of the document.

## Deployment Steps

1. Run `git clone https://github.com/mike7772/AI-Enhanced-Document-QA-System-Script.git`
2. Run `cd AI-Enhanced-Document-QA-System-Script`  
3. Rename the `env.default` file to `.env` and the api key for pinecone `PINECONE_API_KEY` 
4. Then Run `./start.sh`  It will install all the dependencies and run the file for the topic modeling
5. To change the topic for the topic modeling change `TARGET_TOPIC` in the `.env` file.
   