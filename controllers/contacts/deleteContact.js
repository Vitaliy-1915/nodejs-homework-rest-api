const createError = require('http-errors');

const { Contact } = require("../../models/contact");

const deleteContact = async (req, res, next) => {
    try {
        const { contactId } = req.params;
        const result = await Contact.findByIdAndDelete(contactId);
        if (!result) {
            throw new createError(404, "Not found");
        }
        res.status(200).json({ "message": "contact deleted" });
    } catch (error) {
        next(error)
    }
};

module.exports = deleteContact;