import React, { useEffect, useState } from 'react';

import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { RootStackParamList } from '../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const BACKEND_URL = 'http://192.168.18.34:4000';

const AdminDashboard = () => {
  const navigation = useNavigation<NavigationProp>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await SecureStore.getItemAsync('token');
        if (!token) {
          Alert.alert('Error', 'User not authenticated');
          navigation.navigate('LoginScreen');
          return;
        }
      } catch (error) {
        Alert.alert('Error', 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('token');
    navigation.navigate('LoginScreen');
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <View className="flex-1 p-5 bg-white justify-center items-center">
      <Text className="text-2xl font-bold mb-8 text-center">Admin Dashboard</Text>
      
      <TouchableOpacity
        className="bg-blue-500 h-[50px] rounded-lg justify-center items-center mt-2.5"
        onPress={() => navigation.navigate('RegisterScreen')}
      >
        <Text className="text-white text-base font-semibold">Register New User</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="bg-red-500 h-[50px] rounded-lg justify-center items-center mt-5"
        onPress={handleLogout}
      >
        <Text className="text-white text-base font-semibold">Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AdminDashboard;
