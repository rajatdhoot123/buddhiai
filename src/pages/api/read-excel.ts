import type { NextApiRequest, NextApiResponse, PageConfig } from "next";
import formidable from "formidable";
import { fileConsumer, formidablePromise } from "@/lib/formidable";
import { read, utils } from "xlsx";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

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

  try {
    const { fields, files } = await formidablePromise(req, {
      ...formidableConfig,
      // consume this, otherwise formidable tries to save the file to disk
      fileWriteStreamHandler: (file) => fileConsumer(file, endBuffers),
    });

    const docs = await Promise.all(
      Object.values(files).map(async (fileObj: formidable.file) => {
        const fileData = endBuffers[fileObj.newFilename];
        switch (fileObj.mimetype) {
          case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
          case "application/vnd.ms-excel":
            const workbook = await read(fileData, { type: "buffer" });
            const sheetName = workbook.SheetNames[0];
            const jsonObject = utils.sheet_to_json(workbook.Sheets[sheetName], {
              raw: false,
            });
            return jsonObject;
          default:
            throw new Error("Unsupported file type.");
        }
      })
    );
    res.status(200).json({ data: docs });
  } catch (err) {
    return res.status(500).json({ message: "Something Went Wrong" });
  }
}

export const config: PageConfig = {
  api: {
    bodyParser: false,
  },
};

export default handler;
