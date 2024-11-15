import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleMap, LoadScript, Marker, DirectionsRenderer } from '@react-google-maps/api';
import '../assets/styles/dashboard.css';

const CleanerDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [directions, setDirections] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [googleMaps, setGoogleMaps] = useState(null);
  const navigate = useNavigate();

  // Google Maps API Key
  const googleMapsApiKey = 'YOUR_GOOGLE_MAPS_API_KEY';

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

  // Mark task as completed
  const markTaskCompleted = (taskId) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, status: 'Completed' } : task
    );
    localStorage.setItem('tasks', JSON.stringify(updatedTasks)); // Save to localStorage
    setTasks(updatedTasks); // Update state
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

  // Set the Google Maps instance when it loads
  const onLoad = (map) => {
    setGoogleMaps(map);
  };

  // Function to get directions to the task location
  const getDirections = (taskLocation) => {
    if (currentLocation && googleMaps) {
      const DirectionsService = new window.google.maps.DirectionsService();

      const request = {
        origin: new window.google.maps.LatLng(currentLocation.lat, currentLocation.lng),
        destination: new window.google.maps.LatLng(taskLocation.latitude, taskLocation.longitude),
        travelMode: window.google.maps.TravelMode.DRIVING
      };

      DirectionsService.route(request, (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirections(result);
        } else {
          console.error('Error fetching directions:', status);
        }
      });
    }
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
              tasks.map((task) => (
                task.status === "Assigned" && task.assignedTo && (
                  <li key={task.id}>
                    <img src={task.url} alt="Task" style={{ width: "200px", height: "200px" }} />
                    <p>Status: {task.status}</p>
                    <p>Location: {task.location ? `Lat: ${task.location.latitude}, Lon: ${task.location.longitude}` : "Location not available"}</p>
                    <button onClick={() => markTaskCompleted(task.id)}>Mark as Completed</button>
                    <button onClick={() => getDirections(task.location)}>Get Directions</button>
                  </li>
                )
              ))
            )}
          </ul>
        </div>

        {currentLocation && directions && (
          <div className="map-container">
            <LoadScript
              googleMapsApiKey={googleMapsApiKey}
              onLoad={onLoad}
            >
              <GoogleMap
                id="directions-map"
                mapContainerStyle={{ width: '100%', height: '400px' }}
                center={{ lat: currentLocation.lat, lng: currentLocation.lng }}
                zoom={14}
              >
                <Marker position={currentLocation} />
                <DirectionsRenderer directions={directions} />
              </GoogleMap>
            </LoadScript>
          </div>
        )}
      </div>
    </div>
  );
};

export default CleanerDashboard;
