# Getting Started with AI Enhanced Document QA System Backend

The Express server  handles document ingestion and question answering through well-defined endpoints. The system processes PDF or plain text files by extracting and chunking text, performing named entity recognition (NER), and generating vector embeddings. These embeddings are stored in Pinecone for efficient vector-based search and retrieval, which enhances the accuracy of the question-answering functionality

## Deployment Steps

1. Run `git clone https://github.com/mike7772/AI-Enhanced-Document-QA-System-Backend.git`
2. Run `cd AI-Enhanced-Document-QA-System-Backend`
3. Run `npm install` or `yarn install`
4. Rename the `env.default` file to `.env` and add the api key for `PINECONE_API_KEY` and `OPENAI_API_KEY`.
5. Create `public/uploaded_files` on the `src` folder
   ### Development mode 
6. Run `npm run dev` This command will create the log files if its not available and runs the express server. 
   ### Production mode
    #### windows
    - change value for `posttranspile` command in `package.json` to `xcopy logs dist\\logs /E /I`
  
7. Run `npm run start`  but `logs/access.log` should be created on the root directory where the package.json is located

   - The Express server will be available on  [http://localhost:5000](http://localhost:5000)
  
8. submit a Post request to the url `http://localhost:5000/api/documents/createindex` To generate the pinecone index with the correct dimensions.



