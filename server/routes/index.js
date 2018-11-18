const express = require("express");

const router = express.Router();
router.use("/authorization", require("./authorization"));
router.use("/user", require("./user"));
router.use("/photo", require("./photo"));
router.use("/tag", require("./tag"));

module.exports = router;
