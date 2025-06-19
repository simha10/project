import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const BACKEND_URL = 'http://192.168.18.34:4000';

interface UserProfile {
  username: string;
  role: string;
  phoneNumber: string;
}

const ProfileScreen = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

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
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  if (!profile) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text>No profile data available.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 justify-center items-center bg-white p-5">
      <Text className="text-4xl font-bold mb-3">{profile.username}</Text>
      <Text className="text-xl text-gray-600 mb-2">{profile.role}</Text>
      <Text className="text-lg text-gray-500">{profile.phoneNumber || 'No phone number'}</Text>
    </View>
  );
};

export default ProfileScreen;
