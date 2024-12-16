import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const PublicRoute = ({ children }) => {
  const { token } = useSelector((state) => state.auth);
  const location = useLocation();

  if (token) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }
  
  return children;
};

export default PublicRoute;
