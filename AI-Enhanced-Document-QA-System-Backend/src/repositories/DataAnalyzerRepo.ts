import pineconeClient from "../middlewares/pinecone";
import { chunkText, generateEmbeddings } from "../middlewares/utils";
import { loadQAStuffChain } from "langchain/chains";
import { Document } from "langchain/document";
import { OpenAI as LangchainOpenAI } from "@langchain/openai";

class DataAnalyzerRepo {
  constructor() {}

  CreateIndex = async () => {
    const indexName = "docs-index";
    await pineconeClient
      .createIndex({
        name: indexName,
        dimension: 1536,
        metric: "cosine",
        spec: {
          serverless: {
            cloud: "aws",
            region: "us-east-1",
          },
        },
      })
      .then((response) => {
        return response;
      })
      .catch((error) => {
        throw new Error(error.message as string);
      });
  };


  CheckIndex = async () => {
    const indexName = "docs-index";
    const index = pineconeClient.index(indexName);

    try {
      const response = await index.describeIndexStats();
      return response;
    } catch (error) {
      throw new Error(error as string);
    }
  };

  AnswerQuestion = async (data: string) => {
    const indexName = "docs-index";
    const index = pineconeClient.index(indexName);
    const chunks = chunkText(data);
    const embeddings = await generateEmbeddings(chunks);
    try {
      const response = await index.query({
        topK: 3,
        vector: embeddings as any,
        includeValues: true,
      });
      const concatenatedText = response.matches
        .map((match: any) => match.metadata.text)
        .join(" ");

    // console.log(`Concatenated Text: ${concatenatedText}`);

    const llm = new LangchainOpenAI({
        openAIApiKey: process.env.OPENAI_API_KEY,
    });
    const chain = loadQAStuffChain(llm);

    const result = await chain.call({
        input_documents: [new Document({ pageContent: concatenatedText })],
        question: data,
    });
      return result;
    } catch (error) {
      throw new Error(error as string);
    }
  };

  RemoveIndex = async () => {
    try {
      const indexName = "docs-index";
      const response = await pineconeClient.deleteIndex(indexName);
      return response;
    } catch (error) {
      throw new Error(error as string);
    }
  };
}

export default new DataAnalyzerRepo();
