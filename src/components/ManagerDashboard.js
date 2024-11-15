import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/dashboard.css';

const ManagerDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [cleaners, setCleaners] = useState([]);
  const [selectedCleaner, setSelectedCleaner] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    setTasks(storedTasks);

    const storedCleaners = JSON.parse(localStorage.getItem('cleaners')) || [];
    if (storedCleaners.length === 0) {
      const defaultCleaners = [
        { id: "cleaner1", name: "Cleaner 1" },
        { id: "cleaner2", name: "Cleaner 2" },
        { id: "cleaner3", name: "Cleaner 3" }
      ];
      localStorage.setItem('cleaners', JSON.stringify(defaultCleaners));
      setCleaners(defaultCleaners);
    } else {
      setCleaners(storedCleaners);
    }
  }, []);

  const assignTask = (taskId) => {
    if (!selectedCleaner) {
      alert("Please select a cleaner to assign the task.");
      return;
    }

    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        task.status = "Assigned";
        task.assignedTo = selectedCleaner;
      }
      return task;
    });

    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    setTasks(updatedTasks);
  };

  const logout = () => {
    localStorage.removeItem('managerId');
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
          <h3>Task Assignments</h3>
          <ul>
            {tasks.length === 0 ? (
              <p>No tasks available.</p>
            ) : (
              tasks.map((task) => (
                <li key={task.id}>
                  <img src={task.url} alt="Task" style={{ width: "200px", height: "200px" }} />
                  <p>Status: {task.status}</p>
                  {task.status === "Pending" && (
                    <div>
                      <label>Select Cleaner:</label>
                      <select
                        onChange={(e) => setSelectedCleaner(e.target.value)}
                        value={selectedCleaner}
                      >
                        <option value="">--Select Cleaner--</option>
                        {cleaners.map((cleaner) => (
                          <option key={cleaner.id} value={cleaner.id}>
                            {cleaner.name}
                          </option>
                        ))}
                      </select>
                      <button onClick={() => assignTask(task.id)}>
                        Assign to Cleaner
                      </button>
                    </div>
                  )}
                  {task.status === "Assigned" && task.assignedTo && (
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
