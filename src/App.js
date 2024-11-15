import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import UserDashboard from './components/UserDashboard';
import ManagerDashboard from './components/ManagerDashboard';
import CleanerDashboard from './components/CleanerDashboard';
import PrivateRoute from './components/PrivateRoute';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} />
        
        <Route
          path="/user-dashboard"
          element={<PrivateRoute role="user" element={<UserDashboard />} />}
        />
        
        <Route
          path="/manager-dashboard"
          element={<PrivateRoute role="manager" element={<ManagerDashboard />} />}
        />
        
        <Route
          path="/cleaner-dashboard"
          element={<PrivateRoute role="cleaner" element={<CleanerDashboard />} />}
        />
      </Routes>
    </Router>
  );
};

export default App;