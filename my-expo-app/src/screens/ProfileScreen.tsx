import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const BACKEND_URL = 'http://192.168.18.34:4000';

interface UserProfile {
  username: string;
  role: string;
  phoneNumber: string;
}

const ProfileScreen = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await SecureStore.getItemAsync('token');
        if (!token) {
          Alert.alert('Error', 'User not authenticated');
          setLoading(false);
          return;
        }

        const response = await axios.get(`${BACKEND_URL}/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setProfile(response.data.data);
        } else {
          Alert.alert('Error', 'Failed to fetch profile');
        }
      } catch (error) {
        Alert.alert('Error', 'An error occurred while fetching profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <SafeAreaView className={`flex-1 justify-center items-center ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </SafeAreaView>
    );
  }

  if (!profile) {
    return (
      <SafeAreaView className={`flex-1 justify-center items-center ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <Text className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          No profile data available.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <View className="flex-1 justify-center items-center p-5">
        <Feather name="user" size={60} color={isDarkMode ? '#3b82f6' : '#3b82f6'} className="mb-4" />
        <Text className={`text-4xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-black'}`}>
          {profile.username}
        </Text>
        <Text className={`text-xl mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {profile.role}
        </Text>
        <Text className={`text-lg ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
          {profile.phoneNumber || 'No phone number'}
        </Text>

        <TouchableOpacity
          onPress={() => setIsDarkMode(!isDarkMode)}
          className="flex-row items-center justify-center mt-6"
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
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;