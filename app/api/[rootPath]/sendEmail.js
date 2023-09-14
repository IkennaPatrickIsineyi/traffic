
import { createTransport } from 'nodemailer'

export default function sendEmail({ toEmail, fromHeading, subject, text, html, }) {
    const payload = {
        from: fromHeading,
        to: toEmail,
        subject: subject,
        text: text,
        html: html
    };

    console.log('payload', payload);

    const setting = {
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD
        }
    };

    console.log('email payload', payload);

    let transporter = createTransport(setting);

    return new Promise((resolve, reject) => {
        console.log('sending...');

        transporter.sendMail(payload, (err, result) => {
            if (err) {
                console.log('mailing err', err);
                resolve(false)
            }
            else {
                resolve(result)
            }
        })
    })
}