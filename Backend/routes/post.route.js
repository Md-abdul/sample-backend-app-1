const express = require("express");
const router = express.Router();
const PostModel = require("../model/post.model");
const auth = require("../middlewares/auth");

router.post("/add", auth, async (req, res) => {
  try {
    const { title, content } = req.body;
    // const post = new PostModel({
    //   title,
    //   content,
    //   creator: req.userId,
    //   name: req.username
    // });
    // await post.save();
    const post = await PostModel.create({title,content,creator:req.userId, name: req.username})
    await post.populate("creator")
    return res.status(201).send(post)
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

router.get("/", async(req,res) => {
  try {
    const post = await PostModel.find();
    return res.status(200).json(post)
  } catch (error) {
    console.error('Error getting post:', error)
    return res.status(500).json("Internal server Error")
  }
})

router.get("/search", async(req,res) => {
  try {
    const {searchQuery} = req.query;
    const title = new RegExp(searchQuery, "i")
    const posts = await PostModel.find({title})
    return res.status(200).json(posts)
  } catch (error) {
    console.error('Error getting post:', error)
    return res.status(500).json("Internal server Error")
  }
})

router.patch("/update/:postId", async(req,res) => {
  try {
    
    const post = await PostModel.find(req.params.postId)

     if(post.creator.toString() !== req.userId)
      res.send("you are not allow to update the post")
      const updatePost = await PostModel.findByIdAndUpdate(req.params.postId,req.body, {new: true})
      res.send(updatePost)
  } catch (error) {
    console.error('Error getting post:', error)
    return res.status(500).json("Internal server Error")
  }
})

router.delete("/delete/:postId", async(req,res) => {
  try {
    
    const post = await PostModel.find(req.params.postId)

     if(post.creator.toString() !== req.userId)
      res.send("you are not allow to update the post")
      const deletePost = await PostModel.findByIdAndDelete(req.params.postId,req.body, {new: true})
      res.send(deletePost)
  } catch (error) {
    console.error('Error getting post:', error)
    return res.status(500).json("Internal server Error")
  }
})

router.patch("/like/:postId", async(req,res) => {
  try {
    
    const post = await PostModel.find(req.params.postId)
    const index = post.likes.findIndex((id) => id===String(req.userId))

    if(index==-1){
      post.likes.push(req.userId)
    }
    else {
      post.likes = post.likes.filter((id) => id !== String(req.userId))
    }

    const updatePost = await PostModel.findByIdAndUpdate(req.params.postId,post, {new:true})

    res.send(updatePost)
  } catch (error) {
    console.error('Error getting post:', error)
    return res.status(500).json("Internal server Error")
  }
})

module.exports = router;
