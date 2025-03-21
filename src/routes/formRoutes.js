const express = require("express");
const router = express.Router();
const formController = require("../controller/Form Controller/formController");

router.get("/fetch-all-responses", formController.fetchAllFormResponses);

module.exports = router;
