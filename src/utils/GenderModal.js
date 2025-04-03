import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import FormContext from '../context/FormContext';
import { FADE, GENDER_PLACEHOLDER, MARRIAGE_PLACEHOLDER } from '../constants/personalScreenConstants';

const genders = ['Male', 'Female', 'Other'];
const marriageStatus = ['Single', 'Engaged', 'Married'];

  const GenderSelectionModal = ({ modalVisible, setModalVisible, isGender, handleStore}) => {
  const {setInitialUserDetails, setUserDetails} = useContext(FormContext);

  const handleSelect = (item) => {
    if(isGender){
      setInitialUserDetails(prev => ({...prev, gender:item}));
      setUserDetails((prev) => {
        const updatedDetails = { ...prev, gender: item };
          handleStore(updatedDetails);
          return updatedDetails;
      });
    }else{
      setInitialUserDetails(prev => ({...prev, marriageStatus:item}));
      setUserDetails((prev) => {
        const updatedDetails = { ...prev, marriageStatus: item };
          handleStore(updatedDetails);
          return updatedDetails;
      });
    }
    setModalVisible(false);
  };

  return (
    <Modal
      transparent
      animationType={FADE}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>{isGender ? GENDER_PLACEHOLDER : MARRIAGE_PLACEHOLDER}</Text>
            {isGender ? (
                genders.map((gender, index) => (
                    <TouchableOpacity 
                    key={index} 
                    style={styles.option} 
                    onPress={() => handleSelect(gender)}
                    >
                    <Text style={styles.optionText}>{gender}</Text>
                    </TouchableOpacity>
                ))
                ) : (
                marriageStatus.map((status, index) => (
                    <TouchableOpacity 
                    key={index} 
                    style={styles.option} 
                    onPress={() => handleSelect(status)}
                    >
                    <Text style={styles.optionText}>{status}</Text>
                    </TouchableOpacity>
                ))
            )}

          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.closeText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    width: 300,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  option: {
    paddingVertical: 12,
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    color: '#000',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#ff4757',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 30,
  },
  closeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default GenderSelectionModal;
