import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import * as SecureStore from 'expo-secure-store';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const SurveyorDashboard = () => {
  const navigation = useNavigation<NavigationProp>();

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('token');
    navigation.navigate('LoginScreen');
  };

  return (
    <View className="flex-1 p-5 bg-white">
      <Text className="text-2xl font-bold mb-8 text-center">Surveyor Dashboard</Text>
      
      <TouchableOpacity
        className="bg-red-500 h-[50px] rounded-lg justify-center items-center mt-5"
        onPress={handleLogout}
      >
        <Text className="text-white text-base font-semibold">Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SurveyorDashboard; 