import { Pinecone } from '@pinecone-database/pinecone';

const pineconeClient = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY as string,
});

export default pineconeClient;
