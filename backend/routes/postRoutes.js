const express = require('express');
const { User } = require('../models/User'); // Import User model
const { Post } = require('../models/Post')
const { Sequelize } = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const verifyToken =require(`../middleware/verifyToken`)
require('dotenv').config();  // This will load your .env file




const router = express.Router();

// Route to create a new post
router.post('/add-post', verifyToken, async (req, res) => {
  const { title, description, userId } = req.body;

  if (!title || !description || !userId) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  // Check if the user exists
  const user = await User.findByPk(userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }


  try {
    const newPost = await Post.create({ title, description, userId });
    res.status(201).json({
        message:'Post Created Successfully',
        post: newPost,
    });// Send the newly created user
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).send("Internal Server Error");
  }
});
//Route to get posts for each user
router.get('/view-post', verifyToken, async (req, res) => {
    const { userId } = req.query;
  
    if (!userId) {
      return res.status(400).json({ message: "UserID is required." });
    }
  
    try {
      const posts = await Post.findAll({
        where: {
          userId: userId,
        },
      });
  
      if (posts.length === 0) {
        // Return an empty array instead of a 404 error
        return res.status(200).json([]);  // Return an empty array if no posts found
      }
  
      res.status(200).json(posts);  // Return the posts if found
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
  
//Route to edit a specific post
router.patch('/edit-post/:id', verifyToken, async (req,res) => {
      const postId = parseInt(req.params.id)
      const { title, description } = req.body  
     
      try {
        const post = await Post.findByPk(postId);
        if(!post){
          return res.status(404).json({messsage: 'Post Not Found' });
        }
     
        await post.update({
          title: title || post.title,
          description: description || post.description,
        });
    
        res.status(200).json({
          message: 'Post Successfully Updated',
          post: post,
        });
      } catch (err) {
        console.error('Error updating podt:', err.message);
        res.status(500).send('Internal Server Error')
        
      }
    
})
//Route to delete a post
router.delete('/delete-post/:id', verifyToken, async (req,res) => {
    const postId = parseInt(req.params.id);

    try {
        const deletedPost = await Post.destroy({
            where:{
                id: postId
            }
        });
        if(!deletedPost){
            return res.status(404).json({message: 'Post not found'});
        }
        
    res.status(200).json({message: 'Post Deleted Successfully'})

    } catch(err){
        console.error('Error deleting post:', err.message );
        res.status(500).send('Internal Server Error');   
      }
    
})

module.exports = router;
