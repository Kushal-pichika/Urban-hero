import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/dashboard.css';

const ManagerDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [cleaners, setCleaners] = useState([
    { id: 1, name: "Cleaner 1" },
    { id: 2, name: "Cleaner 2" },
    { id: 3, name: "Cleaner 3" },
  ]);
  const navigate = useNavigate();

  // Load tasks from localStorage on mount
  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    setTasks(storedTasks);
  }, []);

  // Assign task to cleaner
  const assignTask = (taskId, cleanerId) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, assignedTo: cleanerId, status: 'Assigned' } : task
    );
    localStorage.setItem('tasks', JSON.stringify(updatedTasks)); // Save to localStorage
    setTasks(updatedTasks); // Update state
  };

  // Handle logout
  const logout = () => {
    localStorage.removeItem('userId');
    navigate('/login');
  };

  return (
    <div className="dashboard-content">
      <div className="dashboard-header">
        <h2>Manager Dashboard</h2>
        <button onClick={logout} className="logout-button">Logout</button>
      </div>

      <div className="dashboard-cards">
        <div className="card">
          <h3>Assigned Tasks</h3>
          <ul>
            {tasks.length === 0 ? (
              <p>No tasks to assign yet.</p>
            ) : (
              tasks.map((task) => (
                <li key={task.id}>
                  <img src={task.url} alt="Task" style={{ width: "200px", height: "200px" }} />
                  <p>Status: {task.status}</p>
                  <p>Location: {task.location ? `Lat: ${task.location.latitude}, Lon: ${task.location.longitude}` : "Location not available"}</p>
                  {task.status === "Pending" && (
                    <div>
                      <select onChange={(e) => assignTask(task.id, e.target.value)} defaultValue="">
                        <option value="" disabled>Select Cleaner</option>
                        {cleaners.map(cleaner => (
                          <option key={cleaner.id} value={cleaner.id}>{cleaner.name}</option>
                        ))}
                      </select>
                    </div>
                  )}
                  {task.assignedTo && task.status === "Assigned" && (
                    <p>Assigned to: {cleaners.find(c => c.id === task.assignedTo)?.name}</p>
                  )}
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
