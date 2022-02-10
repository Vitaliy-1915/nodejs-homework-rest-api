const express = require("express");

const {User} = require("../../models/user");

const { autchenticate } = require("../../middlewares");

const router = express.Router();

router.get("/current", autchenticate, async (req, res, next) => {
        res.json({
            user: {
                email: req.user.email,
                subscription: req.user.subscription,
                id: req.user._id
            }
        })
});

router.get("/logout", autchenticate, async (req, res, next) => {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: null });
    res.status(204).send()
});

module.exports = router;