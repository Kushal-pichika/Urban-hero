import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig'; // Import Firebase auth instance
import '../assets/styles/login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(''); // Store the selected role
  const [managerId, setManagerId] = useState(''); // Store the entered manager ID
  const [workerId, setWorkerId] = useState(''); // Store the entered worker ID
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // Hardcoded IDs for Manager and Worker
  const hardcodedManagerId = 'manager123'; // Manager's hardcoded ID
  const hardcodedWorkerId = 'worker123'; // Worker's hardcoded ID

  const handleLogin = async (event) => {
    event.preventDefault();
    setErrorMessage(''); // Clear previous errors

    try {
      // Firebase login
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Logged in user:', userCredential.user);

      // Log the role and managerId to check if they match
      console.log('Role:', role);
      console.log('Manager ID:', managerId);

      // Navigate based on role and check hardcoded IDs
      if (role === 'citizen') {
        navigate('/user-dashboard');
      } else if (role === 'manager' && managerId === hardcodedManagerId) {
        // Check Manager ID
        console.log('Navigating to Manager Dashboard');
        navigate('/manager-dashboard');
      } else if (role === 'worker' && workerId === hardcodedWorkerId) {
        // Check Worker ID
        console.log('Navigating to Worker Dashboard');
        localStorage.setItem('workerId', workerId); // Store workerId in localStorage
        navigate('/worker-dashboard');
      } else {
        setErrorMessage('Invalid credentials or role ID. Please try again.');
      }
    } catch (error) {
      // Handle Firebase errors
      if (error.code === 'auth/invalid-email') {
        setErrorMessage('Invalid email format. Please check your email address.');
      } else if (error.code === 'auth/user-not-found') {
        setErrorMessage('User not found. Please check your email and password.');
      } else if (error.code === 'auth/wrong-password') {
        setErrorMessage('Incorrect password. Please try again.');
      } else {
        setErrorMessage('Error logging in. Please try again.');
      }
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
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
            <option value="citizen">Citizen</option>
            <option value="manager">Manager</option>
            <option value="worker">Worker</option>
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

        {role === 'worker' && (
          <div className="input-group">
            <label>Worker ID</label>
            <input 
              type="text" 
              value={workerId} 
              onChange={(e) => setWorkerId(e.target.value)} 
              required 
            />
          </div>
        )}

        <button type="submit">Login</button>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </form>
      <p>
        Don't have an account? <a href="/register">Register here</a>
      </p>
    </div>
  );
};

export default Login;
