import React, { useEffect, useState } from 'react';
import RegInfo from '../components/RegInfo';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { useNavigate, Link } from 'react-router-dom';

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [userError, setUserError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [specficUserName, setSpecficUserName] = useState('');
  const navigate = useNavigate();

  const fetchUsers = async () => {
    setIsLoading(true);
    const token = localStorage.getItem('authToken');

    if (!token) {
      setUserError('You must log-in first');
      navigate('/log-in');
    }

    try {
      const response = await axios.get('http://localhost:5000/api/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data);
    } catch (err) {
      console.error('Error:', err);
      if (err.response) {
        if (err.response.status === 401) {
          setUserError('You must log-in first');
          navigate('/log-in');
        } else if (err.response.status === 400) {
          setUserError('Invalid token; log-in again');
          localStorage.removeItem('authToken');
          navigate('/log-in');
        } else {
          setUserError('Failed to reach User data');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (event) => {
    setSpecficUserName(event.target.value);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-lg font-medium text-blue-600">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <div className="max-w-md mx-auto mt-8 p-6 bg-white shadow-lg rounded-lg">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Search For a specific user
        </label>
        <input
          type="text"
          name="name"
          value={specficUserName}
          onChange={handleInputChange}
          className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:ring-2 focus:ring-blue-500"
          placeholder="Enter user's name"
        />
        <Link
          to="/specifc-user"
          state={{
            specficUserName,
          }}
        >
          <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300">
            Submit
          </button>
        </Link>
      </div>

      <div className="container mx-auto p-4 mt-6">
        {userError && (
          <p className="text-center text-lg text-red-600 font-medium">
            {userError}
          </p>
        )}

        {users.length === 0 && !userError ? (
          <p className="text-center text-lg font-medium text-gray-500">
            No users found
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <div
                key={user.id}
                className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-all"
              >
                <RegInfo
                  userId={user.id}
                  name={user.name}
                  email={user.email}
                  role={user.role}
                  fetchUsers={fetchUsers}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default UsersPage;
