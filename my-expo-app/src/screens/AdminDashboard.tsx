import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const BACKEND_URL = 'http://192.168.18.34:4000';

const AdminDashboard = () => {
  const navigation = useNavigation<NavigationProp>();
  const [loading, setLoading] = useState<boolean>(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

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

  if (loading) {
    return (
      <SafeAreaView className={`flex-1 justify-center items-center ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <View className="flex-1 p-5 justify-center items-center">
        <Text className={`text-2xl font-bold mb-8 text-center ${isDarkMode ? 'text-white' : 'text-black'}`}>
          Admin Dashboard
        </Text>

        <TouchableOpacity
          className={`h-[50px] rounded-lg justify-center items-center mt-2.5 flex-row ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800' : 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700'}`}
          onPress={() => navigation.navigate('RegisterScreen')}
        >
          <Feather name="user-plus" size={20} color="#fff" className="mr-2" />
          <Text className="text-white text-base font-semibold">Register New User</Text>
        </TouchableOpacity>


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
  );
};

export default AdminDashboard;