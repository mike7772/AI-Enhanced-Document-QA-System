import axios from "axios";
import pineconeClient from "../middlewares/pinecone";


export async function generateEmbeddings(chunks: string[]) {
  const embeddings = [];
  for (const chunk of chunks) {
    const response = await axios.post(
      "https://api.openai.com/v1/embeddings",
      {
        input: chunk,
        model: "text-embedding-ada-002",
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY} `,
        },
      }
    );
    embeddings.push({ text: chunk, data: response.data });
  }
  return embeddings;
}

export const chunkText = (text: string, chunkSize = 200): string[] => {
  const chunks: string[] = [];
  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push(text.slice(i, i + chunkSize));
  }
  return chunks;
};

export const storeInPinecone = async (embeddings: any[]) => {
  const indexName = "docs-index";
  const index = pineconeClient.index(indexName);
  const embeddingsVectors = embeddings.map((embedding, i) => ({
    id: embedding.text,
    values: embedding.data,
    metadata: {
      text: embedding.text,
    },
  }));

  await index.upsert(embeddingsVectors);
};
