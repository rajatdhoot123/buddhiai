import axios from "axios";

async function handler(req, res) {
  const { body } = req;

  if (!body.mail_id || typeof body.mail_id !== "string") {
    return res.status(400).json({ message: "please fill mail to" });
  }

  try {
    const info = axios.post("https://kwiktwik.com/api/send-mail", body);
    return res.status(200).json({ status: "success", data: info });
  } catch (err) {
    return res.status(400).json({ error: err.message, status: "failed" });
  }
}
export default handler;
