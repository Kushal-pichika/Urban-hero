import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';  // For handling routing
import '../assets/styles/dashboard.css';

const UserDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null); // State for the selected image
  const navigate = useNavigate(); // For navigation
  const userId = localStorage.getItem('userId');  // Ensure you're getting the user ID from localStorage

  // Load tasks from localStorage on mount
  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    setTasks(storedTasks);
  }, []);

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result); // Store the uploaded image as a URL
      };
      reader.readAsDataURL(file); // Convert the image file to a data URL
    }
  };

  // Function to upload image (add task)
  const uploadImage = () => {
    if (!selectedImage) {
      alert("Please upload an image.");
      return;
    }

    const newTask = {
      id: Date.now(), // Unique ID for the task
      url: selectedImage, // The image URL
      status: "Pending", // Initial status as Pending
      assignedTo: null, // No worker assigned yet
    };

    const updatedTasks = [...tasks, newTask];
    localStorage.setItem('tasks', JSON.stringify(updatedTasks)); // Save to localStorage
    setTasks(updatedTasks); // Update state
    setSelectedImage(null); // Clear selected image
  };

  // Handle logout
  const logout = () => {
    localStorage.removeItem('userId');  // Remove user ID on logout
    navigate('/login');  // Redirect to the login page using navigate
  };

  return (
    <div className="dashboard-content">
      <div className="dashboard-header">
        <h2>User (Citizen) Dashboard</h2>
        <button onClick={logout} className="logout-button">Logout</button> {/* Logout Button */}
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
                  {/* Display task status but do not allow user to mark it as complete */}
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
