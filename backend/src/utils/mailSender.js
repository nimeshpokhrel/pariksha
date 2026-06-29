import nodemailer from "nodemailer";

const mailSender = async ({ email, title, body }) => {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
      from: "no_reply@pariksha.solutions",
    });

    let info = await transporter.sendMail({
      from: {
        name: "Pariksha Solutions",
        address: "no_reply@pariksha.solutions",
      },
      to: email,
      subject: title,
      html: body,
    });

    return info;
  } catch (error) {
    console.log(error.message);
  }
};

export { mailSender };
