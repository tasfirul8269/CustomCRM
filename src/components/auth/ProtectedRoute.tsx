import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const authContext = useContext(AuthContext);
  const location = useLocation();

  if (!authContext) {
    throw new Error('AuthContext must be used within an AuthProvider');
  }

  const { isAuthenticated, loading, user } = authContext;

  // Debug logging
  console.log('ProtectedRoute - Path:', location.pathname);
  console.log('ProtectedRoute - User:', user);
  console.log('ProtectedRoute - User permissions:', user?.permissions);

  if (loading) {
    // You can replace this with a spinner or loading component
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check permissions for specific routes
  const pathToPermission: { [key: string]: string } = {
    '/students': 'students',
    '/courses': 'courses',
    '/batches': 'batches',
    '/certifications': 'certifications',
    '/employees': 'employees',
    '/vendors': 'vendors',
    '/locations': 'locations',
    '/reports': 'reports',
    '/user-management': 'admin' // Only admins can access user management
  };

  const requiredPermission = pathToPermission[location.pathname];
  console.log('ProtectedRoute - Required permission:', requiredPermission);
  
  if (requiredPermission) {
    if (requiredPermission === 'admin') {
      if (user?.role !== 'admin') {
        console.log('ProtectedRoute - Access denied: Not admin');
        return <Navigate to="/" replace />;
      }
    } else {
      if (user?.role === 'admin') {
        // Admin can access everything
        console.log('ProtectedRoute - Admin access granted');
        return children;
      } else if (user?.role === 'moderator') {
        // Check if moderator has the required permission
        const hasPermission = user?.permissions?.includes(requiredPermission);
        console.log('ProtectedRoute - Moderator permission check:', hasPermission);
        if (!hasPermission) {
          console.log('ProtectedRoute - Access denied: No permission');
          return <Navigate to="/" replace />;
        }
      }
    }
  }

  console.log('ProtectedRoute - Access granted');
  return children;
};

export default ProtectedRoute; 