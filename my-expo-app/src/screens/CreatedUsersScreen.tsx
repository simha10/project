import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import DashboardLayout from '../components/DashboardLayout';
import { Feather } from '@expo/vector-icons';

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
  const [isDarkMode, setIsDarkMode] = useState(false);

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
    <View className={`p-3 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-300'} ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <Text className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>
        {item.username}
      </Text>
      <Text className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        {item.role}
      </Text>
      <Text className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
        {new Date(item.createdAt).toLocaleString()}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView className={`flex-1 justify-center items-center ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className={`flex-1 justify-center items-center ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <Text className={`text-lg ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
          {error}
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <DashboardLayout userRole={userRole || ''}>
      <SafeAreaView className={`flex-1 p-4 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <Text className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-black'}`}>
          Users Created By You
        </Text>
        <FlatList
          data={users}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListEmptyComponent={
            <Text className={`text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              No users created yet.
            </Text>
          }
        />

        <TouchableOpacity
          onPress={() => setIsDarkMode(!isDarkMode)}
          className="flex-row items-center justify-center mt-4"
        >
          <Feather
            name={isDarkMode ? 'sun' : 'moon'}
            size={20}
            color={isDarkMode ? '#fff' : '#000'}
            className="mr-2"
          />
          <Text className={`text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </DashboardLayout>
  );
};

export default CreatedUsersScreen;