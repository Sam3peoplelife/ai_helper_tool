import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ThreeDots } from 'react-loader-spinner'; // Import ThreeDots directly

function Account() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(null);
  const [trainingFiles, setTrainingFiles] = useState([]);
  const [selectedTrainingFile, setSelectedTrainingFile] = useState('');
  const [loading, setLoading] = useState(false);
  const [trainingMessage, setTrainingMessage] = useState('');
  const username = localStorage.getItem('username');

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      setUploadSuccess(false);
      setUploadStatus('Please select a file to upload.');
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
      setUploadSuccess(true);
      setUploadStatus('File uploaded successfully');
      console.log('Upload response:', response.data);
      fetchTrainingFiles(); // Fetch the training files after a successful upload
    } catch (error) {
      setUploadSuccess(false);
      setUploadStatus('File upload failed');
      console.error('Upload error:', error);
    }
  };

  const fetchTrainingFiles = async () => {
    try {
      const response = await axios.post('http://localhost:3001/listUserFiles', {
        username,
        type: 'training_data',
      });
      // Extract filenames from the full paths
      const fileNames = response.data.fileNames.map(filePath => filePath.split('/').pop());
      setTrainingFiles(fileNames);
    } catch (error) {
      console.error('Error fetching training files:', error);
    }
  };

  const handleTrainModel = async () => {
    if (!selectedTrainingFile) {
      setTrainingMessage('Please select a training file.');
      return;
    }

    setLoading(true);
    setTrainingMessage('Training model, please wait...');

    try {
      const response = await axios.post('http://localhost:3001/train', {
        username,
        fileName: selectedTrainingFile,
      });
      console.log('Train response:', response.data);
      setTrainingMessage('Model training started successfully.');
    } catch (error) {
      console.error('Error starting model training:', error);
      setTrainingMessage('Failed to start model training.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainingFiles();
  }, []);

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
        {uploadStatus && (
          <p className={`mt-4 text-lg ${uploadSuccess ? 'text-green-500' : 'text-red-500'}`}>
            {uploadStatus}
          </p>
        )}
        <div className="mt-6">
          <h2 className="text-2xl mb-4">Select Training Data</h2>
          <select
            value={selectedTrainingFile}
            onChange={(e) => setSelectedTrainingFile(e.target.value)}
            className="mb-4 p-2 border rounded-lg w-full"
          >
            <option value="">Select a file</option>
            {trainingFiles.map((fileName, index) => (
              <option key={index} value={fileName}>
                {fileName}
              </option>
            ))}
          </select>
          <button
            onClick={handleTrainModel}
            className="w-full p-2 bg-green-500 text-white rounded-lg hover:bg-green-700"
          >
            Train Model
          </button>
          {loading && (
            <div className="flex flex-col items-center mt-4">
              <ThreeDots type="ThreeDots" color="#00BFFF" height={80} width={80} />
              <p className="text-blue-500">{trainingMessage}</p>
            </div>
          )}
          {!loading && trainingMessage && (
            <p className="mt-4 text-lg text-blue-500">{trainingMessage}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Account;
