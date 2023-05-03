import type { NextApiRequest, NextApiResponse } from "next";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { SupabaseVectorStore } from "langchain/vectorstores/supabase";
import { makeChain } from "../../../utils/makechain";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { sanitizeTableName } from "../../utils";
import { v5 as uuidv5 } from "uuid";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { question, history, filename } = req.body;

  //only accept post requests
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  if (!question) {
    return res.status(400).json({ message: "No question in the request" });
  }

  if (!filename) {
    return res.status(400).json({ message: "Filename required" });
  }

  const supabase = createServerSupabaseClient({ req, res });
  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return res.status(401).json({
      error: "not_authenticated",
      description:
        "The user does not have an active session or is not authenticated",
    });
  }
  // OpenAI recommends replacing newlines with spaces for best results
  const sanitizedQuestion = question.trim().replaceAll("\n", " ");
  const sanitiseTable = sanitizeTableName(filename);
  const tableName = uuidv5(sanitiseTable, session.user.id);

  try {
    /* create vectorstore*/
    const vectorStore = await SupabaseVectorStore.fromExistingIndex(
      new OpenAIEmbeddings({}),
      {
        client: supabase,
        tableName: tableName,
        queryName: "match_documents",
      }
    );

    //create chain
    const chain = makeChain(vectorStore);
    //Ask a question using chat history
    const response = await chain.call({
      question: sanitizedQuestion,
      chat_history: history || [],
    });

    res.status(200).json(response);
  } catch (error: any) {
    console.log("error", error);
    res.status(500).json({ error: error.message || "Something went wrong" });
  }
}
