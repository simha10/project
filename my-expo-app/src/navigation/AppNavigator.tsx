import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import SuperAdminDashboard from '../screens/SuperAdminDashboard';
import AdminDashboard from '../screens/AdminDashboard';
import SupervisorDashboard from '../screens/SupervisorDashboard';
import SurveyorDashboard from '../screens/SurveyorDashboard';

export type RootStackParamList = {
  LoginScreen: undefined;
  RegisterScreen: undefined;
  SuperAdminDashboard: undefined;
  AdminDashboard: undefined;
  SupervisorDashboard: undefined;
  SurveyorDashboard: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

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
        <Stack.Screen name="SuperAdminDashboard" component={SuperAdminDashboard} />
        <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
        <Stack.Screen name="SupervisorDashboard" component={SupervisorDashboard} />
        <Stack.Screen name="SurveyorDashboard" component={SurveyorDashboard} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 