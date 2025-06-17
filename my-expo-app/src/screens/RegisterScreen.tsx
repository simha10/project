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

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const roleMap = {
  'Super Admin': 'SUPERADMIN',
  'Admin': 'ADMIN',
  'Supervisor': 'SUPERVISOR',
  'Surveyor': 'SURVEYOR',
} as const;

type RoleKey = keyof typeof roleMap;

const roleOptions = Object.keys(roleMap) as RoleKey[];

// Replace 'YOUR_BACKEND_IP' with your backend server IP or hostname
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
      navigation.navigate('LoginScreen');
    } catch (error: any) {
      console.log('Registration error:', error);
      Alert.alert(
        'Registration Failed',
        error.response?.data?.message || 'Failed to register user'
      );
      // Clear input fields on failure
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
    <ScrollView className="flex-1 bg-white py-10 px-5 ">
      <Text className="text-3xl font-bold mb-8 text-center text-blue-600">
        Register New User
      </Text>

      <View className="space-y-4">
        <TextInput
          className="border border-gray-300 rounded-lg p-4 text-base"
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          editable={!isLoading}
        />

        <TextInput
          className="border border-gray-300 rounded-lg p-4 text-base"
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!isLoading}
        />

        <TextInput
          className="border border-gray-300 rounded-lg p-4 text-base"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          editable={!isLoading}
        />

        <View className="border border-gray-300 rounded-lg overflow-hidden">
          <Picker
            selectedValue={selectedRole}
            onValueChange={(value) => setSelectedRole(value as RoleKey)}
            enabled={!isLoading}
            style={{ height: 50 }}
          >
            {roleOptions.map((role) => (
              <Picker.Item key={role} label={role} value={role} />
            ))}
          </Picker>
        </View>

        <TextInput
          className="border border-gray-300 rounded-lg p-4 text-base"
          placeholder="Phone Number (optional)"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
          editable={!isLoading}
        />

        <TouchableOpacity
          className={`rounded-lg p-4 mt-4 ${
            isLoading ? 'bg-blue-300' : 'bg-blue-600'
          }`}
          onPress={handleRegister}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          <Text className="text-white text-center font-bold text-lg">
            {isLoading ? 'Registering...' : 'Register'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default RegisterScreen;
