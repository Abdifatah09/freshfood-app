import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ForgetPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  async function submitInfo(event) {
    event.preventDefault();

    try {
      const response = await axios.get(
        'http://localhost:5000/api/forget-password',
        {
          params: { email },
        }
      );

      console.log('Received user data:', response.data);

      navigate('/edit-user', {
        state: {
          userId: response.data[0]?.id,
          name: response.data[0]?.name,
          email: response.data[0]?.email,
          role: response.data[0]?.role,
        },
      });
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  }

  async function handleChange(event) {
    const { name, value } = event.target;
    setEmail(value);

    if (name === 'email') {
      if (value.trim() === '') {
        setEmailError('Email cannot be empty');
      } else {
        setEmailError('');
      }
    }
  }

  return (
    <div className="flex items-start justify-center min-h-screen bg-gray-100 pt-10">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md mt-10">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Enter Email for your Account
        </h2>
        <form onSubmit={submitInfo}>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            {emailError && (
              <p className="text-red-500 text-xs mt-1">{emailError}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-300"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgetPassword;
