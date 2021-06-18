const mongoose = require("mongoose")
const { Schema } = mongoose;
 const ScoreSchema = new Schema({
    score:Number,
    numberOfCorrectAnswers:Number,
    numberOfWrongAnswers:Number
  });

const Score=mongoose.model('Score', ScoreSchema);
module.exports = { Score }