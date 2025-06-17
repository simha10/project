import React from 'react';

import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as SecureStore from 'expo-secure-store';
import { RootStackParamList } from '../navigation/AppNavigator';


type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const AdminDashboard = () => {
  const navigation = useNavigation<NavigationProp>();

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('token');
    navigation.navigate('LoginScreen');
  };

  return (
    <View className="flex-1 p-5 bg-white">
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