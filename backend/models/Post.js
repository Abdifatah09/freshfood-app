const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../sequelize'); // Use the sequelize instance

// Define the Post model
const Post = sequelize.define('Post', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  userId: {  // Foreign key to reference the User
    type: DataTypes.INTEGER,
    references: {
      model: 'freshfood_users', // the table we are referencing
      key: 'id',
    },
    onDelete: 'CASCADE',  // Automatically delete posts if a user is deleted
  },
}, {
  tableName: 'freshfood_posts',
});



// Export the Post model for use in other files
module.exports = { Post };


