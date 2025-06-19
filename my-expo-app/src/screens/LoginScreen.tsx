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

const LoginScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<RoleKey>(roleOptions[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

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
      const tokenToStore =
        typeof response.data.data.token === 'string'
          ? response.data.data.token
          : JSON.stringify(response.data.data.token);
      await SecureStore.setItemAsync('token', tokenToStore);

      const userRole = response.data.data.user.role;

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
      setUsername('');
      setPassword('');
      setSelectedRole(roleOptions[0]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView className="flex-1 px-6 pt-8">
          <View className="items-center mb-10">
            <Image
              source={require('../../assets/icon.png')}
              className="w-24 h-24 mb-4"
              resizeMode="contain"
            />
            <Text className={`text-3xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
              LRM CONSULTANTS
            </Text>
            <Text className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Sign in to continue
            </Text>
          </View>

          <View className="space-y-4">
            <View>
              <Text className={`mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Role</Text>
              <View className={`rounded-xl border ${isDarkMode ? 'border-gray-600 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
                <Picker
                  selectedValue={selectedRole}
                  onValueChange={(value) => setSelectedRole(value as RoleKey)}
                  style={{ height: 50, color: isDarkMode ? '#fff' : '#000' }}
                  enabled={!isLoading}
                >
                  {roleOptions.map((role) => (
                    <Picker.Item key={role} label={role} value={role as RoleKey} />
                  ))}
                </Picker>
              </View>
            </View>

            <View>
              <Text className={`mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Username
              </Text>
              <View className="relative">
                <TextInput
                  className={`p-4 rounded-xl border ${isDarkMode ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-200 bg-gray-50 text-black'}`}
                  placeholder="Enter your username"
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
            </View>

            <View>
              <Text className={`mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Password
              </Text>
              <View className="relative">
                <TextInput
                  className={`p-4 rounded-xl border ${isDarkMode ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-200 bg-gray-50 text-black'}`}
                  placeholder="Enter your password"
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
            </View>

            <TouchableOpacity
              onPress={handleLogin}
              disabled={isLoading}
              className={`p-4 rounded-xl mt-6 flex-row justify-center items-center ${isLoading ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'}`}
            >
              <Feather name="log-in" size={20} color="#fff" className="mr-2" />
              <Text className="text-white text-center font-bold text-lg">
                {isLoading ? 'Logging in...' : 'Login'}
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
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;