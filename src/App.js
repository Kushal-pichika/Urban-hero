import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserDashboard from './components/UserDashboard';
import ManagerDashboard from './components/ManagerDashboard';
import CleanerDashboard from './components/CleanerDashboard';
import Login from './components/Login';
import PrivateRoute from './components/PrivateRoute'; // Import the PrivateRoute

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public route for login */}
        <Route path="/login" element={<Login />} />

        {/* Protected routes for each role */}
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
