const nodemailer = require("nodemailer");
var config = require('../configs/config')

const transporter = nodemailer.createTransport({
    host: config.Host,
    port: config.Port,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
        user: config.Username,
        pass: config.Password,
    },
});

// async..await is not allowed in global scope, must use a wrapper
module.exports = async function (desEmail,url) {
    // send mail with defined transport object
    const info = await transporter.sendMail({
        from: 'HUTECH with love',
        to: desEmail, // list of receivers
        subject: "virus nay click zo di", // Subject line
        html: "<a href='"+url+"'>click vo de doi passs</a>", // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
}
