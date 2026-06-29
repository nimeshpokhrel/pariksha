import { mailSender } from "./mailSender.js";
import { smsSender } from "./smsSender.js";

const sendOtpHandler = ({ identifier, otp }) => {
  if (identifier.includes("@")) {
    mailSender({
      email: identifier,
      title: "One Time Password",
      body: `<p>Please donot reply to this email. This mail is not monitored.</p><br/><br/><br/><p>Your One Time Password for Pariksha is: ${otp}</p>`,
    });
  } else {
    smsSender({
      phone: identifier,
      message: `Your One Time Password for Pariksha is: ${otp}`,
    });
  }
};

export { sendOtpHandler };
