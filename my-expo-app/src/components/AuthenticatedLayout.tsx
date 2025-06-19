import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text } from 'react-native';
import SideNav from './SideNav';

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
  userRole: string;
}

const SCREEN_WIDTH = Dimensions.get('window').width;

const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({ children, userRole }) => {
  const [sideNavOpen, setSideNavOpen] = useState(false);

  const toggleSideNav = () => {
    setSideNavOpen(!sideNavOpen);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.toggleButton} onPress={toggleSideNav}>
        <Text style={styles.toggleButtonText}>{sideNavOpen ? 'x' : '☰'}</Text>
      </TouchableOpacity>
      <SideNav userRole={userRole} isOpen={sideNavOpen} toggleSideNav={toggleSideNav} />
      <View style={[styles.content, sideNavOpen && styles.contentShift]}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  toggleButton: {
    position: 'absolute',
    top: 40,
    left: 10,
    zIndex: 1100,
    backgroundColor: '#f3f4f6',
    padding: 10,
    borderRadius: 4,
    elevation: 5,
  },
  toggleButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    marginLeft: 0,
  },
  contentShift: {
    marginLeft: 240, // width of side nav when open
  },
});

export default AuthenticatedLayout;
