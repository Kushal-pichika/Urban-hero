import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ImagePreview from './ImagePreview';

function CaptureWaste() {
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState(null);
  const [previousUploads, setPreviousUploads] = useState([]);
  const navigate = useNavigate();
  const role = localStorage.getItem('role'); // Get role from localStorage
  const username = localStorage.getItem('username'); // Get username from localStorage

  useEffect(() => {
    if (role !== 'user') {
      navigate('/' + role);  // Redirect to the appropriate dashboard if not a user
    } else {
      // Load previous uploads from localStorage when the user visits this page
      const uploads = JSON.parse(localStorage.getItem('uploads')) || [];
      setPreviousUploads(uploads);
    }
  }, [role, navigate]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(URL.createObjectURL(file)); // Generate a URL for the uploaded image
  };

  const handleCaptureLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation(position.coords);
      });
    }
  };

  const handleSubmit = () => {
    if (!image) {
      alert("Please upload an image first.");
      return;
    }

    const uploadData = {
      image: image, // Save the image URL
      location: location, // Save location data
      timestamp: new Date().toISOString(),
      username: username, // Store the username for identifying the uploader
    };

    // Retrieve existing uploads from localStorage and append the new one
    const uploads = JSON.parse(localStorage.getItem('uploads')) || [];
    uploads.push(uploadData);
    localStorage.setItem('uploads', JSON.stringify(uploads)); // Save to localStorage

    // Update the state to show the latest upload immediately
    setPreviousUploads(uploads);

    alert('Waste submitted successfully!');
    navigate('/user'); // Redirect to user dashboard
  };

  if (role !== 'user') {
    return <p>You are not authorized to upload waste images. Please contact an administrator.</p>;
  }

  return (
    <div>
      <h2>Capture Waste Image</h2>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {image && <ImagePreview image={image} />}
      <button onClick={handleCaptureLocation}>Capture Location</button>
      {location && <p>Location: {location.latitude}, {location.longitude}</p>}
      <button onClick={handleSubmit}>Submit</button>

      <h3>Previous Uploads</h3>
      {previousUploads.length > 0 ? (
        <ul>
          {previousUploads.map((upload, index) => (
            <li key={index}>
              <img src={upload.image} alt="Waste" width="100" height="100" />
              <p>Location: {upload.location.latitude}, {upload.location.longitude}</p>
              <p>Uploaded by: {upload.username}</p>
              <p>Uploaded at: {new Date(upload.timestamp).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No previous uploads.</p>
      )}
    </div>
  );
}

export default CaptureWaste;
