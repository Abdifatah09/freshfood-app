import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Post({ postId, userId, title, description, fetchPosts }) {
  const [message, setMessage] = useState('');

  const navigate = useNavigate();
  const deleteUsers = async () => {
    const token = localStorage.getItem('authToken');
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/delete-post/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        setMessage('Successfully Deleted Post');
        alert('Successfully Deleted Post');
        fetchPosts();
      } else {
        setMessage('Failed to delete Post');
        alert('Failed to delete Post');
      }
    } catch (err) {
      console.error('Error:', err);
      if (err.response) {
        if (err.response.status === 401) {
          setMessage('You must log-in first');
          navigate('/log-in');
        } else if (err.response.status === 400) {
          setMessage('Invalid token; log-in again');
          localStorage.removeItem('authToken');
          navigate('/log-in');
        } else {
          setMessage('Failed to reach User data');
        }
      }
    }
  };
  return (
    <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all mb-4">
      <h3 className="font-semibold text-lg text-gray-800">{title}</h3>
      <p className="text-gray-600 mt-2">{description}</p>
      <p className="text-gray-500 mt-4">User ID: {userId}</p>
      <div className="space-x-4 mb-6">
        <button
          onClick={deleteUsers}
          className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-700 transition duration-300"
        >
          Delete
        </button>
        <Link
          to="/edit-post"
          state={{
            postId: postId,
            userId: userId,
            title: title,
            description: description,
          }}
        >
          <button className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300">
            Edit
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Post;
