const express = require('express');
const { User } = require('../models/User'); // Import User model
const { Sequelize } = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const verifyToken =require(`../middleware/verifyToken`)
require('dotenv').config();  // This will load your .env file

const router = express.Router();

// Route to create a new user
router.post('/users', async (req, res) => {
  const { name, email, password, role } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const newUser = await User.create({ name, email, password: hashedPassword, role });
    const token = jwt.sign({ userId: newUser.id, email: newUser.email }, process.env.SECRET_KEY , { expiresIn: '10m' });
    res.status(201).json({
      user: newUser,
      token: token,
    });// Send the newly created user
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).send("Internal Server Error");
  }
});
// Route to get all users
router.get('/users', verifyToken, async (req, res) => {
  try {
    const users = await User.findAll(); // Find all users from the database
    res.status(200).json(users);  
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).send("Internal Server Error");
  }
});
//Get a specfic user according to their name
router.get('/specfic-users', verifyToken, async (req,res) => {
  const { name } = req.query; 
  
  if(!name){
    return res.status(400).json({message: "Name is required." })
  }
  try {
    const specifcUsers = await User.findAll({
      where: {
        name: {
          [Sequelize.Op.like]: `%${name}%`
        }
      }
    })

    if(specifcUsers.length === 0){
      return res.status(404).json({ message: "No users found"})
    }
    
    res.status(200).json(specifcUsers)
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
  
})
//Get a specific user by email
router.get('/forget-password', async (req,res) => {
  const { email } = req.query; 

  if(!email){
    return res.status(400).json({message: "Name is required." })
  }
  try {
    const specifcUsers = await User.findAll({
      where: {
        email: {
          [Sequelize.Op.like]: `${email}`
        }
      }
    })

    if(specifcUsers.length === 0){
      return res.status(404).json({ message: "No users found."})
    }
    
    res.status(200).json(specifcUsers)
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
  
})
//Delete a user by id
router.delete('/delete/:id',verifyToken, async (req,res) => {
  const userId = parseInt(req.params.id);
  try{
    const deletedUser = await User.destroy({
      where:{
        id: userId
      }
    });

    if(!deletedUser){
      return res.status(404).json({message: 'User not found'});
    }

    res.status(200).json({message: 'User Deleted Successfully'})

  } catch(err){
    console.error('Error deleting user:', err.message );
    res.status(500).send('Internal Server Error');

  }
})
//Edit a user by id
router.patch('/update/:id', async (req,res) => {
  const userId = parseInt(req.params.id)
  const { name, email, password, role } = req.body  
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await User.findByPk(userId);
    if(!user){
      return res.status(404).json({messsage: 'User Not Found' });
    }
 
    await user.update({
      name: name || user.name,
      email: email || user.email,
      password: hashedPassword || user.password,
      role: role || user.role,
    });

    res.status(200).json({
      message: 'User Successfully Updated',
      user: user,
    });
  } catch (err) {
    console.error('Error updating user:', err.message);
    res.status(500).send('Internal Server Error')
    
  }
  
})
//Login and jwt authentication
router.post('/login', async (req,res) => {

  const { email, password } = req.body

  try {
      const user = await User.findOne({
        where: { email }
      })

    if(!user){
      return res.status(404).json({message:"Invalid User. Try Again"})
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch){
      return res.status(401).json({messsage: "Invalid credentials. Try Again"})
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.SECRET_KEY , { expiresIn: '1hr' });

    return res.status(200).json({message:"Successfully Signed in", token});

  } catch (err) {

    console.log(err);
    res.status(500).json({message: "Server Error"});
    
  }
  
})

module.exports = router;
