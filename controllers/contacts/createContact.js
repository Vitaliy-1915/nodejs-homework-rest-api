const createError = require('http-errors');

const { Contact, schemas } = require("../../models/contact");

const createContact = async (req, res, next) => {
    try {
        const { error } = schemas.add.validate(req.body);
        if (error) {
            throw new createError(400, error.message)
        }
        const data = { ...req.body, owner: req.user._id }
        const result = await Contact.create(data);
        res.status(201).json(result)
    } catch (error) {
        next(error)
    };
};

module.exports = createContact;