const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { extend } = require("lodash");
// const extend=require("")
const { Progress } = require("../models/progress.model");

router.use(async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = { userId: decoded.userId };
    next();
  } catch (error) {
    res
      .status(401)
      .json({ success: false, errorMessage: "Unauthorized access" });
  }
});

router.get("/:progressId", async (req, res) => {
  try {
    const { userId } = req.user;
    const progressId = req.params.progressId;
    const progress = await Progress.findById(progressId).populate(
      "attemptDetails"
    );
    res.status(200).json({ success: true, progress });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, errorMessage: "Something went wrong!" });
  }
});

module.exports = router;
