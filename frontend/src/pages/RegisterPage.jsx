import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import '../styles/tailwind.css';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
  var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const navigate = useNavigate();

  const [info, setInfo] = useState({
    name: '',
    email: '',
    password: '',
    secondPassword: '',
  });

  const [buyer, setBuyer] = useState(false);
  const [seller, setSeller] = useState(false);
  const [tos, setTos] = useState(false);

  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [secondPasswordError, setSecondPasswordError] = useState('');
  const [clientError, setClientError] = useState('');
  const [tosError, setTosError] = useState('');

  function handleChange(event) {
    const { name, value } = event.target;
    setInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));

    if (name === 'name') {
      if (value.trim() === '') {
        setNameError('Name cannot be empty');
      } else if (value.length < 3) {
        setNameError('Name cannot be less than 3 characters');
      } else {
        setNameError('');
      }
    }

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

    if (name === 'secondPassword') {
      if (value.trim() === '') {
        setSecondPasswordError('Password cannot be empty');
      } else if (value.trim() !== info.password.trim()) {
        setSecondPasswordError('Passwords do not match.');
      } else {
        setSecondPasswordError('');
      }
    }
  }

  async function submitInfo(event) {
    event.preventDefault();

    if (info.name.trim() === '') {
      setNameError('Name cannot be empty');
      return;
    } else if (info.password.trim() === '') {
      setPasswordError('Password cannot be empty');
      return;
    } else if (info.password.length < 8) {
      setPasswordError('Password must be more than 8 characters');
    } else if (info.email.trim() === '') {
      setEmailError('Email cannot be empty');
      return;
    } else if (!info.email.match(mailformat)) {
      setEmailError('Invalid e-mail address.');
      return;
    } else if (info.secondPassword.trim() === '') {
      setSecondPasswordError('Password cannot be empty');
      return;
    } else if (info.secondPassword.trim() !== info.password.trim()) {
      setSecondPasswordError('Passwords do not match.');
      return;
    } else if (!buyer && !seller) {
      setClientError('Please select at least one option.');
      return;
    } else if (!tos) {
      setTosError('Please agree to Terms of Service.');
      return;
    }

    const userData = {
      name: info.name,
      email: info.email,
      password: info.password,
      role: buyer ? 'buyer' : 'seller',
    };

    try {
      const response = await axios.post(
        'http://localhost:5000/api/users',
        userData
      );
      console.log('User registered:', response.data);
      localStorage.setItem('authToken', response.data.token);
      resetForm();
      navigate('/users');
    } catch (error) {
      console.error('Error:', error);
    }
  }

  function resetForm() {
    setInfo({
      name: '',
      email: '',
      password: '',
      secondPassword: '',
    });
    setBuyer(false);
    setSeller(false);
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Register
        </h2>
        <form onSubmit={submitInfo}>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={info.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            {nameError && (
              <p className="text-red-500 text-xs mt-1">{nameError}</p>
            )}
          </div>

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

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700">
              Re-type Password
            </label>
            <input
              type="password"
              name="secondPassword"
              value={info.secondPassword}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            {secondPasswordError && (
              <p className="text-red-500 text-xs mt-1">{secondPasswordError}</p>
            )}
          </div>

          <div className="mb-4">
            <input
              type="checkbox"
              id="buyer"
              name="buyer"
              checked={buyer}
              onChange={() => setBuyer(!buyer)}
              className="mr-2"
            />
            <label htmlFor="buyer" className="text-sm">
              I want to buy produce
            </label>
          </div>

          <div className="mb-4">
            <input
              type="checkbox"
              id="seller"
              name="seller"
              checked={seller}
              onChange={() => setSeller(!seller)}
              className="mr-2"
            />
            <label htmlFor="seller" className="text-sm">
              I want to sell produce
            </label>
          </div>

          {clientError && <p className="text-red-500 text-xs">{clientError}</p>}

          <div className="mb-4">
            <input
              type="checkbox"
              id="tos"
              checked={tos}
              onChange={() => setTos(!tos)}
              className="mr-2"
            />
            <label htmlFor="tos" className="text-sm">
              I agree to the{' '}
              <a href="#" className="text-blue-600">
                Terms of Service
              </a>
            </label>
          </div>
          {tosError && <p className="text-red-500 text-xs mt-1">{tosError}</p>}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-300"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
