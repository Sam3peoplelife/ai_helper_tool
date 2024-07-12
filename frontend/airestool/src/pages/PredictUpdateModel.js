import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ThreeDots } from 'react-loader-spinner'; // Assuming this component is imported

function PredictUpdateModel() {
  const [loadingPredict, setLoadingPredict] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [predictionResult, setPredictionResult] = useState('');
  const [updateMessage, setUpdateMessage] = useState('');
  const [products, setProducts] = useState([]);
  const [numberOfProducts, setNumberOfProducts] = useState(1); // State for number of products
  const [dayOfWeekOptions, setDayOfWeekOptions] = useState([]);
  const [weatherOptions, setWeatherOptions] = useState([]);
  const username = localStorage.getItem('username');

  useEffect(() => {
    // Fetch options for day of week and weather
    fetchDayOfWeekOptions();
    fetchWeatherOptions();
  }, []);

  const fetchDayOfWeekOptions = () => {
    // Simulating fetching options from a backend or static list
    const options = [
      { value: 'Sunday', label: 'Sunday' },
      { value: 'Monday', label: 'Monday' },
      { value: 'Tuesday', label: 'Tuesday' },
      { value: 'Wednesday', label: 'Wednesday' },
      { value: 'Thursday', label: 'Thursday' },
      { value: 'Friday', label: 'Friday' },
      { value: 'Saturday', label: 'Saturday' },
    ];
    setDayOfWeekOptions(options);
  };

  const fetchWeatherOptions = () => {
    // Simulating fetching options from a backend or static list
    const options = ['cloudy', 'rainy', 'sunny', 'snowy'].map((weather) => ({
      value: weather.toLowerCase(),
      label: weather,
    }));
    setWeatherOptions(options);
  };

  const handlePredict = async () => {
    setLoadingPredict(true);

    try {
      const predictionData = {
        date: new Date().toISOString().split('T')[0],
        dayOfWeek: '', // State for dropdown selection
        weather: '', // State for dropdown selection
        sales: {},
      };

      for (let i = 1; i <= numberOfProducts; i++) {
        predictionData.sales[`Product ${i}`] = 0; // Initialize with 0 sales
      }

      const response = await axios.post('http://localhost:3001/predict', {
        username,
        ...predictionData,
      });
      setPredictionResult(response.data.predictions);
    } catch (error) {
      console.error('Prediction error:', error);
    } finally {
      setLoadingPredict(false);
    }
  };

  const handleUpdate = async () => {
    setLoadingUpdate(true);

    try {
      const updateData = {
        date: new Date().toISOString().split('T')[0],
        dayOfWeek: '',
        weather: '',
        sales: {},
      };

      for (let i = 0; i < products.length; i++) {
        updateData.sales[`Product ${i + 1}`] = products[i];
      }

      const response = await axios.post('http://localhost:3001/update', {
        username,
        ...updateData,
      });
      setUpdateMessage('Model updated successfully.');
    } catch (error) {
      console.error('Update error:', error);
      setUpdateMessage('Failed to update model.');
    } finally {
      setLoadingUpdate(false);
    }
  };

  const handleProductChange = (index, value) => {
    const updatedProducts = [...products];
    updatedProducts[index] = value;
    setProducts(updatedProducts);
  };

  const handleAddProduct = () => {
    setProducts([...products, '']);
  };

  const handleRemoveProduct = (index) => {
    const updatedProducts = [...products];
    updatedProducts.splice(index, 1);
    setProducts(updatedProducts);
  };

  const handleNumberOfProductsChange = (event) => {
    const count = parseInt(event.target.value);
    setNumberOfProducts(count > 0 ? count : 1); // Ensure at least 1 product
    setProducts(Array.from({ length: count }, () => '')); // Reset products array
  };

  return (
    <div className="flex justify-center mt-8">
      {/* Predict Card */}
      <div className="m-4 p-4 border rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-2">Predictions</h2>
        <div className="mb-4">
          {/* Date picker */}
          <input type="date" className="p-2 border rounded-lg mr-2" />
          {/* Day of week dropdown */}
          <select
            value={dayOfWeekOptions.value}
            onChange={dayOfWeekOptions.onChange}
            className="p-2 border rounded-lg mr-2"
          >
            <option value="">Select Day of Week</option>
            {dayOfWeekOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {/* Weather dropdown */}
          <select
            value={weatherOptions.value}
            onChange={weatherOptions.onChange}
            className="p-2 border rounded-lg mr-2"
          >
            <option value="">Select Weather</option>
            {weatherOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {/* Number of products input */}
          <input
            type="number"
            min="1"
            value={numberOfProducts}
            onChange={handleNumberOfProductsChange}
            className="p-2 border rounded-lg mr-2"
          />
        </div>
        <button
          onClick={handlePredict}
          className="w-full p-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-700"
        >
          Predict
        </button>
        {loadingPredict && (
          <div className="flex items-center justify-center mt-4">
            <ThreeDots type="ThreeDots" color="#00BFFF" height={50} width={50} />
            <p className="ml-2 text-blue-500">Predicting, please wait...</p>
          </div>
        )}
        {predictionResult && (
          <div className="mt-4">
            <p className="text-lg mb-2">Prediction Results:</p>
            <pre>{JSON.stringify(predictionResult, null, 2)}</pre>
          </div>
        )}
      </div>

      {/* Update Card */}
      <div className="m-4 p-4 border rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-2">Update Model</h2>
        <div className="mb-4">
          {/* Date picker */}
          <input type="date" className="p-2 border rounded-lg mr-2" />
          {/* Day of week dropdown */}
          <select className="p-2 border rounded-lg mr-2">
            <option value="">Select Day of Week</option>
            {/* Populate options dynamically */}
          </select>
          {/* Weather dropdown */}
          <select className="p-2 border rounded-lg mr-2">
            <option value="">Select Weather</option>
            {/* Populate options dynamically */}
          </select>
        </div>
        {products.map((product, index) => (
          <div key={index} className="flex items-center mb-2">
            <input
              type="text"
              value={product}
              onChange={(e) => handleProductChange(index, e.target.value)}
              placeholder={`Product ${index + 1}`}
              className="p-2 border rounded-lg mr-2"
            />
            <button
              onClick={() => handleRemoveProduct(index)}
              className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-700"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          onClick={handleAddProduct}
          className="w-full p-2 bg-green-500 text-white rounded-lg hover:bg-green-700"
        >
          Add Product
        </button>
        <button
          onClick={handleUpdate}
          className="w-full mt-2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
          disabled={products.length === 0}
        >
          Update Model
        </button>
        {loadingUpdate && (
          <div className="flex items-center justify-center mt-4">
            <ThreeDots type="ThreeDots" color="#00BFFF" height={50} width={50} />
            <p className="ml-2 text-blue-500">Updating model, please wait...</p>
          </div>
        )}
        {updateMessage && <p className="mt-2 text-red-500">{updateMessage}</p>}
      </div>
    </div>
  );
}

export default PredictUpdateModel;
