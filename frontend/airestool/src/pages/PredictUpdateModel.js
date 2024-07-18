import React, { useState } from 'react';
import axios from 'axios';
import { SlideDown } from 'react-slidedown';
import { ThreeDots } from 'react-loader-spinner'; // Import ThreeDots directly
import 'react-slidedown/lib/slidedown.css';

function PredictUpdateModel() {
  // State for the first card
  const [date1, setDate1] = useState('');
  const [dayOfWeek1, setDayOfWeek1] = useState('');
  const [weather1, setWeather1] = useState('');
  const [numProducts1, setNumProducts1] = useState(0);
  const [uploadStatus1, setUploadStatus1] = useState('');
  const [uploadSuccess1, setUploadSuccess1] = useState(null);
  const [showCard1, setShowCard1] = useState(false);
  const [predictions, setPredictions] = useState(null);

  // State for the second card
  const [date2, setDate2] = useState('');
  const [dayOfWeek2, setDayOfWeek2] = useState('');
  const [weather2, setWeather2] = useState('');
  const [numProducts2, setNumProducts2] = useState(0);
  const [productSales2, setProductSales2] = useState([]);
  const [uploadStatus2, setUploadStatus2] = useState('');
  const [uploadSuccess2, setUploadSuccess2] = useState(null);
  const [showCard2, setShowCard2] = useState(false);

  const [isUploading, setIsUploading] = useState(false); // Single loading state for both cards

  const username = localStorage.getItem('username'); // Ensure this is set

  const handleNumProductsChange2 = (e) => {
    const num = parseInt(e.target.value) || 0;
    setNumProducts2(num);
    setProductSales2(Array(num).fill(0));
  };

  const handleProductSaleChange2 = (index, value) => {
    const sales = [...productSales2];
    sales[index] = parseInt(value) || 0;
    setProductSales2(sales);
  };

  const handleUpload = async (salesData, type, setUploadSuccess, setUploadStatus) => {
    setIsUploading(true);
    const jsonFile = new Blob([JSON.stringify(salesData)], { type: 'application/json' });
    const formData = new FormData();
    formData.append('file', jsonFile, 'sales_data.json');
    formData.append('username', username);
    formData.append('type', type);

    try {
      const response = await axios.post('http://localhost:3001/uploadFile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        const fileName = 'sales_data.json'; // Assuming this is the file name after upload
        if (type === 'predict_data') {
          const predictResponse = await axios.post('http://localhost:3001/predict', { username, fileName });
          setPredictions(predictResponse.data.predictions);
          setUploadStatus('File uploaded and prediction successful.');
        } else if (type === 'update_data') {
          await axios.post('http://localhost:3001/update', { username, fileName });
          setUploadStatus('File uploaded and update successful.');
        }
        setUploadSuccess(true);
      } else {
        setUploadSuccess(false);
        setUploadStatus('File upload failed');
      }
    } catch (error) {
      setUploadSuccess(false);
      setUploadStatus('File upload failed');
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleUploadWithDefaultValues = () => {
    if (!date1 || !dayOfWeek1 || !weather1 || numProducts1 <= 0) {
      setUploadSuccess1(false);
      setUploadStatus1('Please fill in all fields and ensure number of products is greater than 0.');
      return;
    }

    const sales = Array.from({ length: numProducts1 }).reduce((obj, _, index) => {
      obj[`Product ${index + 1}`] = 0;
      return obj;
    }, {});

    const salesData = [{
      date: date1,
      day_of_week: dayOfWeek1,
      weather: weather1,
      sales
    }];

    handleUpload(salesData, 'predict_data', setUploadSuccess1, setUploadStatus1);
  };

  const handleUploadWithCustomValues = () => {
    if (!date2 || !dayOfWeek2 || !weather2 || numProducts2 <= 0) {
      setUploadSuccess2(false);
      setUploadStatus2('Please fill in all fields and ensure number of products is greater than 0.');
      return;
    }

    const sales = productSales2.reduce((obj, value, index) => {
      obj[`Product ${index + 1}`] = value;
      return obj;
    }, {});

    const salesData = [{
      date: date2,
      day_of_week: dayOfWeek2,
      weather: weather2,
      sales
    }];

    handleUpload(salesData, 'update_data', setUploadSuccess2, setUploadStatus2);
  };

  return (
    <div className="w-full h-screen flex flex-row items-center justify-center bg-gray-100 space-x-6 p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg transition-all duration-300 hover:shadow-xl">
        <h2 className="text-2xl mb-4 cursor-pointer font-semibold text-blue-600 hover:text-blue-800" onClick={() => setShowCard1(!showCard1)}>
          {showCard1 ? 'Hide' : 'Show'} Upload Sales Data with Default Values
        </h2>
        <SlideDown>
          {showCard1 && (
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              <label className="block mb-2 text-lg font-medium text-gray-700">Date</label>
              <input
                type="date"
                value={date1}
                onChange={(e) => setDate1(e.target.value)}
                className="mb-4 p-2 border rounded-lg w-full focus:border-blue-500 focus:ring-blue-500"
                disabled={isUploading}
              />

              <label className="block mb-2 text-lg font-medium text-gray-700">Day of Week</label>
              <select
                value={dayOfWeek1}
                onChange={(e) => setDayOfWeek1(e.target.value)}
                className="mb-4 p-2 border rounded-lg w-full focus:border-blue-500 focus:ring-blue-500"
                disabled={isUploading}
              >
                <option value="">Select a day</option>
                {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>

              <label className="block mb-2 text-lg font-medium text-gray-700">Weather</label>
              <select
                value={weather1}
                onChange={(e) => setWeather1(e.target.value)}
                className="mb-4 p-2 border rounded-lg w-full focus:border-blue-500 focus:ring-blue-500"
                disabled={isUploading}
              >
                <option value="">Select weather</option>
                {['cloudy', 'sunny', 'rainy', 'snowy'].map((condition) => (
                  <option key={condition} value={condition}>
                    {condition}
                  </option>
                ))}
              </select>

              <label className="block mb-2 text-lg font-medium text-gray-700">Number of Products</label>
              <input
                type="number"
                value={numProducts1}
                onChange={(e) => setNumProducts1(parseInt(e.target.value) || 0)}
                className="mb-4 p-2 border rounded-lg w-full focus:border-blue-500 focus:ring-blue-500"
                min="1"
                disabled={isUploading}
              />

              {isUploading ? (
                <div className="w-full flex justify-center mt-4">
                  <ThreeDots color="#000" height={40} />
                </div>
              ) : (
                <button
                  onClick={handleUploadWithDefaultValues}
                  className="w-full p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 mt-4"
                  disabled={isUploading}
                >
                  Upload File
                </button>
              )}

              {uploadStatus1 && (
                <p className={`mt-4 text-lg ${uploadSuccess1 ? 'text-green-500' : 'text-red-500'}`}>
                  {uploadStatus1}
                </p>
              )}

              {predictions && (
                <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                  <h3 className="text-xl mb-2 font-semibold">Predictions:</h3>
                  <pre className="bg-white p-2 rounded-lg shadow-inner">{JSON.stringify(predictions, null, 2)}</pre>
                </div>
              )}
            </div>
          )}
        </SlideDown>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg transition-all duration-300 hover:shadow-xl">
        <h2 className="text-2xl mb-4 cursor-pointer font-semibold text-blue-600 hover:text-blue-800" onClick={() => setShowCard2(!showCard2)}>
          {showCard2 ? 'Hide' : 'Show'} Upload Sales Data with Custom Values
        </h2>
        <SlideDown>
          {showCard2 && (
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              <label className="block mb-2 text-lg font-medium text-gray-700">Date</label>
              <input
                type="date"
                value={date2}
                onChange={(e) => setDate2(e.target.value)}
                className="mb-4 p-2 border rounded-lg w-full focus:border-blue-500 focus:ring-blue-500"
                disabled={isUploading}
              />

              <label className="block mb-2 text-lg font-medium text-gray-700">Day of Week</label>
              <select
                value={dayOfWeek2}
                onChange={(e) => setDayOfWeek2(e.target.value)}
                className="mb-4 p-2 border rounded-lg w-full focus:border-blue-500 focus:ring-blue-500"
                disabled={isUploading}
              >
                <option value="">Select a day</option>
                {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>

              <label className="block mb-2 text-lg font-medium text-gray-700">Weather</label>
              <select
                value={weather2}
                onChange={(e) => setWeather2(e.target.value)}
                className="mb-4 p-2 border rounded-lg w-full focus:border-blue-500 focus:ring-blue-500"
                disabled={isUploading}
              >
                <option value="">Select weather</option>
                {['cloudy', 'sunny', 'rainy', 'snowy'].map((condition) => (
                  <option key={condition} value={condition}>
                    {condition}
                  </option>
                ))}
              </select>

              <label className="block mb-2 text-lg font-medium text-gray-700">Number of Products</label>
              <input
                type="number"
                value={numProducts2}
                onChange={handleNumProductsChange2}
                className="mb-4 p-2 border rounded-lg w-full focus:border-blue-500 focus:ring-blue-500"
                min="1"
                disabled={isUploading}
              />

              {productSales2.map((value, index) => (
                <div key={index} className="mb-4">
                  <label className="block mb-2 text-lg font-medium text-gray-700">Product {index + 1}</label>
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => handleProductSaleChange2(index, e.target.value)}
                    className="p-2 border rounded-lg w-full focus:border-blue-500 focus:ring-blue-500"
                    min="0"
                    disabled={isUploading}
                  />
                </div>
              ))}

              {isUploading ? (
                <div className="w-full flex justify-center mt-4">
                  <ThreeDots color="#000" height={40} />
                </div>
              ) : (
                <button
                  onClick={handleUploadWithCustomValues}
                  className="w-full p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 mt-4"
                  disabled={isUploading}
                >
                  Upload File
                </button>
              )}

              {uploadStatus2 && (
                <p className={`mt-4 text-lg ${uploadSuccess2 ? 'text-green-500' : 'text-red-500'}`}>
                  {uploadStatus2}
                </p>
              )}
            </div>
          )}
        </SlideDown>
      </div>
    </div>
  );
}

export default PredictUpdateModel;
