import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/dashboard.css';

const UserDashboard = () => {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadedImages, setUploadedImages] = useState([]);
  const navigate = useNavigate();

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleUpload = () => {
    if (!image) {
      alert("Please select an image to upload");
      return;
    }

    const newImage = {
      url: imagePreview,
      status: 'Pending',
    };

    const uploadedImages = JSON.parse(localStorage.getItem('uploadedImages')) || [];
    uploadedImages.push(newImage);
    localStorage.setItem('uploadedImages', JSON.stringify(uploadedImages));

    setUploadedImages(uploadedImages);
    setImage(null);
    setImagePreview(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('role');
    navigate('/login');
  };

  useEffect(() => {
    const uploadedImages = JSON.parse(localStorage.getItem('uploadedImages')) || [];
    setUploadedImages(uploadedImages);
  }, []);

  return (
    <div className="dashboard-content">
      <div className="dashboard-header">
        <h2>User Dashboard</h2>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>

      <div className="dashboard-cards">
        <div className="card">
          <h3>Report Waste</h3>
          <input type="file" onChange={handleImageChange} />
          {imagePreview && <img src={imagePreview} alt="Preview" />}
          <button onClick={handleUpload}>Upload Image</button>
        </div>

        <div className="card">
          <h3>Your Uploaded Tasks</h3>
          <ul>
            {uploadedImages.length > 0 ? (
              uploadedImages.map((uploadedImage, index) => (
                <li key={index}>
                  <img src={uploadedImage.url} alt={`Uploaded ${index + 1}`} />
                  <p>{uploadedImage.status}</p>
                </li>
              ))
            ) : (
              <p>No uploaded tasks yet.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
