import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, ScrollView, Button, Alert } from 'react-native';
import React, { useState } from 'react';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import  GenderSelectionModal  from '../utils/GenderModal';
import PhoneNumberInput from '../utils/PhoneNumberInput';
import InputFields from '../utils/InputFields';

const Work = (props) => {
    const [occupation, setOccupation] = useState('');
    const [email, setEmail] = useState('');
    const [dob, setDob] = useState('');
    const [gender, setGender] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [phoneLength, setPhoneLength] = useState(0);
    const [countryInitials, setcountryInitials] = useState('');
    const [marriageStatus, setMarriageStatus] = useState('')
    const [address, setAddress] = useState('');
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [genderModalVisible, setGenderModalVisible] = useState(false);
    const [MerriageModalVisible, setMerriageModalVisible] = useState(false);

    const [error, setError] = useState({occupation:'', email:'', dob:'', gender:'', phoneNumber:'', marriage:'', address:''});

    const validateOccupation = () => {
        const trimmedName = occupation.trim();
    
        if(trimmedName=='' || trimmedName.length == 0){
            setError((prev) => ({ ...prev, occupation: 'Occupation is required' }));
          return 'Occupation is required';
        }

        if (trimmedName.length < 4) {
          setError((prev) => ({ ...prev, occupation: 'Occupation must be at least 4 characters long.' }));
          return 'Occupation must be at least 4 characters long.';
        }
    
        const nameRegex = /^[a-zA-Z]+$/;
        if (!nameRegex.test(trimmedName)) {
          setError((prev) => ({
            ...prev,
            occupation: 'Occupation should only contain alphabets and no special characters or numbers.',
          }));
          return 'Occupation should only contain alphabets and no special characters or numbers.';
        }
    
        setError((prev) => ({ ...prev, occupation: '' }));
        return ''
    };

    const validateEmail = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim()) {
          setError((prev) => ({ ...prev, email: 'Email is required.' }));
          return 'Email is required.';
        } else if (!emailRegex.test(email)) {
          setError((prev) => ({ ...prev, email: 'Invalid email format.' }));
          return 'Invalid email format.';
        } else {
          setError((prev) => ({ ...prev, email: '' }));
          return ''
        }
    };

    const validateDob = () =>{
        console.log('Dob: ',dob);
        if (!dob) {
          setError((prev) => ({ ...prev, dob: 'Date of birth is required.' }));
            return 'Date of birth is required.';
          } else if (!isValidDate(dob)) {
          setError((prev) => ({ ...prev, dob: 'Date must be in this format. (dd/mm/yyyy).' }));
           return 'Date must be in this format. (dd/mm/yyyy).';
          } else if (isDateInFuture(dob)) {
          setError((prev) => ({ ...prev, dob: 'Date must be today or earlier.' }));
            return 'Date must be today or earlier.';
          }
        setError((prev) => ({ ...prev, dob: '' }));
        return '';
          
      
    }

    const validateGender = () => {
        if (!gender) {
          setError(prev => ({ ...prev, gender: 'Gender is required.' }));
          return 'Gender is required.';
        }
        setError(prev => ({ ...prev, gender: '' }));
        return '';

      };

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };
    
    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = selectedDate => {
        setError(prev => ({...prev, dob: ''}));
        setDob(formatDate(selectedDate));
        hideDatePicker();
    };
    
    const formatDate = date => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const isValidDate = date => {
        const datePattern = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
        if (!datePattern.test(date)) {
          return false;
        }
    
        const [day, month, year] = date.split('/').map(Number);
    
        const currentYear = new Date().getFullYear();
        if (year < 1900 || year > currentYear) {
          return false;
        }
    
        const daysInMonth = {
          1: 31,
          2: year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0) ? 29 : 28,
          3: 31,
          4: 30,
          5: 31,
          6: 30,
          7: 31,
          8: 31,
          9: 30,
          10: 31,
          11: 30,
          12: 31,
        };
    
        return day >= 1 && day <= daysInMonth[month];
    };
    
    const isDateInFuture = dateString => {
        const [day, month, year] = dateString.split('/').map(Number);
        const date = new Date(year, month - 1, day);
        const today = new Date();
        return date > today;
    };


    const validatePhoneNumber = () => {
        
        const cleanedNumber = phoneNumber?.replace(/\D/g, ''); // Remove non-digits

        const countryValidations = {
            'US': { 
              regex: /^[2-9]\d{9}$/,
              error: "US number: 10 digits starting with 2-9"
            },
            'IN': { 
              regex: /^[6-9]\d{9}$/,
              error: "Indian number: 10 digits starting with 6-9"
            },
            'GB': { 
              regex: /^(?:(?:\(?(?:0(?:0|11)\)?[\s-]?\(?|\+)44\)?[\s-]?(?:(?:0\)?[\s-]?)?)|)(?:\d{5}[\s-]?\d{4,5}|\d{10})$)/,
              error: "UK number: 10 digits in valid format"
            },
            'AU': { 
              regex: /^[1-9]\d{8}$/,
              error: "Australian number: 9 digits starting with 1-9"
            },
            'CA': { 
              regex: /^[2-9]\d{9}$/,
              error: "Canadian number: 10 digits starting with 2-9"
            },
            'DE': { 
              regex: /^[1-9]\d{10}$/,
              error: "German number: 11 digits starting with 1-9"
            },
            'FR': { 
              regex: /^[1-9]\d{8}$/,
              error: "French number: 9 digits starting with 1-9"
            }
        };

        const validation = countryValidations[countryInitials];
        if(!cleanedNumber){
            setError(prev => ({
                ...prev,
                phoneNumber: `Phone number is required.`}))
            return  `Phone number is required.`;
        }
        if (cleanedNumber.length !== phoneLength) {
          setError(prev => ({
            ...prev,
            phoneNumber: `Phone number must be ${phoneLength} digits`
          }));
          return `Phone number must be ${phoneLength} digits`
        } else if(validation && !validation.regex.test(cleanedNumber)){
            setError(prev => ({
                ...prev,
                phoneNumber: validation.error
              }));
              return validation.error;
        } else{
          setError(prev => ({ ...prev, phoneNumber: '' }));
          return '';
        }
    };
    
    const handlePhoneNumberChange = (text) => {
        // Remove all non-digit characters
        const cleanedNumber = text.replace(/\D/g, '');
        setPhoneNumber(cleanedNumber);
    };

    const validateAddress = () => {
        const trimmedAddress = address.trim();
        if(trimmedAddress == '' || trimmedAddress.length == 0){
            setError((prev) => ({ ...prev, address: 'Address is required' }));
            return 'Address is required';
        }

        setError((prev) => ({ ...prev, address: '' }));
        return '';
    }

 

    const handleNextPress = async () => {
    
        const newErrors = {
          name: validateName(),
          email: validateEmail(),
          dob: validateDob(),
          phoneNumber: validatePhoneNumber(),
          address: validateAddress(),
        };
     
        setError(newErrors);
      
      console.log(newErrors);
      
        const hasError = Object.values(newErrors).some(err => err !== '');
      
        if (hasError) {
            Alert.alert(
                "Missing Information",  
                "Please fill all required fields before proceeding.",
                [
                  { 
                    text: "OK", 
                    onPress: () => console.log("OK Pressed"),
                    style: "cancel" 
                  }
                ],
                { cancelable: true }
            );
          return;
        }
      
        // Only navigate if no errors
        props.navigation.navigate('Documents');
    };
  return (
    <ScrollView style={styles.container}>
       <InputFields 
            label={'Occupation*'} 
            value={occupation} 
            keyboardType={'default'}
            onFocus={() => setError(prev => ({...prev, occupation: ''}))} 
            onBlur={()=> validateOccupation()}
            // onChangeText={setFullName}
            onChangeText={(text) => setOccupation(text)}
            editable={true}
            maxLength={25}
            placeholder={'Enter Occupation eg:(Engineer/Doctor/Business...)'}
            error={error.occupation}
        />

        <InputFields 
            label={'Email*'} 
            value={email} 
            keyboardType={'email-address'}
            onFocus={() => setError(prev => ({...prev, email: ''}))} 
            onBlur={()=> validateEmail()}
            onChangeText={setEmail}
            editable={true}
            placeholder={'Enter Email'}
            error={error.email}
        />

        <InputFields 
            label={'Date of birth*'} 
            value={dob} 
            keyboardType={'default'}
            onFocus={() => setError(prev => ({...prev, dob: ''}))} 
            onBlur={()=> validateDob()}
            onChangeText={text => {
                console.log(text,'text');
                let sanitizedText = text.replace(/[^0-9]/g, '');
                let formattedText = '';
                const currentYear = new Date().getFullYear();

                let day = sanitizedText.slice(0, 2);
                let month = sanitizedText.slice(2, 4);
                let year = sanitizedText.slice(4, 8);

                if (day.length === 2) {
                  let dayNum = parseInt(day, 10);
                  if (dayNum < 1) {
                    day = '01';
                  } else if (dayNum > 31) {
                    day = '31';
                  }
                }

                if (month.length === 2) {
                  let monthNum = parseInt(month, 10);
                  if (monthNum < 1 || monthNum > 12) {
                    month = '01';
                  }
                }

                const maxDays = {
                  '01': 31,
                  '02': 29,
                  '03': 31,
                  '04': 30,
                  '05': 31,
                  '06': 30,
                  '07': 31,
                  '08': 31,
                  '09': 30,
                  10: 31,
                  11: 30,
                  12: 31,
                };

                if (day.length === 2 && month.length === 2) {
                  let dayNum = parseInt(day, 10);
                  let maxDay = maxDays[month] || 31;

                  if (dayNum > maxDay) {
                    day = maxDay.toString().padStart(2, '0');
                  }
                }

                if (year.length === 4) {
                  let yearNum = parseInt(year, 10);
                  if (yearNum < 1900 || yearNum > currentYear) {
                    year = currentYear.toString();
                  }
                }

                if (sanitizedText.length >= 1) formattedText += day;
                if (sanitizedText.length >= 3) formattedText += '/' + month;
                if (sanitizedText.length >= 5) formattedText += '/' + year;
                setDob(formattedText);
              }}
            onIconPress={showDatePicker}
            iconSource={require('../../assets/Images/date_input.png')}
            editable={true}
            placeholder={'Enter date of birth (dd/mm/yyyy)'}
            error={error.dob}
        />

        <InputFields 
            label={'Gender'} 
            value={gender} 
            keyboardType={'default'}
            // onFocus={() => setError(prev => ({...prev, gender: ''}))} 
            // onBlur={()=> validateGender()}
            // onChangeText={setGender}
            onIconPress={() => setGenderModalVisible(true)}
            iconSource={require('../../assets/Images/DropDownIcon.png')}
            editable={false}
            placeholder={'Select Gender'}
            error={error.gender}
        />

        <PhoneNumberInput
        phoneNumber={phoneNumber}
        setPhoneNumber={setPhoneNumber}
        setPhoneLength = {setPhoneLength}
        setcountryInitials = {setcountryInitials}
        onBlur={validatePhoneNumber}
        onChangeText={handlePhoneNumberChange}
        onFocus={() => setError(prev => ({...prev, phoneNumber: ''}))}
        error={error.phoneNumber}
        />

        <InputFields 
            label={'Marital Status'} 
            value={marriageStatus} 
            keyboardType={'default'}
            onIconPress={() => setMerriageModalVisible(true)}
            iconSource={require('../../assets/Images/DropDownIcon.png')}
            editable={false}
            placeholder={'Select Status'}
            error={error.marriage}
        />

        <InputFields 
            label={'Address*'} 
            value={address} 
            keyboardType={'default'}
            onFocus={() => setError(prev => ({...prev, address: ''}))} 
            onBlur={()=> validateAddress()}
            // onChangeText={setAddress}
            onChangeText={(text) => {
                if (text.length > 150) {
                  setError(prev => ({ ...prev, address: 'Address cannot exceed more than 150 characters remove 1 character' }));
                } else {
                  setError(prev => ({ ...prev, address: '' }));
                }
                setAddress(text);
              }}
            editable={true}
            maxLength={151}
            placeholder={'Enter Full Address'}
            error={error.address}
        />

        <Button
        title="Next"
        onPress={handleNextPress}
        color="#4582e6"
        accessibilityLabel="Learn more about this purple button"
        style={styles.button}
        />



        <GenderSelectionModal 
        modalVisible={genderModalVisible}
        setModalVisible={setGenderModalVisible}
        setGender={setGender}
        isGender={true}
        />

        <GenderSelectionModal 
        modalVisible={MerriageModalVisible}
        setModalVisible={setMerriageModalVisible}
        setMarriageStatus={setMarriageStatus} 
        isGender={false}
        />

        <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              maximumDate={new Date()}
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
        />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: '#f9f9f9',
    },
    button:{
      height:50,
      display:'flex',
    }
  
  });

export default Work