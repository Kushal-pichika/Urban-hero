import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/dashboard.css';

const CleanerDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [userId, setUserId] = useState("cleaner1");  // Static cleaner ID
  const navigate = useNavigate();

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    setTasks(storedTasks);

    const assigned = storedTasks.filter(task => task.assignedTo === userId);
    setAssignedTasks(assigned);
  }, [userId]);

  const markAsComplete = (taskId) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId && task.status === "Assigned") {
        task.status = "Completed";
      }
      return task;
    });

    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    setTasks(updatedTasks);

    const updatedAssignedTasks = updatedTasks.filter(task => task.assignedTo === userId);
    setAssignedTasks(updatedAssignedTasks);
  };

  const logout = () => {
    localStorage.removeItem('cleanerId');
    navigate('/login');
  };

  return (
    <div className="dashboard-content">
      <div className="dashboard-header">
        <h2>Cleaner Dashboard</h2>
        <button onClick={logout} className="logout-button">Logout</button>
      </div>

      <div className="dashboard-cards">
        <div className="card">
          <h3>Assigned Tasks</h3>
          <ul>
            {assignedTasks.length === 0 ? (
              <p>No tasks assigned to you.</p>
            ) : (
              assignedTasks.map((task) => (
                <li key={task.id}>
                  <img src={task.url} alt="Task" style={{ width: "200px", height: "200px" }} />
                  <p>Status: {task.status}</p>
                  {task.status === "Assigned" && (
                    <button onClick={() => markAsComplete(task.id)}>Mark as Complete</button>
                  )}
                  {task.status === "Completed" && <p>Task Completed!</p>}
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CleanerDashboard;
