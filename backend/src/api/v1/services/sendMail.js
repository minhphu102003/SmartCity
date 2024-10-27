import NodeMailer from 'nodemailer';

const sendMail = async (option) =>{
    const transporter = NodeMailer.createTransport({
        host: process.env.SMPT_HOST,
        port: process.env.SMPT_PORT,
        secure: false,
        auth: {
            user: process.env.SMPT_MAIL,
            pass: process.env.SMPT_APP_PASS
        },
        authMethod: 'LOGIN',
    });

    const mailOptions = {
        from : process.env.SMPT_MAIL,
        to : option?.to,
        subject: option?.subject,
        text: option?.text,
        html: option?.html
    }

    await transporter.sendMail(mailOptions);
}

export default sendMail;