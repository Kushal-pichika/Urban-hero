import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/dashboard.css';

const UserDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [location, setLocation] = useState(null);
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  // Load tasks from localStorage on mount
  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    setTasks(storedTasks);
  }, []);

  // Get geolocation when user uploads an image
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          alert("Unable to retrieve your location.");
        }
      );
    }
  };

  // Handle image upload for new tasks
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
        getLocation();
      };
      reader.readAsDataURL(file);
    }
  };

  // Function to upload image (add task)
  const uploadImage = () => {
    if (!selectedImage || !location) {
      alert("Please upload an image and allow location access.");
      return;
    }

    const newTask = {
      id: Date.now(),
      url: selectedImage,
      status: "Pending",  // Initial status as Pending
      assignedTo: null,
      location: location,
      completionImage: null,  // No image uploaded by cleaner initially
    };

    const updatedTasks = [...tasks, newTask];
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    setTasks(updatedTasks);
    setSelectedImage(null);
    setLocation(null);
  };

  // Handle logout
  const logout = () => {
    localStorage.removeItem('userId');
    navigate('/login');
  };

  return (
    <div className="dashboard-content">
      <div className="dashboard-header">
        <h2>User (Citizen) Dashboard</h2>
        <button onClick={logout} className="logout-button">Logout</button>
      </div>

      <div className="dashboard-cards">
        <div className="card">
          <h3>Upload Waste Image</h3>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
          />
          {selectedImage && (
            <div className="image-preview">
              <img src={selectedImage} alt="Preview" style={{ width: "200px", height: "200px" }} />
            </div>
          )}
          <button onClick={uploadImage}>Upload Image</button>
        </div>

        <div className="card">
          <h3>Your Tasks</h3>
          <ul>
            {tasks.length === 0 ? (
              <p>No tasks assigned yet.</p>
            ) : (
              tasks.map((task) => (
                <li key={task.id}>
                  <img src={task.url} alt="Task" style={{ width: "200px", height: "200px" }} />
                  <p>Status: {task.status}</p>
                  <p>Location: {task.location ? `Lat: ${task.location.latitude}, Lon: ${task.location.longitude}` : "Location not available"}</p>
                  {/* Display cleaner’s completion image if status is "Complete" */}
                  {task.status === "Complete" && task.completionImage && (
                    <div>
                      <h4>Task Completed!</h4>
                      <img src={task.completionImage} alt="Completed Task" style={{ width: "200px", height: "200px" }} />
                    </div>
                  )}
                  <hr/>
                  <br/>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
