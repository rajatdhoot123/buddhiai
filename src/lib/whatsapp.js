export const getButtons = ({ body, header, footer, buttons }) => {
  return {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    type: "interactive",
    interactive: {
      type: "button",
      body: {
        text: body,
      },
      header: {
        type: "text",
        text: header,
      },
      footer: {
        text: footer,
      },
      action: {
        buttons: buttons.map((button) => ({ type: "reply", reply: button })),
      },
    },
  };
};

export const getList = ({ header, body, footer, action }) => {
  return {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    type: "interactive",
    interactive: {
      type: "list",
      header: {
        type: "text",
        text: header,
      },
      body: {
        text: body,
      },
      footer: {
        text: footer,
      },
      action,
    },
  };
};
