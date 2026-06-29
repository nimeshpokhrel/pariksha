import axios from "axios";

const smsSender = async ({ phone, message }) => {
  const response = axios.post("https://sms.aakashsms.com/sms/v3/send", {
    auth_token: process.env.SMS_AUTH_TOKEN,
    to: phone,
    text: message,
  });
  return response;
};

export { smsSender };
