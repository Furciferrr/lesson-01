import { injectable } from "inversify";
import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { IMailSender } from "./../interfaces";

@injectable()
export class MailSender implements IMailSender {
  async sendEmail(
    emailAddress: string,
    html: string
  ): Promise<SMTPTransport.SentMessageInfo | undefined> {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "setsko89@gmail.com",
        pass: process.env.MAIL_APP_PASSWORD,
      },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"Super Service" <foo@example.com>', // sender address
      to: emailAddress,
      subject: "Hello ✔", // Subject line
      text: "Hello", // plain text body
      html: "https://cli.github.com?" + html, // html body
    });
    
    return info;
  }
}
