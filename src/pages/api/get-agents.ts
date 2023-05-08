import type { NextApiRequest, NextApiResponse } from "next";
import { getAllFilesInFolder } from "../../../utils";
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

  if (!session) {
    return res.status(401).json({
      error: "not_authenticated",
      description:
        "The user does not have an active session or is not authenticated",
    });
  }
  const data = await getAllFilesInFolder(
    join(process.cwd(), "HNSWLib", session.user.id)
  );

  return res.status(200).json({
    data,
  });
}
