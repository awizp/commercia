import nodemailer from 'nodemailer';

export const sendMail = async (options) => {
    // creating app password from gmail and giving them in config env file
    const transporter = nodemailer.createTransport({
        service: process.env.SMTP_SERVICE,
        auth: {
            user: process.env.SMTP_MAIL,
            pass: process.env.SMTP_PASSWORD
        }
    });

    // user giving mail options from our gmail to other gmails
    const mailOptions = {
        from: process.env.SMTP_MAIL,
        to: options.email,
        subject: options.subject,
        text: options.message,
        // this one preferred first when send mail
        html: options.htmlMessage
    };

    await transporter.sendMail(mailOptions);
};