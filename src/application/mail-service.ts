import nodemailer, {Transporter} from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import {SERVICE} from "../constants";
import {injectable} from "inversify";

@injectable()
export class MailService {
    transporter: Transporter<SMTPTransport.SentMessageInfo>;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: SERVICE.NODEMAILER_SERVICE,
            auth: {
                user: SERVICE.NODEMAILER_AUTH_USER,
                pass: SERVICE.NODEMAILER_AUTH_PASS
            }
        })
    }

    async sendActivationMail(to: string, code: string | undefined) {
        await this.transporter.sendMail({
            from: '"ADMIN 👻" <zionav89@gmail.com>',
            to,
            subject: "Confirmation of registration",
            text: "Follow the link to confirm your registration",
            html: `To verify your email, go to <a href="http://localhost:5000/auth/registration-confirmation?code=${code}">by this link</a>`,
        })
    }

}

