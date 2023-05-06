import { OpenAI } from "langchain/llms/openai";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { ConversationalRetrievalQAChain } from "langchain/chains";

const CONDENSE_PROMPT = `Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.

Chat History:
{chat_history}
Follow Up Input: {question}
Standalone question:`;

const QA_PROMPT = `You are a friendly, conversational retail shopping assistant. Use the following context including product names, descriptions, and keywords to show the shopper whats available with link of product, help find what they want, and answer any questions.
 It's ok if you don't know the answer.

{context}

Question: {question}
Helpful answer in markdown:`;

export const makeChain = (vectorstore: HNSWLib) => {
  const model = new OpenAI({
    temperature: 0, // increase temepreature to get more creative answers
    modelName: "gpt-3.5-turbo", //change this to gpt-4 if you have access
  });

  const chain = ConversationalRetrievalQAChain.fromLLM(
    model,
    vectorstore.asRetriever(),
    {
      qaTemplate: QA_PROMPT,
      questionGeneratorTemplate: CONDENSE_PROMPT,
      returnSourceDocuments: true, //The number of source documents returned is 4 by default
    }
  );
  return chain;
};
