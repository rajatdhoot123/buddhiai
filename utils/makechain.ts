import { OpenAI } from "langchain/llms/openai";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { ConversationalRetrievalQAChain } from "langchain/chains";
import { CONDENSE_PROMPT, PROMPT_SUFFIX, QA_PROMPT } from "@/constant/prompt";

export const makeChain = (vectorstore: HNSWLib, prompt: string) => {
  const model = new OpenAI({
    temperature: 0, // increase temepreature to get more creative answers
    modelName: "gpt-4", //change this to gpt-4 if you have access
  });

  console.log(prompt || QA_PROMPT + PROMPT_SUFFIX, "PROMPT");
  const chain = ConversationalRetrievalQAChain.fromLLM(
    model,
    vectorstore.asRetriever(),
    {
      qaTemplate: prompt || QA_PROMPT + PROMPT_SUFFIX,
      questionGeneratorTemplate: CONDENSE_PROMPT,
      returnSourceDocuments: true, //The number of source documents returned is 4 by default
    }
  );
  return chain;
};
