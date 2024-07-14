import React, { useState } from 'react';
import axios from 'axios';

function PredictUpdateModel() {
  // State for the first card
  const [date1, setDate1] = useState('');
  const [dayOfWeek1, setDayOfWeek1] = useState('');
  const [weather1, setWeather1] = useState('');
  const [numProducts1, setNumProducts1] = useState(0);
  const [uploadStatus1, setUploadStatus1] = useState('');
  const [uploadSuccess1, setUploadSuccess1] = useState(null);

  // State for the second card
  const [date2, setDate2] = useState('');
  const [dayOfWeek2, setDayOfWeek2] = useState('');
  const [weather2, setWeather2] = useState('');
  const [numProducts2, setNumProducts2] = useState(0);
  const [productSales2, setProductSales2] = useState([]);
  const [uploadStatus2, setUploadStatus2] = useState('');
  const [uploadSuccess2, setUploadSuccess2] = useState(null);

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
          await axios.post('http://localhost:3001/predict', { username, fileName });
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
    <div className="w-full h-screen flex flex-row items-center justify-center bg-gray-100 space-x-6">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl mb-4">Upload Sales Data with Default Values</h2>
        <label className="block mb-2 text-lg">Date</label>
        <input
          type="date"
          value={date1}
          onChange={(e) => setDate1(e.target.value)}
          className="mb-4 p-2 border rounded-lg w-full"
        />

        <label className="block mb-2 text-lg">Day of Week</label>
        <select
          value={dayOfWeek1}
          onChange={(e) => setDayOfWeek1(e.target.value)}
          className="mb-4 p-2 border rounded-lg w-full"
        >
          <option value="">Select a day</option>
          {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
            <option key={day} value={day}>
              {day}
            </option>
          ))}
        </select>

        <label className="block mb-2 text-lg">Weather</label>
        <select
          value={weather1}
          onChange={(e) => setWeather1(e.target.value)}
          className="mb-4 p-2 border rounded-lg w-full"
        >
          <option value="">Select weather</option>
          {['cloudy', 'sunny', 'rainy', 'snowy'].map((condition) => (
            <option key={condition} value={condition}>
              {condition}
            </option>
          ))}
        </select>

        <label className="block mb-2 text-lg">Number of Products</label>
        <input
          type="number"
          value={numProducts1}
          onChange={(e) => setNumProducts1(parseInt(e.target.value) || 0)}
          className="mb-4 p-2 border rounded-lg w-full"
          min="1"
        />

        <button
          onClick={handleUploadWithDefaultValues}
          className="w-full p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 mt-4"
        >
          Upload File
        </button>

        {uploadStatus1 && (
          <p className={`mt-4 text-lg ${uploadSuccess1 ? 'text-green-500' : 'text-red-500'}`}>
            {uploadStatus1}
          </p>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl mb-4">Upload Sales Data with Custom Values</h2>
        <label className="block mb-2 text-lg">Date</label>
        <input
          type="date"
          value={date2}
          onChange={(e) => setDate2(e.target.value)}
          className="mb-4 p-2 border rounded-lg w-full"
        />

        <label className="block mb-2 text-lg">Day of Week</label>
        <select
          value={dayOfWeek2}
          onChange={(e) => setDayOfWeek2(e.target.value)}
          className="mb-4 p-2 border rounded-lg w-full"
        >
          <option value="">Select a day</option>
          {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
            <option key={day} value={day}>
              {day}
            </option>
          ))}
        </select>

        <label className="block mb-2 text-lg">Weather</label>
        <select
          value={weather2}
          onChange={(e) => setWeather2(e.target.value)}
          className="mb-4 p-2 border rounded-lg w-full"
        >
          <option value="">Select weather</option>
          {['cloudy', 'sunny', 'rainy', 'snowy'].map((condition) => (
            <option key={condition} value={condition}>
              {condition}
            </option>
          ))}
        </select>

        <label className="block mb-2 text-lg">Number of Products</label>
        <input
          type="number"
          value={numProducts2}
          onChange={handleNumProductsChange2}
          className="mb-4 p-2 border rounded-lg w-full"
          min="1"
        />

        {Array.from({ length: numProducts2 }).map((_, index) => (
          <div key={index} className="mb-2">
            <label className="block text-lg">{`Product ${index + 1}`}</label>
            <input
              type="number"
              value={productSales2[index] || 0}
              onChange={(e) => handleProductSaleChange2(index, e.target.value)}
              className="p-2 border rounded-lg w-full"
              min="0"
            />
          </div>
        ))}

        <button
          onClick={handleUploadWithCustomValues}
          className="w-full p-2 bg-green-500 text-white rounded-lg hover:bg-green-700 mt-4"
        >
          Upload File
        </button>

        {uploadStatus2 && (
          <p className={`mt-4 text-lg ${uploadSuccess2 ? 'text-green-500' : 'text-red-500'}`}>
            {uploadStatus2}
          </p>
        )}
      </div>
    </div>
  );
}

export default PredictUpdateModel;
