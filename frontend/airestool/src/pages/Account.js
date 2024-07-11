import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Account() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const username = localStorage.getItem('username');

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('username', username);
    formData.append('type', 'training_data');

    try {
      const response = await axios.post('http://localhost:3001/uploadFile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setUploadStatus('File uploaded successfully');
      console.log('Upload response:', response.data);
    } catch (error) {
      setUploadStatus('File upload failed');
      console.error('Upload error:', error);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl mb-4">Upload Training Data</h2>
        <input
          type="file"
          onChange={handleFileChange}
          className="mb-4 p-2 border rounded-lg"
        />
        <button
          onClick={handleFileUpload}
          className="w-full p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
        >
          Upload File
        </button>
        {uploadStatus && <p className="mt-4 text-lg">{uploadStatus}</p>}
      </div>
    </div>
  );
}

export default Account;
