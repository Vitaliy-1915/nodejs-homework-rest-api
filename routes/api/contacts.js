const express = require('express');
const createError = require('http-errors');

const {Contact, schemas} = require("../../models/contact");

const {autchenticate} = require("../../middlewares");

const router = express.Router();

router.get('/', autchenticate, async (req, res, next) => {
  try {
    const { page = 1, limit = 20, favorite } = req.query;
    const { _id } = req.user;
    const skip = (page - 1) * limit;
    const result = await Contact.find(
      { owner: _id }, "", { favorite , skip, limit: +limit }).populate("owner", "email");
    res.json(result);
  } catch (error) {
    next(error);
  };
});

router.get('/:contactId', async (req, res, next) => {
  try {
    const {contactId} = req.params;
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
});

router.post('/', autchenticate, async (req, res, next) => {
  try {
    const { error } = schemas.add.validate(req.body);
    if (error) {
      throw new createError(400, error.message)
    }
    const data = {...req.body, owner: req.user._id}
    const result = await Contact.create(data);
    res.status(201).json(result)
  } catch (error) {
    next(error)
  };
});

router.put('/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { error } = schemas.add.validate(req.body);
    if (error) {
      throw new createError(400, error.message)
    }
    const result = await Contact.findByIdAndUpdate(contactId, req.body, {new: true});
    if (!result) {
      throw new createError(400, { "message": "missing fields" })
    }
    res.json(result);
  } catch (error) {
    next(error)
  }
});

router.patch('/:contactId/favorite', async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { error } = schemas.updateFavorite.validate(req.body);
    if (error) {
      throw new createError(400, error.message)
    }
    const result = await Contact.findByIdAndUpdate(contactId, req.body, {new: true});
    if (!result) {
      throw new createError(400, { "message": "missing field favorite" })
    }
    res.json(result);
  } catch (error) {
    next(error)
  }
});

router.delete('/:contactId', async (req, res, next) => {
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
});

module.exports = router
