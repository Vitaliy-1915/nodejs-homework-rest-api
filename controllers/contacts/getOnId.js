const createError = require('http-errors');
const { Contact} = require("../../models/contact");

const getOnId = async (req, res, next) => {
    try {
        const { contactId } = req.params;
        const result = await Contact.findById(contactId);
        if (!result) {
            throw new createError(404, "Not found");
        }
        res.json(result);
    } catch (error) {
        if (error.message.includes("Cast to ObjectId failed")) {
            error.status = 404;
        }
        next(error);
    };
};

module.exports = getOnId;