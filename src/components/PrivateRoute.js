import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element, role }) => {
  const userRole = localStorage.getItem('role'); // Retrieve role from localStorage

  // If the user is not logged in or role doesn't match, redirect to login page
  if (!userRole || userRole !== role) {
    return <Navigate to="/login" />;
  }

  return element;
};

export default PrivateRoute;
