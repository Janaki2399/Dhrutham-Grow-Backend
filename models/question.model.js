const mongoose = require("mongoose")
const { Schema } = mongoose;
 const questionSchema = new Schema({
    topic:String,
    question:String,
    points:Number,
    level:String,
    options:[
      {
        text:String,
        isRight:Boolean
      }
    ],
  });

const Question=mongoose.model('Question', questionSchema);
module.exports = { Question }