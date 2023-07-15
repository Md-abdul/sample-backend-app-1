
const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  //creator: { type: String, required: true },
  creator: {type: mongoose.Schema.Types.ObjectId, ref:"user", required: true},
  name: { type: String, required: true },
  likes: {type: [String], default: []},
  comments: {type: [String], default: []},
  tags: [String]
})

const PostModel = mongoose.model("post", postSchema);

module.exports = PostModel