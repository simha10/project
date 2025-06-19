import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Alert, Animated, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import { RootStackParamList } from '../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Define specific Feather icon names used in the component
type FeatherIconName = 'users' | 'user' | 'user-plus' | 'x' | 'sun' | 'moon' | 'log-out';

interface SideNavProps {
  userRole: string;
  isOpen: boolean;
  toggleSideNav: () => void;
}

const SideNav: React.FC<SideNavProps> = ({ userRole, isOpen, toggleSideNav }) => {
  const navigation = useNavigation<NavigationProp>();
  const widthAnim = useRef(new Animated.Value(0)).current;
  const [isDarkMode, setIsDarkMode] = useState(false);

  React.useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: isOpen ? 240 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isOpen]);

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('token');
    navigation.reset({
      index: 0,
      routes: [{ name: 'LoginScreen' }],
    });
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    // Implement theme toggle logic if needed
  };

  const navItems: {
    name: string;
    screen: keyof RootStackParamList;
    icon: FeatherIconName;
    roles: string[];
  }[] = [
    { name: 'Users', screen: 'CreatedUsersScreen', icon: 'users', roles: ['ADMIN', 'SUPERADMIN'] },
    {
      name: 'Profile',
      screen: 'ProfileScreen',
      icon: 'user',
      roles: ['ADMIN', 'SUPERADMIN', 'SUPERVISOR', 'SURVEYOR'],
    },
    {
      name: 'Create User',
      screen: 'RegisterScreen',
      icon: 'user-plus',
      roles: ['ADMIN', 'SUPERADMIN'],
    },
  ];

  return (
    <Animated.View
      className={`h-full absolute z-50 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-800'}`}
      style={{ width: widthAnim }}
    >
      <SafeAreaView className="flex-1" edges={['left', 'right', 'bottom']}>
        {/* Header */}
        <View className="p-4 border-b border-gray-700 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Image
              source={{ uri: 'https://via.placeholder.com/40' }} // Replace with user avatar
              className="w-10 h-10 rounded-full mr-3"
            />
            <View>
              <Text className="text-white text-lg font-semibold">User Name</Text>
              <Text className="text-gray-400 text-xs capitalize">{userRole.toLowerCase()}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={toggleSideNav}>
            <Feather name="x" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Navigation Items */}
        <View className="p-2">
          {navItems.map(
            (item) =>
              item.roles.includes(userRole) && (
                <TouchableOpacity
                  key={item.name}
                  className="flex-row items-center p-3 rounded-lg mb-1 hover:bg-gray-700 active:bg-gray-600"
                  onPress={() => {
                    toggleSideNav();
                    navigation.navigate(item.screen);
                  }}
                >
                  <Feather name={item.icon} size={20} color="#9ca3af" className="mr-3" />
                  <Text className="text-gray-200 text-base font-medium">{item.name}</Text>
                </TouchableOpacity>
              )
          )}
        </View>

        {/* Theme Toggle */}
        <TouchableOpacity
          className="flex-row items-center p-3 rounded-lg mx-2 mb-2 hover:bg-gray-700 active:bg-gray-600"
          onPress={toggleTheme}
        >
          <Feather name={isDarkMode ? 'sun' : 'moon'} size={20} color="#9ca3af" className="mr-3" />
          <Text className="text-gray-200 text-base font-medium">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</Text>
        </TouchableOpacity>

        {/* Logout Button */}
        <TouchableOpacity
          className="flex-row items-center p-3 rounded-lg mx-2 mt-auto border-t border-gray-700 hover:bg-gray-700 active:bg-gray-600"
          onPress={() => {
            Alert.alert(
              'Logout',
              'Are you sure you want to logout?',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Logout', style: 'destructive', onPress: handleLogout },
              ],
              { cancelable: true }
            );
          }}
        >
          <Feather name="log-out" size={20} color="#ef4444" className="mr-3" />
          <Text className="text-red-400 text-base font-medium">Logout</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </Animated.View>
  );
};

export default SideNav;