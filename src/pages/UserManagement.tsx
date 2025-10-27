import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import Modal from '../components/ui/Modal';

interface Permission {
  resource: string;
  access: 'read' | 'write';
}

interface User {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
  role: 'admin' | 'moderator';
  permissions: Permission[];
}

interface FormData {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'moderator';
  permissions: Permission[];
  profileImage: string;
}

// Separate UserForm component to prevent re-renders
const UserForm = ({ 
  formData, 
  setFormData, 
  onSubmit, 
  onCancel, 
  editingUser, 
  uploading, 
  message, 
  error 
}: {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  editingUser: User | null;
  uploading: boolean;
  message: string;
  error: string;
}) => {
  const availablePermissions = [
    'students',
    'courses',
    'batches',
    'certifications',
    'employees',
    'vendors',
    'locations',
    'reports'
  ];

  const handlePermissionChange = (resource: string, access: 'read' | 'write') => {
    setFormData(prev => {
      const existingPermission = prev.permissions.find(p => p.resource === resource);
      
      if (existingPermission) {
        // If permission exists, toggle the access level
        if (existingPermission.access === access) {
          // Remove permission if clicking the same access level
          return {
            ...prev,
            permissions: prev.permissions.filter(p => p.resource !== resource)
          };
        } else {
          // Update access level
          return {
            ...prev,
            permissions: prev.permissions.map(p => 
              p.resource === resource ? { ...p, access } : p
            )
          };
        }
      } else {
        // Add new permission
        return {
          ...prev,
          permissions: [...prev.permissions, { resource, access }]
        };
      }
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formDataUpload = new FormData();
    formDataUpload.append('image', file);

    try {
      const response = await api.post('/upload/image', formDataUpload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setFormData(prev => ({ ...prev, profileImage: response.data.url }));
    } catch (err) {
      console.error('Upload error:', err);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {editingUser ? 'New Password (leave blank to keep current)' : 'Password'}
          </label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Profile Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={uploading}
          />
          {uploading && <p className="text-sm text-gray-500 mt-1">Uploading...</p>}
          {formData.profileImage && (
            <div className="mt-2">
              <img 
                src={formData.profileImage} 
                alt="Profile preview" 
                className="w-16 h-16 rounded-full object-cover"
              />
            </div>
          )}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Role
        </label>
        <select
          value={formData.role}
          onChange={(e) => setFormData(prev => ({ 
            ...prev, 
            role: e.target.value as 'admin' | 'moderator',
            permissions: e.target.value === 'admin' ? [] : prev.permissions
          }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="moderator">Moderator</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {formData.role === 'moderator' && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Permissions
          </label>
          <div className="space-y-3">
            {availablePermissions.map(resource => {
              const permission = formData.permissions.find(p => p.resource === resource);
              return (
                <div key={resource} className="border rounded-lg p-3">
                  <div className="text-sm font-medium text-gray-900 mb-2 capitalize">
                    {resource}
                  </div>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={permission?.access === 'read'}
                        onChange={() => handlePermissionChange(resource, 'read')}
                        className="mr-2"
                      />
                      <span className="text-sm">Read</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={permission?.access === 'write'}
                        onChange={() => handlePermissionChange(resource, 'write')}
                        className="mr-2"
                      />
                      <span className="text-sm">Write</span>
                    </label>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {message && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {editingUser ? 'Update User' : 'Create User'}
        </button>
      </div>
    </form>
  );
};

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    role: 'moderator',
    permissions: [],
    profileImage: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error('AuthContext must be used within an AuthProvider');
  }

  const { user } = authContext;

  // Only admins should access this page
  if (user?.role !== 'admin') {
    return <div className="p-6">Access denied. Admin privileges required.</div>;
  }

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const response = await api.get('/auth/users');
      console.log('Fetched users:', response.data);
      setUsers(response.data);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openModal = (user?: User) => {
    console.log('Opening modal with user:', user);
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        password: '',
        role: user.role,
        permissions: user.permissions || [],
        profileImage: user.profileImage || ''
      });
    } else {
      setEditingUser(null);
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'moderator',
        permissions: [],
        profileImage: ''
      });
    }
    setIsModalOpen(true);
    setMessage('');
    setError('');
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'moderator',
      permissions: [],
      profileImage: ''
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      if (editingUser) {
        // Update user
        const updateData = { ...formData };
        if (!updateData.password) {
          const { password, ...dataWithoutPassword } = updateData;
          await api.put(`/auth/users/${editingUser.id}`, dataWithoutPassword);
        } else {
          await api.put(`/auth/users/${editingUser.id}`, updateData);
        }
        setMessage('User updated successfully!');
      } else {
        // Create user
        await api.post('/auth/register', formData);
        setMessage('User created successfully!');
      }
      
      fetchUsers(); // Refresh the list
      closeModal();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save user');
    }
  };

  const handleDelete = async (userId: string, userName: string) => {
    console.log('Deleting user:', { userId, userName });
    if (!confirm(`Are you sure you want to delete ${userName}?`)) return;

    try {
      await api.delete(`/auth/users/${userId}`);
      setMessage('User deleted successfully!');
      fetchUsers(); // Refresh the list
    } catch (err: any) {
      console.error('Delete error:', err);
      setError(err.response?.data?.message || 'Failed to delete user');
    }
  };

  if (loading) {
    return <div className="p-6">Loading users...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <button
          onClick={() => openModal()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add User
        </button>
      </div>

      {message && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Permissions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => {
                console.log('Rendering user row:', user);
                return (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                        {user.profileImage ? (
                          <img 
                            src={user.profileImage} 
                            alt={user.name} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-sm font-medium text-blue-600">
                            {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.role === 'admin' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {user.role === 'admin' ? 'All permissions' : (
                        user.permissions?.length > 0 
                          ? user.permissions.map(p => `${p.resource}(${p.access})`).join(', ')
                          : 'No permissions'
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openModal(user)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </button>
                      {user.id !== authContext.user?.id && (
                        <button
                          onClick={() => handleDelete(user.id, user.name)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingUser ? 'Edit User' : 'Add New User'}
      >
        <UserForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          onCancel={closeModal}
          editingUser={editingUser}
          uploading={uploading}
          message={message}
          error={error}
        />
      </Modal>
    </div>
  );
};

export default UserManagement; 