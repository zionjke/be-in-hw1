import nodemailer from "nodemailer";
import {SERVICE} from "../constants";
import {SendEmailType} from "../types";

export const mailer = {
    async sendEmail({emailTo, subject, text, html}: SendEmailType) {

        let transporter = nodemailer.createTransport({
            service: SERVICE.NODEMAILER_SERVICE,
            auth: {
                user: SERVICE.NODEMAILER_AUTH_USER,
                pass: SERVICE.NODEMAILER_AUTH_PASS
            }
        });

        await transporter.sendMail({
            from: '"ADMIN 👻" <zionav89@gmail.com>',
            to: emailTo,
            subject,
            text,
            html
        });
    }
}