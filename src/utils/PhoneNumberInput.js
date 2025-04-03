import React, { useContext, useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, FlatList, StyleSheet, Image } from 'react-native';
import { countryCodeList } from './countryCodeList';
import FormContext from '../context/FormContext';
import DropDownIcon from '../../assets/Images/DropDownIcon.png';
import { PHONE_NUMBER_PLACEHOLDER, PHONE_PAD, SEARCH_PLACEHOLDER, SLIDE } from '../constants/personalScreenConstants';


const PhoneNumberInput = ({
    phoneNumber,
    onBlur,
    onFocus,
    onChangeText,
    error,
}) => {
  const {initalUserDetails, setInitialUserDetails, setIsChangeDetect} = useContext(FormContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [search, setSearch] = useState('');

  const openModal = () => {
    setSearch('');
    setModalVisible(true);
  };


  const isCountryUpdated = useRef(false);

    const selectCountry = async(country) => {
      isCountryUpdated.current = true;
        const newCountry = { 
        code: country.dial_code, 
        flag: country.flag,
        initial: country.code, 
        phoneLength: country.phone_length, 
        };
        setInitialUserDetails(prev => ({...prev, selectedCountry:newCountry}));
        setIsChangeDetect(true);
        setModalVisible(false);


    };

    useEffect(() => {
      if (isCountryUpdated.current) {
          isCountryUpdated.current = false;
            onBlur();
        }
  }, [initalUserDetails.selectedCountry]);

  const filteredCountries = countryCodeList.filter((country) =>
    country.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Phone Number*</Text>
      <View style={styles.inputRow}>
        <TouchableOpacity style={styles.countrySelector} onPress={openModal}>
          <Text style={styles.flag}>{initalUserDetails.selectedCountry.flag}</Text>
          <Text style={styles.code}>{initalUserDetails.selectedCountry.code}</Text>
          <Image source={DropDownIcon} style={styles.icon} />
        </TouchableOpacity>
        <TextInput
            style={styles.input}
            keyboardType={PHONE_PAD}
            placeholder={PHONE_NUMBER_PLACEHOLDER}
            placeholderTextColor={'#c4bfbe'}
            value={phoneNumber}
            onChangeText={onChangeText}
            maxLength={20}
            onBlur={() => onBlur()}
            onFocus={onFocus}
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}


      <Modal visible={modalVisible} transparent animationType={SLIDE}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.searchInput}
              placeholder={SEARCH_PLACEHOLDER}
              value={search}
              onChangeText={setSearch}
            />
            <FlatList
              data={filteredCountries}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.countryItem} onPress={() => selectCountry(item)}>
                  <Text style={styles.flag}>{item.flag}</Text>
                  <Text style={styles.countryName}>{item.name}</Text>
                  <Text style={styles.dialCode}>{item.dial_code}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
     margin: 0, 
    },
  label: { 
    fontSize: 16,
    marginVertical: 5,
    color: '#4E4E4E', 
    },
  inputRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom:15,
    },
  countrySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginRight: 10,
    height: 50,
  },
  flag: { 
    fontSize: 24, 
    marginRight: 8, 
    },
  code: { 
    fontSize: 16, 
    marginRight: 4, 
    },
  input: {
    flex: 1,
    padding: 10,
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    color:'#2E2E2E',
    borderRadius: 5,
  },
 
  modalContainer: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.5)', 
    justifyContent: 'center', 
},
  modalContent: { backgroundColor: '#fff', padding: 20, borderRadius: 16, margin: 20 },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  countryItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  countryName: { flex: 1, fontSize: 16 },
  dialCode: { fontSize: 16, color: '#555' },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#ff4757',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeText: { color: '#fff', fontWeight: 'bold' },
  icon: {
    width: 20,
    height: 20,
    opacity: 0.5,
  },
  errorText: {
    color: 'red',
    marginTop: 5,
  },
});

export default PhoneNumberInput;
