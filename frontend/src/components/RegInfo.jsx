import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Post from './Post';
import { useNavigate, Link } from 'react-router-dom';

function RegInfo(props) {
  const [message, setMessage] = useState('');
  const [posts, setPosts] = useState([]);
  const [postsError, setPostsError] = useState('');
  const [isPostsLoading, setPostsIsLoading] = useState(true);

  const navigate = useNavigate();

  const fetchPosts = async () => {
    setPostsIsLoading(true);
    const token = localStorage.getItem('authToken');

    if (!token) {
      setPostsError('You must log-in first');
      navigate('/log-in');
      return;
    }

    try {
      const response = await axios.get('http://localhost:5000/api/view-post', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          userId: props.userId,
        },
      });

      if (response.data.length === 0) {
        setPostsError('');
      }
      setPosts(response.data);
    } catch (err) {
      console.error('Error:', err);
      if (err.response) {
        if (err.response.status === 401) {
          setPostsError('You must log-in first');
          navigate('/log-in');
        } else if (err.response.status === 400) {
          setPostsError('Invalid token; log-in again');
          localStorage.removeItem('authToken');
          navigate('/log-in');
        } else {
          setPostsError('Failed to reach User data');
        }
      }
    } finally {
      setPostsIsLoading(false);
    }
  };

  useEffect(() => {
    if (props.userId) {
      fetchPosts();
    }
  }, [props.userId]);

  const deleteUsers = async () => {
    const token = localStorage.getItem('authToken');
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/delete/${props.userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        setMessage('Successfully Deleted User');
        alert('Successfully Deleted User');
        props.fetchUsers();
      } else {
        setMessage('Failed to delete user');
        alert('Failed to delete user');
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
    <div className="bg-white p-6 rounded-lg shadow-md mb-4 flex justify-between items-start flex-col">
      <div className="flex-1 mb-6">
        <p className="font-semibold text-xl">{props.name} registered as:</p>
        {props.buyer && <p className="text-blue-600">Buyer</p>}
        {props.seller && <p className="text-green-600">Seller</p>}
        <p className="text-gray-700">Email: {props.email}</p>
        <p className="text-gray-500">User ID: {props.userId}</p>
      </div>

      <div className="space-x-4 mb-6">
        <button
          onClick={deleteUsers}
          className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-700 transition duration-300"
        >
          Delete
        </button>
        <Link
          to="/edit-user"
          state={{
            userId: props.userId,
            name: props.name,
            email: props.email,
            role: props.role,
          }}
        >
          <button className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300">
            Edit
          </button>
        </Link>
        <Link
          to="/add-post"
          state={{
            userId: props.userId,
          }}
        >
          <button className="bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300">
            Add A Post
          </button>
        </Link>
      </div>

      <div className="container mx-auto p-4 mt-4">
        {postsError && (
          <p className="text-center text-lg text-red-600 font-medium">
            {postsError}
          </p>
        )}

        {posts.length === 0 && !postsError ? (
          <p className="text-center text-lg font-medium text-gray-500">
            No posts found
          </p>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div
                className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all mb-4"
                key={post.id}
              >
                <Post
                  postId={post.id}
                  userId={post.userId}
                  title={post.title}
                  description={post.description}
                  fetchPosts={fetchPosts}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default RegInfo;
