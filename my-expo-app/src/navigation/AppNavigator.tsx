import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import SuperAdminDashboard from '../screens/SuperAdminDashboard';
import AdminDashboard from '../screens/AdminDashboard';
import SupervisorDashboard from '../screens/SupervisorDashboard';
import SurveyorDashboard from '../screens/SurveyorDashboard';
import CreatedUsersScreen from '../screens/CreatedUsersScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AuthenticatedLayout from '../components/AuthenticatedLayout';
import * as SecureStore from 'expo-secure-store';
import { View, ActivityIndicator } from 'react-native';

export type RootStackParamList = {
  LoginScreen: undefined;
  RegisterScreen: undefined;
  SuperAdminDashboard: undefined;
  AdminDashboard: undefined;
  SupervisorDashboard: undefined;
  SurveyorDashboard: undefined;
  CreatedUsersScreen: undefined;
  ProfileScreen: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AuthenticatedScreenWrapper = ({ component: Component, ...props }: any) => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const token = await SecureStore.getItemAsync('token');
        if (!token) {
          setUserRole(null);
          setLoading(false);
          return;
        }
        // For simplicity, assume userRole is stored in token or fetch from backend here
        // Here, just set a placeholder or fetch user role from backend if needed
        // For now, set userRole to 'ADMIN' as placeholder
        setUserRole('ADMIN');
      } catch (error) {
        setUserRole(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUserRole();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  if (!userRole) {
    // If no userRole, redirect to login or show error
    return null;
  }

  return (
    <AuthenticatedLayout userRole={userRole}>
      <Component {...props} />
    </AuthenticatedLayout>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="LoginScreen"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
        <Stack.Screen
          name="SuperAdminDashboard"
          children={(props) => <AuthenticatedScreenWrapper component={SuperAdminDashboard} {...props} />}
        />
        <Stack.Screen
          name="AdminDashboard"
          children={(props) => <AuthenticatedScreenWrapper component={AdminDashboard} {...props} />}
        />
        <Stack.Screen
          name="SupervisorDashboard"
          children={(props) => <AuthenticatedScreenWrapper component={SupervisorDashboard} {...props} />}
        />
        <Stack.Screen
          name="SurveyorDashboard"
          children={(props) => <AuthenticatedScreenWrapper component={SurveyorDashboard} {...props} />}
        />
        <Stack.Screen
          name="CreatedUsersScreen"
          children={(props) => <AuthenticatedScreenWrapper component={CreatedUsersScreen} {...props} />}
        />
        <Stack.Screen
          name="ProfileScreen"
          children={(props) => <AuthenticatedScreenWrapper component={ProfileScreen} {...props} />}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
