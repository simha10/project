import React from 'react';
import { View } from 'react-native';

interface DashboardLayoutProps {
  children: React.ReactNode;
  userRole: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <View className="flex-1 bg-white justify-center items-center p-5">
      {children}
    </View>
  );
};

export default DashboardLayout;
