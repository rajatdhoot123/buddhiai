import type { NextApiRequest, NextApiResponse } from "next";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { CustomPDFLoader } from "../../../utils/customPDFLoader";
import { Chroma } from "langchain/vectorstores/chroma";
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

    const { data } = await axios.get(signedUrl, {
      responseType: "arraybuffer",
    });

    const pdfLoader = new CustomPDFLoader(new Blob([data]));

    const rawDocs = await pdfLoader.load();

    /* Split text into chunks */
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const docs = await textSplitter.splitDocuments(rawDocs);
    console.log("split docs", docs);

    console.log("creating vector store...");
    /*create and store the embeddings in the vectorStore*/
    const embeddings = new OpenAIEmbeddings();

    const vectorStore = await Chroma.fromDocuments(docs, embeddings, {
      collectionName: filename,
    });

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
