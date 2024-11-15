import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MapDirections from './MapDirections'; // Import the new map component
import '../assets/styles/dashboard.css';

const CleanerDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [selectedTaskLocation, setSelectedTaskLocation] = useState(null); // State to hold selected task's location
  const navigate = useNavigate();

  // Google Maps API Key
  const googleMapsApiKey = 'AIzaSyB0mR_rM39f-PAZB_G6NcCimkapK9Iya70'

  // Load tasks from localStorage on mount
  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    setTasks(storedTasks);
  }, []);

  // Handle logout
  const logout = () => {
    localStorage.removeItem('userId');
    navigate('/login');
  };

  // Get current location of the cleaner
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setCurrentLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      });
    }
  }, []);

  // Handle Get Directions button click
  const handleGetDirections = (taskLocation) => {
    setSelectedTaskLocation(taskLocation);
  };

  // Handle Mark as Completed button click
  const handleMarkAsCompleted = (taskId) => {
    // Update the task status to 'Completed'
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        return { ...task, status: 'Completed' };
      }
      return task;
    });

    // Update state and save to localStorage
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks)); // Persist the updated tasks list
  };

  return (
    <div className="dashboard-content">
      <div className="dashboard-header">
        <h2>Cleaner Dashboard</h2>
        <button onClick={logout} className="logout-button">Logout</button>
      </div>

      <div className="dashboard-cards">
        <div className="card">
          <h3>Your Assigned Tasks</h3>
          <ul>
            {tasks.length === 0 ? (
              <p>No tasks assigned yet.</p>
            ) : (
              tasks.filter(task => task.status === "Assigned").map((task) => (
                task.assignedTo && (
                  <li key={task.id}>
                    <img src={task.url} alt="Task" style={{ width: "200px", height: "200px" }} />
                    <p>Status: {task.status}</p>
                    <p>Location: {task.location ? `Lat: ${task.location.latitude}, Lon: ${task.location.longitude}` : "Location not available"}</p>
                    <button onClick={() => handleMarkAsCompleted(task.id)}>Mark as Completed</button> {/* Mark as Completed button */}
                    <button onClick={() => handleGetDirections(task.location)}>Get Directions</button> {/* Get Directions button */}
                  </li>
                )
              ))
            )}
          </ul>
        </div>

        <div className="card">
          <h3>Completed Tasks</h3>
          <ul>
            {tasks.filter(task => task.status === "Completed").map((task) => (
              task.assignedTo && (
                <li key={task.id}>
                  <img src={task.url} alt="Task" style={{ width: "200px", height: "200px" }} />
                  <p>Status: {task.status}</p>
                  <p>Location: {task.location ? `Lat: ${task.location.latitude}, Lon: ${task.location.longitude}` : "Location not available"}</p>
                </li>
              )
            ))}
          </ul>
        </div>

        {/* Render MapDirections component only when a task is selected */}
        {selectedTaskLocation && currentLocation && (
          <MapDirections 
            currentLocation={currentLocation}
            taskLocation={selectedTaskLocation} // Use the selected task's location here
            googleMapsApiKey={googleMapsApiKey}
          />
        )}
      </div>
    </div>
  );
};

export default CleanerDashboard;
