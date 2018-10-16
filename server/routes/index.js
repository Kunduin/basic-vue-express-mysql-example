const express = require("express");

const router = express.Router();
router.use("/authorization", require("./authorization"));
router.use("/user", require("./user"));

module.exports = router;
