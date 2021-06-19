const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { extend } = require("lodash");
const { Progress } = require("../models/progress.model");
const { Score } = require("../models/score.model");
const { ProgressList } = require("../models/progress.list.model");

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

router.get("/", async (req, res) => {
  try {
    const { userId } = req.user;
    const progressList = await ProgressList.findOne({ userId }).populate({
      path: "list",
      populate: { path: "quiz", select: "name thumbnail" },
      select: "numberOfAttempts",
    });
    res.status(200).json({ success: true, progressList });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, errorMessage: "Something went wrong" });
  }
});

router.post("/:quizId", async (req, res) => {
  try {
    const { userId } = req.user;
    const body = req.body;
    const quizId = req.params.quizId;
    const progressList = await ProgressList.findOne({ userId });

    if (progressList) {
      let quiz = await Progress.findOne({ quiz: quizId });
      if (quiz) {
        const score = new Score(body);
        await score.save();
        const highestScore =
          body.score > quiz.highestScore ? body.score : quiz.highestScore;
        quiz = extend(quiz, {
          numberOfAttempts: quiz.numberOfAttempts + 1,
          highestScore,
        });
        quiz.attemptDetails.push({ _id: score._id });
        await quiz.save();
      } else {
        const score = new Score(body);
        await score.save();
        const progress = new Progress({
          quiz: { _id: quizId },
          numberOfAttempts: 1,
          highestScore: body.score,
          attemptDetails: [{ _id: score._id }],
        });
        await progress.save();
        progressList.list.push({ _id: progress._id });
        await progressList.save();
      }
    } else {
      const score = new Score(body);
      await score.save();
      const progress = new Progress({
        quiz: { _id: quizId },
        numberOfAttempts: 1,
        highestScore: body.score,
        attemptDetails: [{ _id: score._id }],
      });
      await progress.save();
      const progressList = new ProgressList({
        userId,
        list: [{ _id: progress._id }],
      });
      await progressList.save();
    }
    res.json({ sucess: true });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, errorMessage: "Something went wrong" });
  }
});
module.exports = router;
