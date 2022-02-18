
const current = async (req, res, next) => {
    res.json({
        user: {
            email: req.user.email,
            subscription: req.user.subscription,
            id: req.user._id
        }
    })
};

module.exports = current;