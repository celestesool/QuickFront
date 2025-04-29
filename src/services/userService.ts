// src/services/userService.ts
import axios from 'axios';

export const getUserData = async (uid: string) => {
  try {
    const response = await axios.get('/api/auth/user', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
};