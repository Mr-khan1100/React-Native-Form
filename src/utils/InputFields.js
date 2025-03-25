import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native'
import React from 'react'

const InputFields = ({
    label,
    value,
    onFocus,
    onBlur,
    onChangeText,
    error,
    onIconPress,
    iconSource,
    editable = true,
    placeholder,
    keyboardType,
    maxLength
  }) => {
  return (
    <View style={styles.inputContainer}>
          <Text style={styles.label}>{label}</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={[styles.input, error && styles.errorInput]}
              value={value}
              placeholderTextColor={'#c4bfbe'}
              keyboardType={keyboardType}
              onFocus={onFocus}
              onBlur={onBlur}
              onChangeText={onChangeText}
              editable={editable}
              placeholder={placeholder}
              maxLength={maxLength}
            />
            {iconSource && (
              <TouchableOpacity onPress={onIconPress} style={styles.iconContainer}>
                <Image source={iconSource} style={styles.icon} />
              </TouchableOpacity>
            )}
          </View>
          {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
  )
}

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    marginVertical: 5,
    color: '#4E4E4E',
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    height: 50,
    color:'#2E2E2E'
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    tintColor:'#f9f9f9',
    marginRight: 30,
  },
  icon: {
    width: 26,
    height: 26,
    opacity: 0.5,
  },
  errorText: {
    color: 'red',
    marginTop: 5,
  },

});
export default InputFields