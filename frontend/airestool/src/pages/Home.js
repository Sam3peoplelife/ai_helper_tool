import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('token');

  const exampleData = `[
    {
        "date": "2023-12-31",
        "day_of_week": "Sunday",
        "weather": "cloudy",
        "sales": {
            "Product 1": 64,
            "Product 2": 135,
            "Product 3": 12,
            "Product 4": 29,
            "Product 5": 24,
            "Product 6": 7,
            "Product 7": 22,
            "Product 8": 150,
            "Product 9": 26,
            "Product 10": 13
        }
    }
  ]`;

  const handleLogin = () => {
    navigate('/login');
  };

  const handleSignup = () => {
    navigate('/signup');
  };

  return (
    <div className='w-full h-screen bg-[#1a1a1a] text-white flex flex-col items-center justify-center p-6'>
      <h2 className='text-4xl font-bold mb-4'>AI Sales Prediction Tool</h2>
      <p className='text-lg mb-6 text-center max-w-2xl'>
        Welcome to the AI Sales Prediction Tool. This tool helps you predict sales based on various factors such as date, day of the week, and weather conditions. 
        Upload your sales data in JSON format, and our tool will provide you with accurate predictions to help you make informed decisions.
      </p>
      <div className='bg-gray-800 p-4 rounded-lg shadow-lg w-full max-w-2xl'>
        <h3 className='text-2xl font-semibold mb-2'>Example JSON Data</h3>
        <pre className='bg-gray-900 p-4 rounded-lg text-left overflow-x-auto whitespace-pre-wrap'>
          <code>{exampleData}</code>
        </pre>
      </div>
      {!isLoggedIn && (
        <div className='mt-6 flex space-x-4'>
          <button 
            onClick={handleLogin} 
            className='px-6 py-2 bg-blue-600 hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105 rounded-lg shadow-lg'
          >
            Login
          </button>
          <button 
            onClick={handleSignup} 
            className='px-6 py-2 bg-green-600 hover:bg-green-700 transition duration-300 ease-in-out transform hover:scale-105 rounded-lg shadow-lg'
          >
            Signup
          </button>
        </div>
      )}
    </div>
  );
}

export default Home;
