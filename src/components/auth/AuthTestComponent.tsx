import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';

const AuthTestComponent: React.FC = () => {
  const { user, isAuthenticated, login, logout } = useAuth();
  const { showSuccess, showError, showInfo, showWarning } = useNotifications();

  const testLogin = async () => {
    try {
      await login('test@example.com', 'password');
    } catch (error) {
      showError('Login failed', 'Please check your credentials');
    }
  };

  const testNotifications = () => {
    showSuccess('Success!', 'This is a success message');
    setTimeout(() => showError('Error!', 'This is an error message'), 1000);
    setTimeout(() => showWarning('Warning!', 'This is a warning message'), 2000);
    setTimeout(() => showInfo('Info!', 'This is an info message'), 3000);
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg m-4">
      <h3 className="text-lg font-bold mb-4">Authentication Test Panel</h3>
      
      <div className="space-y-2">
        <p>Status: {isAuthenticated ? 'Authenticated' : 'Not authenticated'}</p>
        {user && <p>User: {user.firstName} {user.lastName} ({user.email})</p>}
        
        <div className="space-x-2">
          <button
            onClick={testLogin}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Test Login
          </button>
          
          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
          
          <button
            onClick={testNotifications}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Test Notifications
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthTestComponent;
