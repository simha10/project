import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import DashboardLayout from '../components/DashboardLayout';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const BACKEND_URL = 'http://192.168.18.34:4000';

const SurveyorDashboard = () => {
  const navigation = useNavigation<NavigationProp>();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

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

  if (loading) {
    return (
      <SafeAreaView className={`flex-1 justify-center items-center ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </SafeAreaView>
    );
  }

  return (
    <DashboardLayout userRole={userRole || ''}>
      <SafeAreaView className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <View className="flex-1 p-5 justify-center items-center">
          <Text className={`text-2xl font-bold mb-8 text-center ${isDarkMode ? 'text-white' : 'text-black'}`}>
            Surveyor Dashboard
          </Text>

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
        </View>
      </SafeAreaView>
    </DashboardLayout>
  );
};

export default SurveyorDashboard;