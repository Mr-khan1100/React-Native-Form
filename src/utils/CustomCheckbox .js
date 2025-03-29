import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';

const CustomCheckbox = ({ isChecked, onPress, label }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={[styles.checkbox, isChecked && styles.checked]}>
        {isChecked && <Text style={styles.checkmark}>✔</Text>}
      </View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -2,
    marginBottom:8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#4582e6',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checked: {
    backgroundColor: '#4582e6',
  },
  checkmark: {
    color: '#fff',
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    color: '#333',
  },
});

export default CustomCheckbox;
