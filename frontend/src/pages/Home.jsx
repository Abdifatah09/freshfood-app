import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';

function Home() {
  return (
    <div>
      <Navbar />
      <div className="bg-gray-100 min-h-screen flex flex-col justify-center items-center text-center p-6">
        <h2 className="text-4xl font-semibold text-gray-800 mb-4">
          Welcome to FreshFood
        </h2>
        <p className="text-lg text-gray-600 mb-6">
          Please use the navigation to register or view users.
        </p>
      </div>
    </div>
  );
}

export default Home;
