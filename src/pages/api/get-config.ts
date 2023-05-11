import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import { v5 as uuidv5 } from "uuid";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { agent_name = [] } = req.body;
  if (agent_name.length) {
    return res.status(400).json({ message: "List of agent name required" });
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

  try {
    const supaAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_ADMIN
    );

    const getChatAgents = async () => {
      const { data, error } = await supabase
        .from("chat_agents")
        .select()
        .eq("created_by", session?.user?.id);
      return { data, error };
    };

    const { data } = await getChatAgents();

    const findUsage = data.map(({ agent_name }) => {
      return supaAdmin
        .from("chat_session")
        .select("*", { count: "exact", head: true })
        .eq("agent_id", uuidv5(agent_name, session?.user?.id));
    });

    const response = await Promise.all(findUsage);
    const data_with_usage = data.map((data, index) => ({
      ...data,
      usage: response[index].count,
    }));

    return res.status(200).json({ chat_agents: data_with_usage });
  } catch (err) {
    console.log(err);
  }
}
