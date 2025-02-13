const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../sequelize'); // Use the sequelize instance

// Define the User model
const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: 'Not Given Role', // Default role if not provided
  },
}, {
  tableName: 'freshfood_users',
});

// Import the Post model to create associations
const { Post } = require('./Post');  // Import the Post model after defining it

// Define the association (one-to-many: User has many Posts)
User.hasMany(Post, {
  foreignKey: 'userId',  // Foreign key in the Post model
});

require('./Post').Post.belongsTo(User, {
  foreignKey: 'userId',  // Foreign key in the Post model
});

// Export the User model for use in other files
module.exports = { User };
