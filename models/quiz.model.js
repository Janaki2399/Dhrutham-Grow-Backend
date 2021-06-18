const mongoose = require("mongoose")
const { Schema } = mongoose;

const quizSchema = new Schema({
    name: { 
      type:String,
      required:true
      }, 
    playtime:String,
    rules:String,
    thumbnail:String,
    numOfQuestions:Number,
    totalScore:Number,
    questions:[{ type: Schema.Types.ObjectId, ref: 'Question' }],
    
  });
const Quiz=mongoose.model('Quiz', quizSchema);

module.exports = { Quiz }