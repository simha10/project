import React, { useEffect } from 'react';
import { View, Text, Image, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import * as SecureStore from 'expo-secure-store';
import { SafeAreaView } from 'react-native-safe-area-context';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const SplashScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();

    const checkAuthAndNavigate = async () => {
      try {
        const token = await SecureStore.getItemAsync('token');
        setTimeout(() => {
          navigation.replace(token ? 'AdminDashboard' : 'LoginScreen');
        }, 3000);
      } catch (error) {
        navigation.replace('LoginScreen');
      }
    };

    checkAuthAndNavigate();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-gradient-to-b from-blue-600 to-blue-800 items-center justify-center">
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        }}
        className="items-center"
      >
        <Image
          source={require('../../assets/icon.png')}
          className="w-32 h-32 mb-4"
          resizeMode="contain"
        />
        <Text className="text-2xl font-bold text-white mb-2">LRM CONSULTANTS</Text>
        <Text className="text-xl text-gray-200">SURVEY APP</Text>
      </Animated.View>
    </SafeAreaView>
  );
};

export default SplashScreen;