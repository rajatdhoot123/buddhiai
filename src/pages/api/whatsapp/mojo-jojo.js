import { getButtons, getList } from "../../../lib/whatsapp";

import axios from "axios";

const config = {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.WHATSAPP_API_TOKEN}`,
  },
};

const responseByMessageId = (messageId) => {
  switch (messageId) {
    case "services":
      return getList({
        header: "Services",
        body: "List of Services",
        footer: "www.kwiktwik.com",
        action: {
          button: "Services",
          sections: [
            {
              rows: [
                {
                  id: "instagram_marketing",
                  title: "Instagram Marketing",
                  description: "Instagram Marketing",
                },
                {
                  id: "whatsapp_marketing",
                  title: "Whatsapp Marketing",
                  description: "Whatsapp Marketing",
                },
                {
                  id: "graphic_design",
                  title: "Graphic Design",
                  description: "Graphic Design",
                },
                {
                  id: "video_editing",
                  title: "Video Editing",
                  description: "Video Editing",
                },
                {
                  id: "advertisements",
                  title: "Advertisements",
                  description: "Advertisements",
                },
                {
                  id: "website",
                  title: "Website",
                  description: "Website",
                },
                {
                  id: "others",
                  title: "Others",
                  description: "Others",
                },
              ],
            },
          ],
        },
      });
    case "contact_us":
    case "instagram_marketing":
    case "whatsapp_marketing":
    case "graphic_design":
    case "video_editing":
    case "advertisements":
    case "website":
    case "others":
      return {
        messaging_product: "whatsapp",
        type: "template",
        template: {
          name: "contact_us",
          language: {
            code: "en_GB",
          },
        },
      };
    case "hi":
    case "hello":
    case "help":
    case "start":
      return getButtons({
        body: "How can we assist you today ?",
        header: "Welcome to kwiktwik.com",
        footer: "https://www.instagram.com/kwiktwik.co",
        buttons: [
          {
            id: "services",
            title: "Services",
          },
          {
            id: "contact_us",
            title: "Contact Us",
          },
        ],
      });
    default:
      return {
        messaging_product: "whatsapp",
        type: "template",
        template: {
          name: "contact_us",
          language: {
            code: "en_GB",
          },
        },
      };
  }
};

const handleMessage = (message) => {
  switch (message.type) {
    case "text":
      return responseByMessageId(message.text.body.toLowerCase());
    case "interactive":
      return handleMessage(message.interactive);
    case "button_reply":
      return responseByMessageId(message.button_reply.id);
    case "list_reply":
      return responseByMessageId(message.list_reply.id);
    case "button":
      return "Hi";
    default:
      return new Error("No Action Found");
  }
};

export default async function handler(req, res) {
  const body = req.body;
  if (req.method === "POST") {
    const message = body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    res.status(200).json({ message: "ok" });
    if (!message) {
      return;
    }
    try {
      const payload = { ...handleMessage(message), to: message.from };
      const { data } = await axios.post(
        `https://graph.facebook.com/v16.0/${process.env.WHATSAPP_ID}/messages`,
        payload,
        config
      );
    } catch (err) {
      console.log(err);
    }
  } else if (req.method === "GET") {
    const verify_token = process.env.MY_WHATSAPP_TOKEN;
    let mode = req.query["hub.mode"];
    let token = req.query["hub.verify_token"];
    let challenge = req.query["hub.challenge"];
    if (mode && token) {
      if (mode === "subscribe" && token === verify_token) {
        return res.status(200).send(challenge);
      } else {
        return res.status(403).send("ok");
      }
    } else {
        return res.status(403).send("ok");   
    }
  }
}
