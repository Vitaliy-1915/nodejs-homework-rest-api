const express = require('express');

const ctrl = require('../../controllers/contacts');

const {autchenticate} = require("../../middlewares");

const router = express.Router();

router.get('/', autchenticate, ctrl.getAll);

router.get('/:contactId', ctrl.getOnId);

router.post('/', autchenticate, ctrl.createContact);

router.put('/:contactId', ctrl.updateOnId);

router.patch('/:contactId/favorite', ctrl.updateOnIdFavorite);

router.delete('/:contactId', ctrl.deleteContact);

module.exports = router;
