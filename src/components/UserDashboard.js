import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebaseConfig'; // Import Firebase auth and Firestore
import { collection, getDocs, onSnapshot, addDoc } from 'firebase/firestore'; // Firestore methods
import '../assets/styles/dashboard.css';

const UserDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [location, setLocation] = useState(null);
  const navigate = useNavigate();

  // Get the current user's email from Firebase Authentication
  const userEmail = auth.currentUser?.email;

  // Fetch tasks from Firestore when the component mounts and listen for changes
  useEffect(() => {
    if (!userEmail) return; // If user is not logged in, don't fetch tasks

    const unsubscribe = onSnapshot(collection(db, 'tasks'), (taskSnapshot) => {
      const taskList = taskSnapshot.docs
        .map(doc => ({ ...doc.data(), id: doc.id }))
        .filter(task => task.userId === userEmail); // Only fetch tasks for the logged-in user

      setTasks(taskList); // Update tasks state with data from Firestore
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, [userEmail]);

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
  const uploadImage = async () => {
    if (!selectedImage || !location || !userEmail) {
      alert("Please upload an image, allow location access, and make sure you are logged in.");
      return;
    }

    const newTask = {
      userId: userEmail, // Store user email as userId
      url: selectedImage,
      status: "Pending",  // Initial status as Pending
      assignedTo: null,
      location: location,
      completionImage: null,  // No image uploaded by cleaner initially
    };

    try {
      // Add task to Firestore
      const docRef = await addDoc(collection(db, 'tasks'), newTask);
      setTasks(prevTasks => [...prevTasks, { ...newTask, id: docRef.id }]);
      setSelectedImage(null);
      setLocation(null);
    } catch (error) {
      console.error("Error adding task: ", error);
    }
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
        {/* Image upload for new tasks */}
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

        {/* User's tasks section */}
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

                  {/* Show completion image when task is completed */}
                  {task.status === "Complete" && task.completionImage && (
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
    </div>
  );
};

export default UserDashboard;
