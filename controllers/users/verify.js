const { User } = require("../../models/user");

const createError = require("http-errors");

const verify = async (req, res, next) => {
    try {
        const { verificationToken } = req.params;
        const user = await User.findOne({ verificationToken });
        if (!user) {
            throw createError(404, 'User not found')
        }
        await User.findByIdAndUpdate(user._id, { verify: true, verificationToken: "null" });
        res.json({
            message: 'Verification successful'
        })
    } catch (error) {
        next(error);
    }
};

module.exports = verify;