const createError = require('http-errors');

const { Contact, schemas } = require("../../models/contact");

const updateOnId = async (req, res, next) => {
    try {
        const { contactId } = req.params;
        const { error } = schemas.add.validate(req.body);
        if (error) {
            throw new createError(400, error.message)
        }
        const result = await Contact.findByIdAndUpdate(contactId, req.body, { new: true });
        if (!result) {
            throw new createError(400, { "message": "missing fields" })
        }
        res.json(result);
    } catch (error) {
        next(error)
    }
};

module.exports = updateOnId;