import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebaseConfig'; // Make sure to import Firestore
import { doc, setDoc, collection, addDoc } from 'firebase/firestore'; // Firestore methods

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(''); // Role selection (user, manager, cleaner)
  const [managerId, setManagerId] = useState(''); // Manager ID
  const [workerId, setWorkerId] = useState(''); // Worker ID
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // Hardcoded IDs for Manager and Cleaner
  const hardcodedManagerId = 'manager123';
  const hardcodedCleanerId = 'cleaner123';

  const handleRegister = async (event) => {
    event.preventDefault();
    setErrorMessage('');

    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('User registered:', userCredential.user);

      // Prepare user data for Firestore
      const userData = { email, role };

      // If Manager, check Manager ID
      if (role === 'manager' && managerId === hardcodedManagerId) {
        userData.managerId = managerId;
        // Save to Firestore under 'users' collection
        await setDoc(doc(db, 'users', userCredential.user.uid), userData);
        navigate('/manager-dashboard');
      } 
      // If Cleaner, check Cleaner ID
      else if (role === 'cleaner' && workerId === hardcodedCleanerId) {
        userData.workerId = workerId;
        // Save cleaner to 'cleaners' collection in Firestore
        await addDoc(collection(db, 'cleaners'), { ...userData, userId: userCredential.user.uid });
        // Save to Firestore under 'users' collection as well
        await setDoc(doc(db, 'users', userCredential.user.uid), userData);
        navigate('/worker-dashboard');
      }
      // If User, just save the role
      else if (role === 'user') {
        // Save to Firestore under 'users' collection
        await setDoc(doc(db, 'users', userCredential.user.uid), userData);
        navigate('/user-dashboard');
      } else {
        setErrorMessage('Invalid Manager ID or Worker ID');
      }
    } catch (error) {
      setErrorMessage('Error registering user. Please try again.');
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <div className="input-group">
          <label>Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div className="input-group">
          <label>Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        <div className="input-group">
          <label>Role</label>
          <select 
            value={role} 
            onChange={(e) => setRole(e.target.value)} 
            required
          >
            <option value="">-- Select Role --</option>
            <option value="user">User</option>
            <option value="manager">Manager</option>
            <option value="cleaner">Cleaner</option>
          </select>
        </div>

        {role === 'manager' && (
          <div className="input-group">
            <label>Manager ID</label>
            <input 
              type="text" 
              value={managerId} 
              onChange={(e) => setManagerId(e.target.value)} 
              required 
            />
          </div>
        )}

        {role === 'cleaner' && (
          <div className="input-group">
            <label>Cleaner ID</label>
            <input 
              type="text" 
              value={workerId} 
              onChange={(e) => setWorkerId(e.target.value)} 
              required 
            />
          </div>
        )}

        <button type="submit">Register</button>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </form>
    </div>
  );
};

export default Register;
