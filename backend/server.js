const express = require('express');
const { sequelize } = require('./sequelize'); // Import sequelize instance
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes'); // Import user routes
const postRoutes = require('./routes/postRoutes');

require('dotenv').config(); // Load environment variables

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json()); // To parse JSON requests

// Routes
app.use('/api', userRoutes); // Use the user routes
app.use('/api', postRoutes);// Use the post routes

// Sync Sequelize models with database
sequelize.sync()
  .then(() => console.log('Database connected successfully and tables created'))
  .catch(err => console.error('Database connection failed:', err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
