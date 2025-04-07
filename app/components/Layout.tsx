import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

interface LayoutProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

const Layout: React.FC<LayoutProps> = ({ children, style }) => {
  return <View style={[styles.container, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Layout;