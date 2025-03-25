import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TopBar = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Form</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    backgroundColor: '#6200ea',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default TopBar;
