const express = require("express");
const router = express.Router();
const trainingController = require("../controller/Training Requests/trainingController");

router.get("/", trainingController.getAllStudents);

module.exports = router;