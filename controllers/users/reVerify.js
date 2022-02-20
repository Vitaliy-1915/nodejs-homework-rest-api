const { schemas, User } = require('../../models/user');
const createError = require("http-errors");
const { sendMail } = require("../../helpers");

const reVerify = async (req, res, next) => {
    try {
        const { error } = schemas.verify.validate(req.body);
        if (error) {
            throw createError(400, "missing required field email");
        };
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (user.verify) {
            throw createError(400, "Verification has already been passed");
        }
        const mail = {
            to: email,
            subject: "Подтвеждение email",
            html: `<a target="_blank" href='http://localhost:3000/api/users/${user.verificationToken}'>Нажмите чтобы подтвердить свой email</a>`
        };
        sendMail(mail);
        res.json({
            "message": "Verification email sent"
        })
    } catch (error) {
        next(error);
    }
};

module.exports = reVerify;