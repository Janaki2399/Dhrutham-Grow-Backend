const mongoose = require("mongoose");
const { Schema } = mongoose;

const progressSchema = new Schema({
  quiz: { type: Schema.Types.ObjectId, ref: "Quiz" ,  index: { unique: true }},
  numberOfAttempts: Number,
  highestScore: Number,
  attemptDetails: [{ type: Schema.Types.ObjectId, ref: "Score" }]
  });
const Progress = mongoose.model("Progress", progressSchema);

module.exports = { Progress };