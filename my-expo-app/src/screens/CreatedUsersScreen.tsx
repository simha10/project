import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import DashboardLayout from '../components/DashboardLayout';

const BACKEND_URL = 'http://192.168.18.34:4000';

interface User {
  id: string;
  username: string;
  role: string;
  createdAt: string;
}

const CreatedUsersScreen = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserRoleAndUsers = async () => {
      try {
        const token = await SecureStore.getItemAsync('token');
        if (!token) {
          setError('User not authenticated');
          setLoading(false);
          return;
        }

        const roleResponse = await axios.get(`${BACKEND_URL}/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (roleResponse.data.success) {
          setUserRole(roleResponse.data.data.role);
        } else {
          setError('Failed to fetch user role');
          setLoading(false);
          return;
        }

        const response = await axios.get(`${BACKEND_URL}/users/created`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setUsers(response.data.data);
        } else {
          setError('Failed to fetch users');
        }
      } catch (err) {
        setError('Error fetching users');
      } finally {
        setLoading(false);
      }
    };

    fetchUserRoleAndUsers();
  }, []);

  const renderItem = ({ item }: { item: User }) => (
    <View className="p-3 border-b border-gray-300">
      <Text className="text-lg font-bold">{item.username}</Text>
      <Text className="text-sm text-gray-600">{item.role}</Text>
      <Text className="text-xs text-gray-500">{new Date(item.createdAt).toLocaleString()}</Text>
    </View>
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-red-600">{error}</Text>
      </View>
    );
  }

  return (
    <DashboardLayout userRole={userRole || ''}>
      <SafeAreaView className="flex-1 p-4 bg-white">
        <Text className="text-2xl font-bold mb-4">Users Created By You</Text>
        <FlatList
          data={users}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListEmptyComponent={<Text>No users created yet.</Text>}
        />
      </SafeAreaView>
    </DashboardLayout>
  );
};

export default CreatedUsersScreen;
