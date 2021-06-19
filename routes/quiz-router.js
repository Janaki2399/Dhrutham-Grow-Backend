const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Quiz } = require("../models/quiz.model");
const { Question } = require("../models/question.model");

router.route("/").get(async (req, res) => {
  try {
    const quizList = await Quiz.find({}).select(
      "name thumbnail numOfQuestions"
    );
    res.status(200).json({ quizList, success: true });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, errorMessage: "Something went wrong" });
  }
});

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

router.route("/:quizId/rules").get(async (req, res) => {
  try {
    const quizId = req.params.quizId;
    const details = await Quiz.findById(quizId).select("rules playtime");
    res.status(200).json({ details, success: true });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, errorMessage: "Something went wrong!" });
  }
});

router.route("/:quizId/play").get(async (req, res) => {
  try {
    const quizId = req.params.quizId;
    const game = await Quiz.findById(quizId)
      .select("questions totalScore")
      .populate({ path: "questions" });
    res.status(200).json({ game, success: true });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, errorMessage: "Something went wrong!" });
  }
});
module.exports = router;
