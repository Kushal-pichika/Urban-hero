import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebaseConfig';  // Firebase Firestore import
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore'; // Firestore methods
import { signOut } from 'firebase/auth'; // Firebase signOut
import { auth } from '../firebaseConfig'; // Firebase auth import
import '../assets/styles/dashboard.css';

const ManagerDashboard = () => {
  const [tasks, setTasks] = useState([]);  // State to hold tasks
  const [cleaners, setCleaners] = useState([]); // State to hold registered cleaners
  const navigate = useNavigate();

  // Load tasks from Firestore on mount
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const tasksCollection = collection(db, 'tasks');
        const taskSnapshot = await getDocs(tasksCollection);
        const taskList = taskSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setTasks(taskList);  // Update state with tasks
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  // Load registered cleaners from Firestore
  useEffect(() => {
    const fetchCleaners = async () => {
      try {
        const cleanersCollection = collection(db, 'cleaners');  // Assuming cleaners are stored in a 'cleaners' collection
        const cleanerSnapshot = await getDocs(cleanersCollection);
        const cleanerList = cleanerSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setCleaners(cleanerList);  // Update state with cleaners
      } catch (error) {
        console.error("Error fetching cleaners:", error);
      }
    };

    fetchCleaners();
  }, []);

  // Assign task to cleaner
  const assignTask = async (taskId, cleanerId) => {
    const taskDocRef = doc(db, 'tasks', taskId);
    try {
      // Update task status and assigned cleaner
      await updateDoc(taskDocRef, {
        assignedTo: cleanerId,
        status: 'Assigned',
      });
      const updatedTasks = tasks.map(task =>
        task.id === taskId ? { ...task, assignedTo: cleanerId, status: 'Assigned' } : task
      );
      setTasks(updatedTasks); // Update state with the new task data
    } catch (error) {
      console.error("Error assigning task:", error);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth);  // Sign out the user from Firebase
      localStorage.clear();  // Clear any saved data (like role, user info)
      navigate('/login');  // Redirect to login page after logout
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="dashboard-content">
      <div className="dashboard-header">
        <h2>Manager Dashboard</h2>
        <button onClick={handleLogout} className="logout-button">Logout</button>
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
                  {task.status === "Complete" && task.completionImage && (
                    <div>
                      <h4>Completed Task</h4>
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

export default ManagerDashboard;
