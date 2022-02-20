const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const bcrypt = require("bcryptjs");

const { User, schemas } = require('../../models/user');

const { SECRET_KEY } = process.env;

const login = async (req, res, next) => {
    try {
        const { error } = schemas.signup.validate(req.body);
        if (error) {
            throw new createError(400, error.message);
        };
        const { email, password, subscription } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            throw new createError(401, "Email or password is wrong");
        };
        if (!user.verify) {
            throw new createError(401, "Email not verify");
        }
        const compareResuit = await bcrypt.compare(password, user.password);
        if (!compareResuit) {
            throw new createError(401, "Email or password is wrong");
        };
        const payload = {
            id: user._id
        }
        const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "24h" });
        await User.findByIdAndUpdate(user._id, { token });
        res.json({
            token,
            user: {
                email,
                subscription
            }
        })
    } catch (error) {
        next(error);
    }
};

module.exports = login;