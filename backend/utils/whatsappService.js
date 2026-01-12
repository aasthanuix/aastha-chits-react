import axios from "axios";

export const sendWhatsAppCredentials = async ({
  phone,
  name,
  userId,
  password,
}) => {
  const url = `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;

  const payload = {
    messaging_product: "whatsapp",
    to: `91${phone}`,
    type: "template",
    template: {
      name: "aastha_chits_credentials",
      language: { code: "en" },
      components: [
        {
          type: "body",
          parameters: [
            { type: "text", text: name },
            { type: "text", text: userId },
            { type: "text", text: password },
            { type: "text", text: `${process.env.FRONTEND_URL}/login` },
          ],
        },
      ],
    },
  };

  await axios.post(url, payload, {
    headers: {
      Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
      "Content-Type": "application/json",
    },
  });
};

