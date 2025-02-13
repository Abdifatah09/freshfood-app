import React, { useEffect, useState } from 'react';
import RegInfo from '../components/RegInfo';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { useNavigate, useLocation } from 'react-router-dom';

function SpecficUser() {
  const location = useLocation();
  const { specficUserName } = location.state || {};

  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [userError, setUserError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = async () => {
    setIsLoading(true);
    const token = localStorage.getItem('authToken');
    try {
      const response = await axios.get(
        'http://localhost:5000/api/specfic-users',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: { name: specficUserName },
        }
      );
      setUsers(response.data);
      setUserError('');
    } catch (err) {
      console.err('Error:', error);
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

  useEffect(() => {
    fetchUsers();
  }, []);

  if (isLoading) {
    return (
      <p className="text-center text-lg font-medium text-blue-600 mt-8">
        Loading users...
      </p>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto p-6">
        {userError && (
          <p className="text-center text-lg text-red-600 font-medium">
            {userError}
          </p>
        )}

        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Users matching the name:{' '}
          <span className="text-blue-600">{specficUserName}</span>
        </h2>

        {users.length === 0 && !userError ? (
          <p className="text-center text-lg font-medium text-gray-500">
            No users found
          </p>
        ) : (
          <div className="space-y-6 mt-6">
            {users.map((user) => (
              <div
                key={user.id}
                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all"
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

export default SpecficUser;
