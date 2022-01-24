const express = require('express');
const createError = require('http-errors');
const Joi = require("joi");

const contacts = require("../../models/contacts");

const router = express.Router();

router.get('/', async (req, res, next) => {
  // res.json({ message: 'template message' })
  try {
    const result = await contacts.listContacts();
    res.json(result);
  } catch (error) {
    next(error);
  };
});

router.get('/:contactId', async (req, res, next) => {
  try {
    const {contactId} = req.params;
    const result = await contacts.getContactById(contactId);
    if (!result) {
      // eslint-disable-next-line new-cap
      throw new createError(404, "Not found");
      // res.status(404).json({
      //   massage: "Not found"
      // })
    }
    res.json(result);
  } catch (error) {
    next(error);
  };
});

router.post('/', async (req, res, next) => {
  // res.json({ message: 'template message' })
  try {
    const { error } = contactSchemaValidate.validate(req.body);
    if (error) {
      // eslint-disable-next-line new-cap
      throw new createError(400, error.message)
    }
    const { name, email, phone } = req.body;
    const result = await contacts.addContact(name, email, phone);
    res.status(201).json(result)
  } catch (error) {
    next(error)
  };
});

router.put('/:contactId', async (req, res, next) => {
  // res.json({ message: 'template message' })
  try {
    const { contactId } = req.params;
    const { name, email, phone } = req.body;
    const { error } = contactSchemaValidate.validate(req.body);
    if (error) {
      // eslint-disable-next-line new-cap
      throw new createError(400, error.message)
    }
    const result = await contacts.updateContact(contactId, name, email, phone);
    if (!result) {
      // eslint-disable-next-line new-cap
      throw new createError(400, { "message": "missing fields" })
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
    const result = await contacts.removeContact(contactId);
    if (!result) {
      // eslint-disable-next-line new-cap
      throw new createError(404, "Not found");
    }
    res.status(200).json({ "message": "contact deleted" });
  } catch (error) {
    next(error)
  }
});

const contactSchemaValidate = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'co', 'uk'] } }).required(),
  phone: Joi.any().required(),
});

module.exports = router
