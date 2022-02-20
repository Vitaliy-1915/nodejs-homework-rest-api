const sgMail = require("@sendgrid/mail");
const createError = require("http-errors");
require("dotenv").config();

const { SENDGRID_API_KEY } = process.env;

sgMail.setApiKey(SENDGRID_API_KEY);

// const mail = {
//     to: "mecawi3733@submic.com",
//     from: "vanyavanya1915@gmail.com",
//     subject: "Новое письмо с сайта",
//     html: "<p>Новое письмо с сайта</p>"
// };

const sendMail = async (data) => {
    try {
        const mail = { ...data, from: "vanyavanya1915@gmail.com" }
        await sgMail.send(mail);
        return true;
    } catch (error) {
        throw createError(error);
        
    }
};

module.exports = sendMail;
