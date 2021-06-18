const express = require("express");
const quizRouter = require("./routes/quiz-router.js");
const loginRouter = require("./routes/login-router.js");
const signupRouter = require("./routes/signup-router.js");
const progressListRouter = require("./routes/progress-list-router.js");
const progressRouter = require("./routes/progress-router.js");

const mongoose = require("mongoose");
const { mongoDBConnection } = require("./db/db.connect.js");

const app = express();
var cors = require("cors");
app.use(cors());

app.use(express.json());

mongoDBConnection();

app.use("/quiz", quizRouter);
app.use("/login", loginRouter);
app.use("/signup", signupRouter);
app.use("/progress_list", progressListRouter);
app.use("/progress", progressRouter);

app.get("/", (req, res) => {
  res.json({ text: "hello world" });
});
const PORT = process.env.PORT || 5000;

app.use((req, res) => {
  res.status(400).json({ success: false, errorMessage: "No page found" });
});

app.use((err, req, res) => {
  console.error(err.stack);
  res.status(500).send("Something broke");
});

app.listen(PORT, () => {
  console.log("server started");
});
