const express = require('express');
const createError = require('http-errors');
// const Joi = require("joi");

// const contacts = require("../../models/contacts");
const {Contact, schemas} = require("../../models/contact");

const router = express.Router();

router.get('/', async (req, res, next) => {
  // res.json({ message: 'template message' })
  try {
    // const result = await contacts.listContacts();
    const result = await Contact.find();
    res.json(result);
  } catch (error) {
    next(error);
  };
});

router.get('/:contactId', async (req, res, next) => {
  try {
    const {contactId} = req.params;
    // const result = await contacts.getContactById(contactId);
    const result = await Contact.findById(contactId);
    if (!result) {
      // eslint-disable-next-line new-cap
      throw new createError(404, "Not found");
      // res.status(404).json({
      //   massage: "Not found"
      // })
    }
    res.json(result);
  } catch (error) {
    if (error.message.includes("Cast to ObjectId failed")) {
      error.status = 404;
    }
    next(error);
  };
});

router.post('/', async (req, res, next) => {
  // res.json({ message: 'template message' })
  try {
    const { error } = schemas.add.validate(req.body);
    if (error) {
      // eslint-disable-next-line new-cap
      throw new createError(400, error.message)
    }
    // const { name, email, phone } = req.body;
    // const result = await contacts.addContact(name, email, phone);
    const result = await Contact.create(req.body);
    res.status(201).json(result)
  } catch (error) {
    next(error)
  };
});

router.put('/:contactId', async (req, res, next) => {
  // res.json({ message: 'template message' })
  try {
    const { contactId } = req.params;
    // const { name, email, phone } = req.body;
    const { error } = schemas.add.validate(req.body);
    if (error) {
      // eslint-disable-next-line new-cap
      throw new createError(400, error.message)
    }
    // const result = await contacts.updateContact(contactId, name, email, phone);
    const result = await Contact.findByIdAndUpdate(contactId, req.body, {new: true});
    if (!result) {
      // eslint-disable-next-line new-cap
      throw new createError(400, { "message": "missing fields" })
    }
    res.json(result);
  } catch (error) {
    next(error)
  }
});

router.patch('/:contactId/favorite', async (req, res, next) => {
  // res.json({ message: 'template message' })
  try {
    const { contactId } = req.params;
    // const { name, email, phone } = req.body;
    const { error } = schemas.updateFavorite.validate(req.body);
    if (error) {
      // eslint-disable-next-line new-cap
      throw new createError(400, error.message)
    }
    // const result = await contacts.updateContact(contactId, name, email, phone);
    const result = await Contact.findByIdAndUpdate(contactId, req.body, {new: true});
    if (!result) {
      // eslint-disable-next-line new-cap
      throw new createError(400, { "message": "missing field favorite" })
    }
    res.json(result);
  } catch (error) {
    next(error)
  }
});

router.delete('/:contactId', async (req, res, next) => {
  // res.json({ message: 'template message' })
  try {
    const { contactId } = req.params;
    // const result = await contacts.removeContact(contactId);
    const result = await Contact.findByIdAndDelete(contactId);
    if (!result) {
      // eslint-disable-next-line new-cap
      throw new createError(404, "Not found");
    }
    res.status(200).json({ "message": "contact deleted" });
  } catch (error) {
    next(error)
  }
});

// const contactSchemaValidate = Joi.object({
//   name: Joi.string().required(),
//   email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'co', 'uk', 'ca'] } }),
//   phone: Joi.any(),
//   favorite: Joi.boolean(),
// });

module.exports = router
