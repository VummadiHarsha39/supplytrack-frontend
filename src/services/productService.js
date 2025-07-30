// src/services/productService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/products'; // Base URL for product APIs

const productService = {
  // Function to get all products for the current authenticated user
  getAllProducts: async (username, password) => {
    try {
      const response = await axios.get(API_BASE_URL, {
        auth: {
          username,
          password
        }
      });
      return response.data; // Array of products
    } catch (error) {
      if (error.response && error.response.status === 401) {
        throw new Error('Invalid credentials');
      } else if (error.response && error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error('Network error or unexpected issue fetching products.');
      }
    }
  },

  // Function to create a new product (ownerUserId is assigned by backend from auth principal)
  createProduct: async (name, origin, initialLocation, username, password) => {
    try {
      const response = await axios.post(API_BASE_URL, {
        name,
        origin,
        initialLocation,
      }, {
        auth: {
          username,
          password
        }
      });
      return response.data; // The created product object
    } catch (error) {
      if (error.response && error.response.status === 401) {
        throw new Error('Invalid credentials');
      } else if (error.response && error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error('Network error or unexpected issue creating product.');
      }
    }
  },

  // Function to log an event for a product
  logEvent: async (productId, eventType, eventDescription, location, actorUserId, username, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/${productId}/log-event`, {
        eventType,
        eventDescription,
        location,
        actorUserId // Pass actorUserId in body, although backend also gets it from auth principal
      }, {
        auth: {
          username,
          password
        }
      });
      return response.data; // The created event object
    } catch (error) {
      if (error.response && error.response.status === 401) {
        throw new Error('Invalid credentials');
      } else if (error.response && error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error('Network error or unexpected issue logging event.');
      }
    }
  },

  // Function to handover a product
  handoverProduct: async (productId, newOwnerUserId, handoverLocation, handoverDescription, username, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/${productId}/handover`, {
        newOwnerUserId,
        handoverLocation,
        handoverDescription,
      }, {
        auth: {
          username,
          password
        }
      });
      return response.data; // Success message
    } catch (error) {
      if (error.response && error.response.status === 401) {
        throw new Error('Invalid credentials');
      } else if (error.response && error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error('Network error or unexpected issue during handover.');
      }
    }
  },

  // Function to get product trace (history)
  getProductTrace: async (productId, username, password) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${productId}/trace`, {
        auth: {
          username,
          password
        }
      });
      return response.data; // Product trace object
    } catch (error) {
      if (error.response && error.response.status === 401) {
        throw new Error('Invalid credentials');
      } else if (error.response && error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error('Network error or unexpected issue fetching trace.');
      }
    }
  },

  // Function to get QR Code data (now returns just the ID as string from backend)
  getQrCodeData: async (productId, username, password) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${productId}/qrcode-data`, {
        auth: {
          username,
          password
        }
      });
      return response.data.qrCodeData; // This will now be just the ID string, e.g., "1"
    } catch (error) {
      if (error.response && error.response.status === 401) {
        throw new Error('Invalid credentials');
      } else if (error.response && error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error('Network error or unexpected issue fetching QR code data.');
      }
    }
  }
};

export default productService;