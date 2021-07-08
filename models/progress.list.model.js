const mongoose = require("mongoose");
const { Schema } = mongoose;

const progressListSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: { unique: true },
  },
  list: [{ type: Schema.Types.ObjectId, ref: "Progress" }],
});
const ProgressList = mongoose.model("ProgressList", progressListSchema);

module.exports = { ProgressList };
