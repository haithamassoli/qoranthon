export const sendNotification = async (
  token: string[],
  title: string,
  body?: string
) => {
  const response = await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      to: token,
      title: title,
      body: body,
    }),
  });
  const { status } = response;
  return status;
};
