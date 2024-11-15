import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebaseConfig'; // Firebase Firestore import
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore'; // Firestore methods
import MapDirections from './MapDirections'; // Import the new map component
import '../assets/styles/dashboard.css';

const CleanerDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [selectedTaskLocation, setSelectedTaskLocation] = useState(null); // State to hold selected task's location
  const [photo, setPhoto] = useState(null); // Store photo after cleaning
  const navigate = useNavigate();

  // Google Maps API Key
  const googleMapsApiKey = 'YOUR_GOOGLE_MAPS_API_KEY';

  // Load tasks from Firestore on mount
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const tasksCollection = collection(db, 'tasks');
        const taskSnapshot = await getDocs(tasksCollection);
        const taskList = taskSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setTasks(taskList);
      } catch (error) {
        console.error("Error fetching tasks from Firestore:", error);
      }
    };

    fetchTasks();
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
          lng: position.coords.longitude,
        });
      });
    }
  }, []);

  // Handle Get Directions button click
  const handleGetDirections = (taskLocation) => {
    setSelectedTaskLocation(taskLocation);
  };

  // Handle Mark as Completed button
  const handleCompleteTask = async (taskId) => {
    if (!photo) {
      alert('Please upload a photo as proof of completion.');
      return;
    }

    try {
      // Find the task in the current list of tasks
      const taskToUpdate = tasks.find(task => task.id === taskId);

      // Update the task in Firestore
      const taskDocRef = doc(db, 'tasks', taskId);
      await updateDoc(taskDocRef, {
        status: 'Complete',
        completionImage: photo,
      });

      // Update the task status and completion image in the state
      const updatedTasks = tasks.map(task =>
        task.id === taskId ? { ...task, status: 'Complete', completionImage: photo } : task
      );

      setTasks(updatedTasks);
      setPhoto(null); // Reset the photo input
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  // Separate tasks into assigned and completed
  const assignedTasks = tasks.filter(task => task.status === 'Assigned');
  const completedTasks = tasks.filter(task => task.status === 'Complete');

  return (
    <div className="dashboard-content">
      <div className="dashboard-header">
        <h2>Cleaner Dashboard</h2>
        <button onClick={logout} className="logout-button">Logout</button>
      </div>

      <div className="dashboard-cards">
        {/* Assigned Tasks Section */}
        <div className="card">
          <h3>Assigned Tasks</h3>
          <ul>
            {assignedTasks.length === 0 ? (
              <p>No tasks assigned to you yet.</p>
            ) : (
              assignedTasks.map((task) => (
                <li key={task.id}>
                  <img src={task.url} alt="Task" style={{ width: "200px", height: "200px" }} />
                  <p>Status: {task.status}</p>
                  <p>Location: {task.location ? `Lat: ${task.location.latitude}, Lon: ${task.location.longitude}` : "Location not available"}</p>
                  <div>
                    <button onClick={() => handleGetDirections(task.location)}>
                      Get Directions
                    </button>
                  </div>
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setPhoto(URL.createObjectURL(e.target.files[0]))}
                    />
                    {photo && <img src={photo} alt="Completion Photo" style={{ width: "200px", height: "200px" }} />}
                    <button onClick={() => handleCompleteTask(task.id)}>Mark as Complete</button>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>

        {/* Completed Tasks Section */}
        <div className="card">
          <h3>Completed Tasks</h3>
          <ul>
            {completedTasks.length === 0 ? (
              <p>No completed tasks yet.</p>
            ) : (
              completedTasks.map((task) => (
                <li key={task.id}>
                  <img src={task.url} alt="Task" style={{ width: "200px", height: "200px" }} />
                  <p>Status: {task.status}</p>
                  <p>Location: {task.location ? `Lat: ${task.location.latitude}, Lon: ${task.location.longitude}` : "Location not available"}</p>
                  {task.completionImage && (
                    <div>
                      <h4>Task Completed!</h4>
                      <img src={task.completionImage} alt="Completed Task" style={{ width: "200px", height: "200px" }} />
                    </div>
                  )}
                  <hr />
                  <br />
                </li>
              ))
            )}
          </ul>
        </div>
      </div>

      {/* MapDirections component */}
      {selectedTaskLocation && (
        <MapDirections
          currentLocation={currentLocation}
          destination={selectedTaskLocation}
          apiKey={googleMapsApiKey}
        />
      )}
    </div>
  );
};

export default CleanerDashboard;
