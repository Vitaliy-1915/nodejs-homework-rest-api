const express = require("express");

const { autchenticate, upload } = require("../../middlewares");

const ctrl = require('../../controllers/users');

const router = express.Router();

router.get("/verify/:verificationToken", ctrl.verify);

router.post("/verify", ctrl.reVerify);

router.get("/current", autchenticate, ctrl.current);

router.get("/logout", autchenticate, ctrl.logout);

router.patch("/avatars", autchenticate, upload.single("avatar"), ctrl.avatars);

module.exports = router;