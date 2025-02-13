import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

function EditPost() {
  const location = useLocation();
  const navigate = useNavigate();

  // Access passed data from location.state
  const { postId, userId, title, description } = location.state || {};

  const [postData, setPostData] = useState({
    title: title || '',
    description: description || '',
  });

  useEffect(() => {
    if (!location.state) {
      navigate('/log-in');
    }
  }, [location.state, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setPostData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const updatedPost = {
      title: postData.title,
      description: postData.description,
      userId: userId,
    };

    const token = localStorage.getItem('authToken');
    try {
      const response = await axios.patch(
        `http://localhost:5000/api/edit-post/${postId}`,
        updatedPost,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert('Post updated successfully!');
      navigate('/users');
    } catch (err) {
      console.error('Error:', err);
      if (err.response) {
        if (err.response.status === 401) {
          alert('You must log-in first');
          navigate('/log-in');
        } else if (err.response.status === 400) {
          alert('Invalid token; log-in again');
          localStorage.removeItem('authToken');
          navigate('/log-in');
        } else {
          alert('Failed to reach User data');
        }
      }
    }
  };

  return (
    <div>
      <div className="min-h-screen bg-gray-100 flex flex-col items-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg mt-8">
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
            Add Post
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Title:
              </label>
              <input
                name="title"
                type="text"
                value={postData.title}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Description:
              </label>
              <textarea
                name="description"
                value={postData.description}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="6"
                placeholder="Write your description here..."
              />
            </div>

            <div className="flex justify-between items-center">
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition duration-300"
              >
                Create a Post
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditPost;
