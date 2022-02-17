const {Contact } = require("../../models/contact");

const getAll = async (req, res, next) => {
    try {
        const { page = 1, limit = 20, favorite } = req.query;
        const { _id } = req.user;
        const skip = (page - 1) * limit;
        const result = await Contact.find(
            { owner: _id }, "", { favorite, skip, limit: +limit }).populate("owner", "email");
        res.json(result);
    } catch (error) {
        next(error);
    };
};

module.exports = getAll;