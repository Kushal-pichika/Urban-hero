import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/dashboard.css';

const ManagerDashboard = () => {
  const [uploadedImages, setUploadedImages] = useState([]);
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState('');
  const navigate = useNavigate();

  const fetchUploadedImages = () => {
    const uploadedImages = JSON.parse(localStorage.getItem('uploadedImages')) || [];
    setUploadedImages(uploadedImages);
  };

  const fetchAssignedTasks = () => {
    const tasks = JSON.parse(localStorage.getItem('assignedTasks')) || [];
    setAssignedTasks(tasks);
  };

  const assignTask = (imageId) => {
    if (!selectedTask) {
      alert('Please select a cleaner');
      return;
    }

    const task = assignedTasks.find((task) => task.imageId === imageId);

    if (task && task.cleanerId) {
      alert('This task has already been assigned.');
      return;
    }

    const taskData = { imageId, cleanerId: selectedTask, status: 'Assigned' };
    const updatedTasks = [...assignedTasks, taskData];
    localStorage.setItem('assignedTasks', JSON.stringify(updatedTasks));
    setAssignedTasks(updatedTasks);
    alert('Task assigned successfully');
  };

  const handleLogout = () => {
    localStorage.removeItem('role');
    navigate('/login');
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
        <div className="card">
          <h3>Uploaded Waste Images</h3>
          <ul>
            {uploadedImages.length > 0 ? (
              uploadedImages.map((image, index) => {
                const assignedTask = assignedTasks.find((task) => task.imageId === index + 1);
                const isAssigned = assignedTask && assignedTask.cleanerId;

                return (
                  <li key={index}>
                    <img src={image.url} alt={`Uploaded ${index + 1}`} />
                    <p>Status: {isAssigned ? 'Assigned' : 'Pending'}</p>
                    <button
                      onClick={() => assignTask(index + 1)}
                      disabled={isAssigned}
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

        <div className="card">
          <h3>Assign Task</h3>
          <select onChange={(e) => setSelectedTask(e.target.value)} value={selectedTask}>
            <option value="">Select Cleaner</option>
            <option value="1">Cleaner 1</option>
            <option value="2">Cleaner 2</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
