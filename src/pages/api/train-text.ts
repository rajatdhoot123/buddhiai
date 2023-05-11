import type { NextApiRequest, NextApiResponse } from "next";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { createClient } from "@supabase/supabase-js";
import axios from "axios";
import { join } from "path";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const supabase = createServerSupabaseClient({ req, res });

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

    const { filename } = req.body;
    const {
      data: { signedUrl },
    } = await supabase.storage
      .from("buddhi_docs")
      .createSignedUrl(`${session.user.id}/${filename}`, 60 * 60);

    const supaadmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_ADMIN
    );

    const { data } = await axios.get(signedUrl, {
      responseType: "arraybuffer",
    });

    const loader = new TextLoader(new Blob([data]));

    const rawDocs = await loader.load();

    /* Split text into chunks */
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 400,
      chunkOverlap: 80,
    });

    const docs = await textSplitter.splitDocuments(rawDocs);
    console.log("split docs", docs);

    console.log("creating vector store...");
    /*create and store the embeddings in the vectorStore*/
    const embeddings = new OpenAIEmbeddings();

    const vectorStore = await HNSWLib.fromDocuments(docs, embeddings);

    const directory = join(process.cwd(), "HNSWLib", session.user.id, filename);

    await vectorStore.save(directory);

    return res
      .status(200)
      .json({ status: "success", message: "Document trained Successfully" });
  } catch (error) {
    return res.status(200).json({
      status: "failed",
      message: "Something went wrong",
      reason: error?.message ?? null,
    });
  }
}
