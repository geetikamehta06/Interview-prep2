import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

// Set axios default base URL and withCredentials
axios.defaults.baseURL = 'http://localhost:5000';
axios.defaults.withCredentials = true;

// Create auth context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already logged in (on page load)
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          try {
            const res = await axios.get('/api/users/profile');
            if (res.data.success) {
              setUser(res.data.user);
            } else {
              handleLogout();
            }
          } catch (err) {
            handleLogout();
          }
        }
      } catch (err) {
        console.error('Auth check error:', err);
        handleLogout();
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  // Register new user
  const register = async (userData) => {
    try {
      setLoading(true);
      const res = await axios.post('/api/users/register', userData);
      
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
        setUser(res.data.user);
        toast.success('Registration successful!');
        return true;
      }
      return false;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registration failed';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (userData) => {
    try {
      setLoading(true);
      const res = await axios.post('/api/users/login', userData);
      
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
        setUser(res.data.user);
        toast.success('Login successful!');
        return true;
      }
      return false;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = () => {
    handleLogout();
    toast.info('You have been logged out');
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      const res = await axios.put('/api/users/profile', userData);
      
      if (res.data.success) {
        setUser(res.data.user);
        toast.success('Profile updated successfully!');
        return true;
      }
      return false;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Profile update failed';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Upload profile picture
  const uploadProfilePicture = async (file) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('profilePicture', file);
      
      const res = await axios.post('/api/users/upload-profile-picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (res.data.success) {
        // Update user with new profile picture path
        setUser({
          ...user,
          profilePicture: res.data.filePath,
        });
        
        toast.success('Profile picture updated successfully!');
        return res.data.filePath;
      } else {
        setError(res.data.message);
        toast.error(res.data.message);
        return null;
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Profile picture upload failed';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Upload resume
  const uploadResume = async (file) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('resume', file);
      
      const res = await axios.post('/api/users/upload-resume', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (res.data.success) {
        // Update user with new resume path
        setUser({
          ...user,
          resume: res.data.filePath,
        });
        
        toast.success('Resume uploaded successfully!');
        return res.data.filePath;
      } else {
        setError(res.data.message);
        toast.error(res.data.message);
        return null;
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Resume upload failed';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        register,
        login,
        logout,
        updateProfile,
        uploadProfilePicture,
        uploadResume,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 