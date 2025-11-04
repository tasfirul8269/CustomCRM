import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const authContext = useContext(AuthContext);
  const location = useLocation();

  if (!authContext) {
    throw new Error('AuthContext must be used within an AuthProvider');
  }

  const { isAuthenticated, loading, user, hasPermission } = authContext;

  if (loading) {
    // You can replace this with a spinner or loading component
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check permissions for specific routes
  const pathToPermission: { [key: string]: string } = {
    '/': 'dashboard',
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

  // Redirect moderators to their first available section if they try to access dashboard
  if (location.pathname === '/' && user?.role === 'moderator') {
    const availableSections = Object.entries(pathToPermission)
      .filter(([path, permission]) => 
        path !== '/' && 
        path !== '/user-management' && 
        hasPermission(permission, 'read')
      )
      .map(([path]) => path);

    if (availableSections.length > 0) {
      return <Navigate to={availableSections[0]} replace />;
    }
  }

  const requiredPermission = pathToPermission[location.pathname];
  
  if (requiredPermission) {
    if (requiredPermission === 'admin') {
      if (user?.role !== 'admin') {
        return <Navigate to="/" replace />;
      }
    } else {
      if (user?.role === 'admin') {
        // Admin can access everything
        return children;
      } else if (user?.role === 'moderator') {
        // Check if moderator has the required permission (at least read access)
        const hasRequiredPermission = hasPermission(requiredPermission, 'read');
        if (!hasRequiredPermission) {
          return <Navigate to="/" replace />;
        }
      }
    }
  }

  return children;
};

export default ProtectedRoute; 