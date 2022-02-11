const { Schema, model } = require("mongoose");
const Joi = require("joi");

const contactSchema = Schema({
  name: {
    type: String,
    required: [true, 'Set name for contact'],
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
});
  
const Contact = model("contact", contactSchema);

const contactSchemaValidate = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'co', 'uk', 'ca'] } }),
  phone: Joi.any(),
  favorite: Joi.boolean(),
});

const contactSchemaValidateFavorite = Joi.object({
  favorite: Joi.boolean().required(),
});

module.exports = { Contact, schemas: {
    add: contactSchemaValidate,
    updateFavorite: contactSchemaValidateFavorite
}};