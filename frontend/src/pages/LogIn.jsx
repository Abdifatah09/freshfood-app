import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
  var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const navigate = useNavigate();

  const [info, setInfo] = useState({
    email: '',
    password: '',
  });
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  async function submitInfo(event) {
    event.preventDefault();

    const userData = {
      email: info.email,
      password: info.password,
    };

    try {
      const response = await axios.post(
        'http://localhost:5000/api/login',
        userData
      );
      if (response.status === 200) {
        localStorage.setItem('authToken', response.data.token);
        alert('Successfully Signed In!!');
        navigate('/users');
      }
    } catch (err) {
      console.error('Error:', err);
      if (err.response) {
        if (err.response.status === 404) {
          setEmailError('Email not found. Try Again');
          setPasswordError('');
          setInfo({ email: '' });
        } else if (err.response.status === 403) {
          setPasswordError('Invalid password, please try again');
          setEmailError('');
          setInfo({ password: '' });
        } else {
          setEmailError('An unexpected error occurred');
          setPasswordError('An unexpected error occurred');
        }
      } else {
        setEmailError('Unable to connect to the server');
        setPasswordError('Unable to connect to the server');
      }
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setInfo((prevInfo) => {
      const updatedInfo = { ...prevInfo, [name]: value };
      return updatedInfo;
    });

    if (name === 'email') {
      if (value.trim() === '') {
        setEmailError('Email cannot be empty');
      } else if (!value.match(mailformat)) {
        setEmailError('Invalid e-mail address.');
      } else {
        setEmailError('');
      }
    }
    if (name === 'password') {
      if (value.trim() === '') {
        setPasswordError('Password cannot be empty');
      } else if (value.length < 8) {
        setPasswordError('Password cannot be less than 8 characters');
      } else {
        setPasswordError('');
      }
    }
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Log In
        </h2>
        <form onSubmit={submitInfo}>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={info.email}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            {emailError && (
              <p className="text-red-500 text-xs mt-1">{emailError}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={info.password}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            {passwordError && (
              <p className="text-red-500 text-xs mt-1">{passwordError}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-300"
          >
            Login
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link to="/forget-password">
            <button
              type="button"
              className="w-full text-blue-500 bg-transparent py-2 px-4 rounded-md border border-blue-500 hover:bg-blue-500 hover:text-white transition duration-300"
            >
              Forgot your password? Press here to reset it
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
