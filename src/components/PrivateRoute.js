import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const PrivateRoute = ({ element, role }) => {
  const userRole = localStorage.getItem('role');

  if (userRole !== role) {
    return <Navigate to="/login" />;
  }

  return element;
};

export default PrivateRoute;
