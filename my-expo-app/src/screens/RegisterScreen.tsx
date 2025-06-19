import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const roleMap = {
  'Super Admin': 'SUPERADMIN',
  Admin: 'ADMIN',
  Supervisor: 'SUPERVISOR',
  Surveyor: 'SURVEYOR',
} as const;

type RoleKey = keyof typeof roleMap;

const roleOptions = Object.keys(roleMap) as RoleKey[];

const BACKEND_URL = 'http://192.168.18.34:4000';

const RegisterScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<RoleKey>(roleOptions[0]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await SecureStore.getItemAsync('token');
      setToken(storedToken);
    };
    fetchToken();
  }, []);

  const handleRegister = async () => {
    if (!username || !password || !confirmPassword || !selectedRole) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    if (!token) {
      Alert.alert('Error', 'User not authenticated. Please login again.');
      navigation.navigate('LoginScreen');
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        username,
        password,
        role: roleMap[selectedRole],
        phoneNumber: phoneNumber || undefined,
      };

      await axios.post(`${BACKEND_URL}/users/register`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      Alert.alert('Success', 'User registered successfully');
      navigation.navigate('CreatedUsersScreen');
    } catch (error: any) {
      console.log('Registration error:', error);
      Alert.alert(
        'Registration Failed',
        error.response?.data?.message || 'Failed to register user'
      );
      setUsername('');
      setPassword('');
      setConfirmPassword('');
      setSelectedRole(roleOptions[0]);
      setPhoneNumber('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <ScrollView className="flex-1 py-10 px-5">
        <Text className={`text-3xl font-bold mb-8 text-center ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
          Register New User
        </Text>

        <View className="space-y-4">
          <View className="relative">
            <TextInput
              className={`border rounded-lg p-4 text-base ${isDarkMode ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-300 bg-white text-black'}`}
              placeholder="Username"
              placeholderTextColor={isDarkMode ? '#9ca3af' : '#6b7280'}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              editable={!isLoading}
            />
            <Feather
              name="user"
              size={20}
              color={isDarkMode ? '#9ca3af' : '#6b7280'}
              className="absolute right-4 top-4"
            />
          </View>

          <View className="relative">
            <TextInput
              className={`border rounded-lg p-4 text-base ${isDarkMode ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-300 bg-white text-black'}`}
              placeholder="Password"
              placeholderTextColor={isDarkMode ? '#9ca3af' : '#6b7280'}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!isLoading}
            />
            <Feather
              name="lock"
              size={20}
              color={isDarkMode ? '#9ca3af' : '#6b7280'}
              className="absolute right-4 top-4"
            />
          </View>

          <View className="relative">
            <TextInput
              className={`border rounded-lg p-4 text-base ${isDarkMode ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-300 bg-white text-black'}`}
              placeholder="Confirm Password"
              placeholderTextColor={isDarkMode ? '#9ca3af' : '#6b7280'}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              editable={!isLoading}
            />
            <Feather
              name="lock"
              size={20}
              color={isDarkMode ? '#9ca3af' : '#6b7280'}
              className="absolute right-4 top-4"
            />
          </View>

          <View className={`border rounded-lg overflow-hidden ${isDarkMode ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-white'}`}>
            <Picker
              selectedValue={selectedRole}
              onValueChange={(value) => setSelectedRole(value as RoleKey)}
              enabled={!isLoading}
              style={{ height: 50, color: isDarkMode ? '#fff' : '#000' }}
            >
              {roleOptions.map((role) => (
                <Picker.Item key={role} label={role} value={role} />
              ))}
            </Picker>
          </View>

          <View className="relative">
            <TextInput
              className={`border rounded-lg p-4 text-base ${isDarkMode ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-300 bg-white text-black'}`}
              placeholder="Phone Number (optional)"
              placeholderTextColor={isDarkMode ? '#9ca3af' : '#6b7280'}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
              editable={!isLoading}
            />
            <Feather
              name="phone"
              size={20}
              color={isDarkMode ? '#9ca3af' : '#6b7280'}
              className="absolute right-4 top-4"
            />
          </View>

          <TouchableOpacity
            className={`rounded-lg p-4 mt-4 flex-row justify-center items-center ${isLoading ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'}`}
            onPress={handleRegister}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            <Feather name="user-plus" size={20} color="#fff" className="mr-2" />
            <Text className="text-white text-center font-bold text-lg">
              {isLoading ? 'Registering...' : 'Register'}
            </Text>
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
      </ScrollView>
    </SafeAreaView>
  );
};

export default RegisterScreen;