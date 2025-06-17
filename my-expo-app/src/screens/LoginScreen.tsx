import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Picker } from '@react-native-picker/picker';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

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

const LoginScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<RoleKey>(roleOptions[0]);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password || !selectedRole) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        username,
        password,
        role: roleMap[selectedRole],
      };

      const response = await axios.post(`${BACKEND_URL}/auth/login`, payload);
      await SecureStore.setItemAsync('token', response.data.token);

      const userRole = response.data.user.role;

      // Navigate based on role
      switch (userRole) {
        case 'SUPERADMIN':
          navigation.navigate('SuperAdminDashboard');
          break;
        case 'ADMIN':
          navigation.navigate('AdminDashboard');
          break;
        case 'SUPERVISOR':
          navigation.navigate('SupervisorDashboard');
          break;
        case 'SURVEYOR':
          navigation.navigate('SurveyorDashboard');
          break;
        default:
          Alert.alert('Error', 'Invalid role received');
      }
    } catch (error) {
      console.log('Login error:', error);
      Alert.alert('Login Failed', 'Invalid credentials');
      
      // Clear input fields
      setUsername('');
      setPassword('');
      setSelectedRole(roleOptions[0]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
    >
      <ScrollView className="flex-1">
        <View className="flex-1 px-6 pt-12">
          <View className="items-center mb-12">
            <Image
              source={require('../../assets/icon.png')}
              className="w-24 h-24 mb-4"
              resizeMode="contain"
            />
            <Text className="text-3xl font-bold text-blue-600">LRM CONSULTANTS</Text>
            <Text className="text-gray-600 mt-2">Sign in to continue</Text>
          </View>

          <View className="space-y-4">
            <View>
              <Text className="text-gray-700 mb-2">Role</Text>
              <View className="bg-gray-50 rounded-xl border border-gray-200">
                <Picker
                  selectedValue={selectedRole}
                  onValueChange={(value) => setSelectedRole(value as RoleKey)}
                  style={styles.picker}
                  enabled={!isLoading}
                >
                  {roleOptions.map((role) => (
                    <Picker.Item key={role} label={role} value={role as RoleKey} />
                  ))}
                </Picker>
              </View>
            </View>

            <View>
              <Text className="text-gray-700 mb-2">Username</Text>
              <TextInput
                className="bg-gray-50 p-4 rounded-xl border border-gray-200"
                placeholder="Enter your username"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                editable={!isLoading}
              />
            </View>

            <View>
              <Text className="text-gray-700 mb-2">Password</Text>
              <TextInput
                className="bg-gray-50 p-4 rounded-xl border border-gray-200"
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!isLoading}
              />
            </View>

            <TouchableOpacity
              onPress={handleLogin}
              disabled={isLoading}
              className={`p-4 rounded-xl mt-6 ${isLoading ? 'bg-blue-300' : 'bg-blue-600'}`}
            >
              <Text className="text-white text-center font-bold text-lg">
                {isLoading ? 'Logging in...' : 'Login'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = {
  picker: {
    height: 50,
  },
};

export default LoginScreen;
