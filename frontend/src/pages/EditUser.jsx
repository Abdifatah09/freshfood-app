import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

function EditUser() {
  const location = useLocation();
  const navigate = useNavigate();

  const { userId, name, email, role } = location.state || {};

  console.log('Received location state:', location.state);

  const [formData, setFormData] = useState({
    name: name || '',
    email: email || '',
    role: role || '',
  });

  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [secondPasswordError, setSecondPasswordError] = useState('');

  useEffect(() => {
    if (!location.state) {
      navigate('/log-in');
    }
  }, [location.state, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === 'name') {
      if (value.trim() === '') setNameError('Name cannot be empty');
      else setNameError('');
    }
    if (name === 'email') {
      if (value.trim() === '') setEmailError('Email cannot be empty');
      else setEmailError('');
    }
    if (name === 'password') {
      if (value.trim() === '') setPasswordError('Password cannot be empty');
      else if (value.length < 8)
        setPasswordError('Password must be at least 8 characters');
      else setPasswordError('');
    }
    if (name === 'secondPassword') {
      if (value.trim() !== formData.password)
        setSecondPasswordError('Passwords do not match');
      else setSecondPasswordError('');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (nameError || emailError || passwordError || secondPasswordError) {
      alert('Please fix the errors before submitting.');
      return;
    }

    const updatedData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
    };
    const token = localStorage.getItem('authToken');
    try {
      const response = await axios.patch(
        `http://localhost:5000/api/update/${userId}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert('User updated successfully!');
      localStorage.removeItem('authToken');
      navigate('/log-in');
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
      <Navbar />
      <div className="min-h-screen bg-gray-100 flex flex-col items-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg mt-8">
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
            Edit User
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Name:
              </label>
              <input
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {nameError && (
                <p className="text-red-500 text-sm mt-1">{nameError}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Email:
              </label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {emailError && (
                <p className="text-red-500 text-sm mt-1">{emailError}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Password:
              </label>
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {passwordError && (
                <p className="text-red-500 text-sm mt-1">{passwordError}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Re-Type Password:
              </label>
              <input
                name="secondPassword"
                type="password"
                value={formData.secondPassword}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {secondPasswordError && (
                <p className="text-red-500 text-sm mt-1">
                  {secondPasswordError}
                </p>
              )}
            </div>

            <div className="flex justify-between items-center">
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition duration-300"
              >
                Update User
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditUser;
