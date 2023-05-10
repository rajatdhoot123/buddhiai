import { AGENT_TYPE } from "./index";

export const CONDENSE_PROMPT = `Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.

Chat History:
{chat_history}
Follow Up Input: {question}
Standalone question:`;

const QA_SHOPPING_ASSITANCE = `You are a friendly, conversational retail shopping assistant. Use the following context including product names, descriptions, and keywords to show the shopper whats available with link of product, help find what they want, and answer any questions.
 It's ok if you don't know the answer.

{context}

Question: {question}
Helpful answer in markdown:`;

export const QA_PROMPT = `You are a helpful AI assistant. Use the following pieces of context to answer the question at the end.
If you don't know the answer, just say you don't know. DO NOT try to make up an answer.
If the question is not related to the context, politely respond that you are tuned to only answer questions that are related to the context.

{context}

Question: {question}
Helpful answer in markdown:`;

export const QA_PROMPT_MAPPER: { [key: string]: string } = {
  [AGENT_TYPE.SHOPPING_AGENT]: QA_SHOPPING_ASSITANCE,
  [AGENT_TYPE.SUPER_AGENT]: QA_PROMPT,
};

export function generatePrompt(type: string, helper: string) {
  switch (type) {
    case AGENT_TYPE.SHOPPING_AGENT:
      return `You are a friendly, conversational retail shopping assistant. Use the following context including ${helper} to show the shopper whats available with link of product, help find what they want, and answer any questions.
It's ok if you don't know the answer.
     
{context}
     
Question: {question}
Helpful answer in markdown:`;
    default:
      return QA_PROMPT;
  }
}
