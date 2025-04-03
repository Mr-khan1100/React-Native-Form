import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';

const FormBlueButton = ({disabled, style, onPress, title, titleStyle}) => {
    return (
        <>
          <TouchableOpacity
            style={[styles.ButtonStyle, style]}
            disabled={disabled}
            onPress={onPress}>
            <View>
              <Text style={[styles.TextStyle, titleStyle]}>
                {title}
              </Text>
            </View>
          </TouchableOpacity>
        </>
    );
};

const styles = StyleSheet.create({
    ButtonStyle: {
      backgroundColor: '#4582e6',
      borderRadius: 5,
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 15,
      marginBottom:50,
    },
    TextStyle: {
      color: '#FFFFFF',
      fontSize: 16,
    },
  });

export default FormBlueButton;
