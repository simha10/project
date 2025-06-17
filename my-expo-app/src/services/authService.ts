import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Replace 'YOUR_BACKEND_IP' with your backend server IP or hostname
const API_URL = 'http://192.168.18.34:4000/api';

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
    role: 'SUPERADMIN' | 'ADMIN' | 'SUPERVISOR' | 'SURVEYOR';
  };
}

export const login = async (username: string, password: string, role: string): Promise<LoginResponse> => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      username,
      password,
      role,
    });

    const { token, user } = response.data;
    
    // Store token securely
    await AsyncStorage.setItem('auth_token', token);
    await AsyncStorage.setItem('user', JSON.stringify(user));

    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Login failed');
  }
};

export const logout = async () => {
  try {
    await AsyncStorage.removeItem('auth_token');
    await AsyncStorage.removeItem('user');
  } catch (error) {
    console.error('Error during logout:', error);
  }
};

export const getStoredToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem('auth_token');
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

export const getStoredUser = async () => {
  try {
    const userStr = await AsyncStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};
