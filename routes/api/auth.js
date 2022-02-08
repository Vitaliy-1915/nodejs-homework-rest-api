const express = require("express");
const createError = require("http-errors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { User, schemas } = require('../../models/user');

const router = express.Router();

const { SECRET_KEY } = process.env;

router.post("/signup", async (req, res, next) => {
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
        const result = await User.create({
            email,
            password: hashPassword,
            subscription
        });
        res.status(201).json({
            user: {
                email,
                subscription,
            }
        })
    } catch (error) {
        next(error);
    };
});

router.post("/login", async (req, res, next) => {
    try {
                const { error } = schemas.signup.validate(req.body);
        if(error){
            throw new createError(400, error.message);
        };
        const { email, password, subscription } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            throw new createError(401, "Email or password is wrong");
        };
        const compareResuit = await bcrypt.compare(password, user.password);
        if (!compareResuit) {
           throw new createError(401, "Email or password is wrong"); 
        };
        const payload = {
            id: user._id
        }
        const token = jwt.sign(payload, SECRET_KEY, {expiresIn: "24h"});
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
})

module.exports = router;