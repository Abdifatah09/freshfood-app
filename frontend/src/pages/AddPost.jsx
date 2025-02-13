import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

function AddPost() {
  const location = useLocation();
  const navigate = useNavigate();

  const { userId } = location.state || {};

  const [postData, setPostData] = useState({
    title: '',
    description: '',
    userId: userId,
  });

  const [errors, setErrors] = useState({
    title: '',
    description: '',
  });

  const [generalError, setGeneralError] = useState('');

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

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      title: '',
      description: '',
    };

    if (!postData.title.trim()) {
      newErrors.title = 'Title is required';
      isValid = false;
    }

    if (!postData.description.trim()) {
      newErrors.description = 'Description is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const newPost = {
      title: postData.title,
      description: postData.description,
      userId: userId,
    };

    const token = localStorage.getItem('authToken');
    try {
      const response = await axios.post(
        `http://localhost:5000/api/add-post`,
        newPost,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert('Post created successfully!');
      navigate('/users');
    } catch (err) {
      console.error('Error:', err);
      if (err.response) {
        if (err.response.status === 401) {
          setGeneralError('You must log-in first');
          navigate('/log-in');
        } else if (err.response.status === 400) {
          setGeneralError('Invalid token; log-in again');
          localStorage.removeItem('authToken');
          navigate('/log-in');
        } else {
          setGeneralError('Failed to reach User data');
        }
      } else {
        setGeneralError('Something went wrong. Please try again.');
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
          {generalError && (
            <div className="text-center text-lg text-red-600 font-medium mb-4">
              {generalError}
            </div>
          )}
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
              {errors.title && (
                <p className="text-red-500 text-xs">{errors.title}</p>
              )}
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
              {errors.description && (
                <p className="text-red-500 text-xs">{errors.description}</p>
              )}
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

export default AddPost;
