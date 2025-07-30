// src/services/authService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api'; // Your Spring Boot backend base URL

const authService = {
  // Function to register a new user
  register: async (username, password, role) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/register`, {
        username,
        password,
        role,
      });
      return response.data; // Return success message
    } catch (error) {
      if (error.response && error.response.data) {
        throw new Error(error.response.data); // Throw backend error message
      } else {
        throw new Error('Network error or unexpected issue during registration.');
      }
    }
  },

  // Function to log in a user using HTTP Basic Auth
  // We're hitting a protected endpoint; a 200 OK means authentication succeeded.
  login: async (username, password) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/protected/data`, { // Using a protected endpoint to test login
        auth: {
          username,
          password
        }
      });
      // Store credentials locally for subsequent authenticated requests (simplified for Basic Auth)
      localStorage.setItem('username', username);
      localStorage.setItem('password', password);
      
      return { success: true, message: "Login successful!", user: { username } };
    } catch (error) {
      if (error.response && error.response.status === 401) {
        throw new Error('Invalid username or password.');
      } else if (error.response && error.response.data) {
        throw new Error(error.response.data);
      } else {
        throw new Error('Network error or unexpected issue during login.');
      }
    }
  },

  // Logout function (clears local storage)
  logout: () => {
    localStorage.removeItem('username');
    localStorage.removeItem('password');
    // For Basic Auth, no server-side session invalidation is typically needed here.
    // For JWT, you'd clear the token.
  },

  // Get current authenticated user's stored username (for displaying or using in other requests)
  getCurrentUsername: () => {
    return localStorage.getItem('username');
  },

  // Get current authenticated user's stored password (for using in other requests)
  getCurrentPassword: () => {
    return localStorage.getItem('password');
  }
};

export default authService;