/**
 * Change the namespace to the namespace on Pinecone you'd like to store your embeddings.
 */

if (!process.env.PINECONE_INDEX_NAME) {
  throw new Error("Missing Pinecone index name in .env file");
}

const PINECONE_INDEX_NAME = process.env.PINECONE_INDEX_NAME ?? "";

const PINECONE_NAME_SPACE = "pdf-test"; //namespace is optional for your vectors

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export { PINECONE_INDEX_NAME, PINECONE_NAME_SPACE, OPENAI_API_KEY };
