import type { NextApiRequest, NextApiResponse } from "next";
import { checkFileExist } from "../../../utils";
import { join } from "path";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const supabase = createServerSupabaseClient({ req, res });
  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { files = [] } = req.body;
  if (!files.length) {
    return res.status(400).json({
      error: "Please send files",
      description: "Files not present",
    });
  }
  if (!session) {
    return res.status(401).json({
      error: "not_authenticated",
      description:
        "The user does not have an active session or is not authenticated",
    });
  }
  const checkFile = files.map((file) =>
    checkFileExist(join(process.cwd(), "HNSWLib", session.user.id, file.name))
  );
  const response = await Promise.all(checkFile);
  return res.status(200).json({
    data: files.map((file, index) => ({
      ...file,
      is_available: response[index],
    })),
  });
}
