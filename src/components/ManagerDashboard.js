import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/dashboard.css';

const ManagerDashboard = () => {
  const [uploadedImages, setUploadedImages] = useState([]);
  const [assignedTasks, setAssignedTasks] = useState([]); // Simulated tasks
  const [selectedTask, setSelectedTask] = useState('');
  const navigate = useNavigate();

  // Fetch uploaded images from localStorage
  const fetchUploadedImages = () => {
    const uploadedImages = JSON.parse(localStorage.getItem('uploadedImages')) || [];
    const updatedImages = uploadedImages.map((image, index) => ({
      ...image,
      id: index + 1,  // Ensure each image has a unique ID
    }));
    setUploadedImages(updatedImages);
  };

  // Fetch assigned tasks (simulated for now)
  const fetchAssignedTasks = () => {
    const tasks = JSON.parse(localStorage.getItem('assignedTasks')) || [];
    setAssignedTasks(tasks);
  };

  // Assign task to cleaner
  const assignTask = (imageId) => {
    if (!selectedTask) {
      alert('Please select a cleaner');
      return;
    }

    // Check if the task has already been assigned
    const task = assignedTasks.find((task) => task.imageId === imageId);

    if (task && task.cleanerId) {
      alert('This task has already been assigned.');
      return;
    }

    const taskData = { imageId, cleanerId: selectedTask, status: 'Assigned' };

    // Add new task to assignedTasks
    const updatedTasks = [...assignedTasks, taskData];
    localStorage.setItem('assignedTasks', JSON.stringify(updatedTasks)); // Store updated tasks

    // Update task status in state
    setAssignedTasks(updatedTasks);
    alert('Task assigned successfully');
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('role'); // Clear the role from localStorage
    navigate('/login'); // Redirect to login page
  };

  useEffect(() => {
    fetchUploadedImages();
    fetchAssignedTasks();
  }, []);

  return (
    <div className="dashboard-content">
      <div className="dashboard-header">
        <h2>Manager Dashboard</h2>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>

      <div className="dashboard-cards">
        {/* Uploaded Images from Users */}
        <div className="card">
          <h3>Uploaded Waste Images</h3>
          <ul>
            {uploadedImages.length > 0 ? (
              uploadedImages.map((image) => {
                // Check if the image task is already assigned
                const assignedTask = assignedTasks.find((task) => task.imageId === image.id);
                const isAssigned = assignedTask && assignedTask.cleanerId;

                return (
                  <li key={image.id}>
                    <img src={image.url} alt={`Uploaded ${image.id}`} />
                    <p>Status: {isAssigned ? `Assigned to Cleaner ${assignedTask.cleanerId}` : 'Pending'}</p>
                    <button
                      onClick={() => assignTask(image.id)}
                      disabled={isAssigned} // Disable button if the task is assigned
                    >
                      {isAssigned ? 'Task Assigned' : 'Assign Task'}
                    </button>
                  </li>
                );
              })
            ) : (
              <p>No images uploaded by users yet.</p>
            )}
          </ul>
        </div>

        {/* Assign Task */}
        <div className="card">
          <h3>Assign Task</h3>
          <select onChange={(e) => setSelectedTask(e.target.value)} value={selectedTask}>
            <option value="">Select Cleaner</option>
            <option value="1">Cleaner 1</option>
            <option value="2">Cleaner 2</option>
            {/* Add more cleaners as needed */}
          </select>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
