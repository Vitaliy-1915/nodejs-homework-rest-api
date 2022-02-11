const { Schema, model } = require("mongoose");
const Joi = require('joi');

const userSchema = Schema({
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
    },
    subscription: {
        type: String,
        enum: ["starter", "pro", "business"],
        default: "starter"
    },
    token: {
        type: String,
        default: null,
    }
}, { versionKey: false });

const signupJoiSchema = Joi.object({
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'co', 'uk', 'ca'] } }).required(),
    password: Joi.string().min(5).required(),
    subscription: Joi.string(),
    token: Joi.string()
})

const User = model('user', userSchema);

const schemas = {
    signup: signupJoiSchema
};

module.exports = {
    User,
    schemas
};