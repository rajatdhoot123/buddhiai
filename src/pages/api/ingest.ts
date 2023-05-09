import type { NextApiRequest, NextApiResponse, PageConfig } from "next";
import formidable from "formidable";
import { Document } from "langchain/document";
import { OpenAIEmbeddings } from "langchain/embeddings";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { fileConsumer, formidablePromise } from "@/lib/formidable";
import { getTextContentFromPDF } from "@/lib/pdf";
import { excelToText } from "@/lib/excel";
import { chunk } from "@/lib/utils";
import { join } from "path";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import redis from "@/lib/redis";
import { EXCEL_FORMAT } from "@/constant";

const formidableConfig = {
  keepExtensions: true,
  maxFileSize: 10_000_000,
  maxFieldsSize: 10_000_000,
  maxFields: 7,
  allowEmptyFiles: false,
  multiples: true,
};

export async function handler(req: NextApiRequest, res: NextApiResponse) {
  const endBuffers: {
    [filename: string]: Buffer;
  } = {};

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

  const { fields, files } = await formidablePromise(req, {
    ...formidableConfig,
    // consume this, otherwise formidable tries to save the file to disk
    fileWriteStreamHandler: (file) => fileConsumer(file, endBuffers),
  });

  if (!fields.prompt) {
    return res.status(500).json({ message: "Prompt required" });
  }

  if (!fields.agent_name) {
    return res.status(500).json({ message: "Agent name required" });
  }

  const docs = await Promise.all(
    Object.values(files).map(async (fileObj: formidable.file) => {
      let fileText = "";
      const fileData = endBuffers[fileObj.newFilename];
      switch (fileObj.mimetype) {
        case "text/plain":
          fileText = fileData.toString();
          break;
        case "application/pdf":
          fileText = await getTextContentFromPDF(fileData);
          break;
        case "application/octet-stream":
          fileText = fileData.toString();
          break;
        case EXCEL_FORMAT:
          fileText = await excelToText(fileData);
          break;
        default:
          throw new Error("Unsupported file type.");
      }

      const rawDocs = new Document({ pageContent: fileText });
      const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
      });
      return await textSplitter.splitDocuments([rawDocs]);
    })
  );

  const flatDocs = docs.flat();

  try {
    const chunkSize = 100;
    const chunks = chunk(flatDocs, chunkSize);

    const result = await Promise.all(
      chunks.map((chunk) => {
        return HNSWLib.fromDocuments(
          chunk,
          new OpenAIEmbeddings({
            modelName: "text-embedding-ada-002",
            openAIApiKey: process.env.OPENAI_API_KEY,
          })
        );
      })
    );

    await redis.set(fields.agent_name, fields.prompt);
    const directory = join(
      process.cwd(),
      "HNSWLib",
      session?.user?.id,
      fields.agent_name
    );
    await Promise.all(
      result.map((file) => {
        file.save(directory);
      })
    );
    return res.status(200).json({ message: "success" });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: e.message || "Unknown error." });
  }
}

export const config: PageConfig = {
  api: {
    bodyParser: false,
  },
};

export default handler;
