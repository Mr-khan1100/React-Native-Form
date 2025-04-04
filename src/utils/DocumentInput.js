import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { DOCUMENT_INPUT_PLACEHOLDER } from '@constants/documentScreenConstant';
const DocumentInput = ({
  label,
  value,
  error,
  iconSource,
  isDisabled = false,
  onPress,
}) => {


  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        onPress={onPress}
        disabled={isDisabled}
        style={[
          styles.fileUploadButton,
          // error && styles.errorInput,
          isDisabled && styles.disabledButton,
        ]}
      >
        <View style={styles.fileUploadContent}>
          <Text style={styles.fileUploadText}>
            {value ? value : DOCUMENT_INPUT_PLACEHOLDER}
          </Text>
          {iconSource && (
            <Image source={iconSource} style={styles.icon} />
          )}
        </View>
      </TouchableOpacity>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginVertical: 5,
    color: '#4E4E4E',
  },
  fileUploadButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  fileUploadContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fileUploadText: {
    color: '#c4bfbe',
  },
  icon: {
    width: 25,
    height: 25,
    opacity:0.7,
    // tintColor: '#4E4E4E',
  },
  errorInput: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginTop: 5,
  },
  disabledButton: {
    opacity: 0.5,
  },
});

export default DocumentInput;
