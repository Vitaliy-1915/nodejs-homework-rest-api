const createError = require("http-errors");
const bcrypt = require("bcryptjs");
const gravatar = require('gravatar');
const { v4 } = require("uuid");

const { User, schemas } = require('../../models/user');
const { sendMail } = require('../../helpers');

const signup = async (req, res, next) => {
    try {
        const { error } = schemas.signup.validate(req.body);
        if(error){
            throw new createError(400, error.message);
        };
        const { email, password, subscription } = req.body;
        const user = await User.findOne({ email });
        if (user) {
            throw new createError(409, "Email in use");
        };
        const solt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, solt);
        const avatarURL = gravatar.url(email);
        const verificationToken = v4();
        const result = await User.create({ email, avatarURL, password: hashPassword, subscription, verificationToken});
        const mail = {
            to: email, 
            subject: "Подтверждение email",
            html: `<a target="_blank" href='http://localhost:3000/api/users/${verificationToken}'>Нажмите чтобы подтвердить свой email</a>`
        }
        await sendMail(mail);
        res.status(201).json({
            user: {
                email,
                subscription,
            }
        })
    } catch (error) {
        next(error);
    };
}

module.exports = signup;