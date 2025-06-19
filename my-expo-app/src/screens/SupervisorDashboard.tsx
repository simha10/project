import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import DashboardLayout from '../components/DashboardLayout';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const BACKEND_URL = 'http://192.168.18.34:4000';

const SupervisorDashboard = () => {
  const navigation = useNavigation<NavigationProp>();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const token = await SecureStore.getItemAsync('token');
        if (!token) {
          Alert.alert('Error', 'User not authenticated');
          navigation.navigate('LoginScreen');
          return;
        }

        const response = await axios.get(`${BACKEND_URL}/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setUserRole(response.data.data.role);
        } else {
          Alert.alert('Error', 'Failed to fetch user role');
        }
      } catch (error) {
        Alert.alert('Error', 'An error occurred while fetching user role');
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
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
    <DashboardLayout userRole={userRole || ''}>
      <Text className="text-2xl font-bold mb-8 text-center">Supervisor Dashboard</Text>
      
      <TouchableOpacity
        className="bg-red-500 h-[50px] rounded-lg justify-center items-center mt-5"
        onPress={handleLogout}
      >
        <Text className="text-white text-base font-semibold">Logout</Text>
      </TouchableOpacity>
    </DashboardLayout>
  );
};

export default SupervisorDashboard;
