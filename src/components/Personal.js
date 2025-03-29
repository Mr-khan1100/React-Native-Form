import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, ScrollView, Button, Alert, Modal } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import  GenderSelectionModal  from '../utils/GenderModal';
import PhoneNumberInput from '../utils/PhoneNumberInput';
import FormBlueButton from '../utils/FormBlueButton';
import InputFields from '../utils/InputFields';
import FormContext, { FormProvider } from '../context/FormContext';
import { getData, storeData } from '../services/storageService';

const Personal = (props) => {
    const {userDetails, setUserDetails, setIsPersonalDone, setIsWorkDone,  initalUserDetails, setInitialUserDetails} = useContext(FormContext);

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [dob, setDob] = useState('');
    const [gender, setGender] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [selectedCountry, setSelectedCountry] = useState({code :'+91', flag:'🇮🇳', initial:'IN', phoneLength:10 });
    const [marriageStatus, setMarriageStatus] = useState('')
    const [address, setAddress] = useState('');
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [genderModalVisible, setGenderModalVisible] = useState(false);
    const [MerriageModalVisible, setMerriageModalVisible] = useState(false);
    const [isChangeDetect, setIsChangeDetect] = useState(false);
    const [showEmailModal, setShowEmailModal] = useState(true);
    const [error, setError] = useState({name:'', email:'', dob:'', gender:'', phoneNumber:'', marriage:'', address:'',userEmail:''});

    useEffect(()=>{
      setFullName(userDetails.fullName || '');
      setEmail(userDetails.email || '');
      setDob(userDetails.dob || '');
      setGender(userDetails.gender || '');
      setPhoneNumber(userDetails.phoneNumber || '');
      setSelectedCountry({code : userDetails.selectedCountry?.code || '+91', 
        flag:userDetails.selectedCountry?.flag || '🇮🇳', 
        initial:userDetails.selectedCountry?.initial ||'IN', 
        phoneLength:userDetails.selectedCountry?.phoneLength || 10 
      });
      setMarriageStatus(userDetails.marriageStatus || '');
      setAddress(userDetails.address || '');

    },[userDetails]);

    useEffect(() => {
      setShowEmailModal(true);
    }, []);

    const validateName = () => {
        const trimmedName = fullName.trim();
        const nameParts = trimmedName.split(/\s+/); // Split by spaces
        const nameRegex = /^[a-zA-Z]+$/;
    
        if(trimmedName=='' || trimmedName.length == 0){
            setError((prev) => ({ ...prev, name: 'Name is required' }));
          return 'Name is required';
        }

        else if (trimmedName.length < 4) {
          setError((prev) => ({ ...prev, name: 'Name must be at least 4 characters long.' }));
          return 'Name must be at least 4 characters long.';
        }
    
        else if (nameParts.length < 3) {
          setError((prev) => ({
            ...prev,
            name: 'Please enter first name, middle name, and last name.',
          }));
          return  'Please enter first name, middle name, and last name.';
        }
    
       else  if (!nameParts.every((part) => nameRegex.test(part))) {
          setError((prev) => ({
            ...prev,
            name: 'Name should only contain alphabets and no special characters or numbers.',
          }));
          return 'Name should only contain alphabets and no special characters or numbers.';
        }
        else{
          console.log('got here');
          setError((prev) => ({ ...prev, name: '' }));
          setUserDetails((prev) => ({...prev, fullName: trimmedName,
          }))
          // const { trimmedName } = formData;
          handleStore();
          return ''
        }
        
    };

    const validateEmail = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!userDetails.email.trim()) {
          setError((prev) => ({ ...prev, email: 'Email is required.' }));
          return 'Email is required.';
        } else if (!emailRegex.test(userDetails.email)) {
          setError((prev) => ({ ...prev, email: 'Invalid email format.' }));
          return 'Invalid email format.';
        } else {

          setError((prev) => ({ ...prev, email: '' }));
          setUserDetails((prev) => ({...prev, email: userDetails.email,
          }))
          handleStore();
          return ''
        }
    };

    const validateDob = () =>{
        if (!dob) {
          setError((prev) => ({ ...prev, dob: 'Date of birth is required.' }));
            return 'Date of birth is required.';
          } else if (!isValidDate(dob)) {
          setError((prev) => ({ ...prev, dob: 'Date must be in this format:(dd/mm/yyyy) & year cannot be less than 1900' }));
           return 'Date must be in this format:(dd/mm/yyyy) & year cannot be less than 1900';
          } else if (isDateInFuture(dob)) {
          setError((prev) => ({ ...prev, dob: 'Date must be today or earlier.' }));
            return 'Date must be today or earlier.';
          }else if(isBeforeStartAndEndDate(dob)){
          setError((prev) => ({ ...prev, dob: 'Date must be less than start and end Date of work.' }));
            return 'Date must be less than start and end Date of work.';
          }

        setError((prev) => ({ ...prev, dob: '' }));
        setUserDetails((prev) => ({...prev, email: dob,
        }))
        handleStore();
        return '';
          
      
    }


    const isBeforeStartAndEndDate = dateString => {
      // If neither startDate nor endDate exists, nothing to validate
      if (!userDetails.startDate && !userDetails.endDate) {
        return false;
      }
      
      const [day, month, year] = dateString.split('/').map(Number);
      const dateToCheck = new Date(year, month - 1, day);
    
      if (userDetails.startDate) {
        const [sDay, sMonth, sYear] = userDetails.startDate.split('/').map(Number);
        const startDateObj = new Date(sYear, sMonth - 1, sDay);
        return dateToCheck >= startDateObj;
      }
    
      if (userDetails.endDate) {
        const [eDay, eMonth, eYear] = userDetails.endDate.split('/').map(Number);
        const endDateObj = new Date(eYear, eMonth - 1, eDay);
        return dateToCheck >= endDateObj;
        
      }
      return false;
    };
    
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
        setIsChangeDetect(true)
        setDob(formatDate(selectedDate));
        hideDatePicker();
        validateDob();
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

        const validation = countryValidations[selectedCountry.initial];
        if(!cleanedNumber){
            setError(prev => ({
                ...prev,
                phoneNumber: `Phone number is required.`}))
            return  `Phone number is required.`;
        }
        if (cleanedNumber.length !== selectedCountry.phoneLength) {
          setError(prev => ({
            ...prev,
            phoneNumber: `Phone number must be ${selectedCountry.phoneLength} digits`
          }));
          return `Phone number must be ${selectedCountry.phoneLength} digits`
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
        const addressRegex = /^[a-zA-Z0-9&.,\-\s]+$/;

        if(trimmedAddress == '' || trimmedAddress.length == 0){
            setError((prev) => ({ ...prev, address: 'Address is required' }));
            return 'Address is required';
        }    
        if (!addressRegex.test(trimmedAddress)) {
            setError((prev) => ({ ...prev, address: 'Invalid characters used. Only letters, numbers, spaces, &, ., and - are allowed.' }));
            return 'Invalid characters used. Only letters, numbers, spaces, &, ., and - are allowed.';
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
                "Please fill all required fields correctly before proceeding.",
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
        }else{
          setUserDetails((prev) => ({...prev, fullName: fullName,
            email: email,
            dob: dob,
            gender: gender,
            phoneNumber: phoneNumber,
            selectedCountry: {
              ...prev.selectedCountry, 
              code: selectedCountry.code,
              flag: selectedCountry.flag,
              initial: selectedCountry.initial,
              phoneLength: selectedCountry.phoneLength,
            },
            marriageStatus: marriageStatus,
            address:address,
            isPersonalDone: true
          }))
          setIsChangeDetect(false);
          setIsPersonalDone(true)
          props.navigation.navigate('Work');

        }
    };


    const handleStore = async () => {
      // Ensure email is present and validated
      if (!userEmail) {
        console.error('Cannot save data: Email not set');
        return;
      }
    
      try {
        // 3. Save merged data
        await storeData(userEmail, userDetails);
        console.log('Data saved for:', userEmail);
      } catch (error) {
        console.error('Save failed:', error);
      }
    };

    const handleContinue = async () => {
      if (!userEmail) {
        setError((prev) => ({ ...prev, userEmail: 'Email is required to continue.' }));
        return;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail)) {
        setError((prev) => ({ ...prev, userEmail: 'Please enter a valid email.' }));
        return;
      }
    
      try {
        const existingData = await getData(userEmail);
        
        if (existingData) {
          // Merge stored data with initial state to preserve any new fields
          setUserDetails(prev => ({
            ...prev, // Initial state defaults
            ...existingData, // Stored data
            email: userEmail // Ensure email matches key
          }));
          console.log(userDetails,'user detils on continue');
          
        } else {
          // Create new entry with email and initial state
          const newUser = {
            ...userDetails, // Initial empty values
            email: userEmail
          };
          await storeData(userEmail, newUser);
          setUserDetails(newUser);
        }
        
        setShowEmailModal(false);
        setError((prev) => ({ ...prev, userEmail: '' }));
      } catch (error) {
        console.error('Error handling continue:', error);
        setError((prev) => ({ ...prev, userEmail: 'Storage error' }));
      }
    };

    useEffect(() => {
      if(isChangeDetect){
        setIsPersonalDone(false)
        setIsWorkDone(false)
      }
    }, [isChangeDetect])
    
  return (
    <ScrollView style={styles.container}>
       <InputFields 
            label={'Full Name*'} 
            value={fullName} 
            keyboardType={'default'}
            onFocus={() => setError(prev => ({...prev, name: ''}))} 
            onBlur={()=> validateName()}
            onChangeText={(text) => {
              setFullName(text);
              setIsChangeDetect(true);
            }}
            editable={true}
            maxLength={50}
            placeholder={'Enter Full Name (First Middle Last)'}
            error={error.name}
        />

        <InputFields 
            label={'Email*'} 
            value={email} 
            keyboardType={'email-address'}
            onFocus={() => setError(prev => ({...prev, email: ''}))} 
            onBlur={()=> validateEmail()}
            onChangeText={(text) => {
              setEmail(text); 
              setIsChangeDetect(true);
            }}
            maxLength={50}
            editable={true}
            placeholder={'Enter Email'}
            error={error.email}
        />

        <InputFields 
            label={'Date of birth*'} 
            value={dob} 
            keyboardType={'phone-pad'}
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
                setIsChangeDetect(true);
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
            // onChangeText={(text)=> {setGender(text); setIsChangeDetect(true);}}
            onIconPress={() => setGenderModalVisible(true)}
            iconSource={require('../../assets/Images/DropDownIcon.png')}
            editable={false}
            placeholder={'Select Gender'}
            error={error.gender}
        />

        <PhoneNumberInput
        phoneNumber={phoneNumber}
        setSelectedCountry={setSelectedCountry}
        selectedCountry = {selectedCountry}
        // setPhoneLength = {setPhoneLength}
        // setcountryInitials = {setcountryInitials}
        // setCountryCode = {setCountryCode}
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
            onChangeText={(text) => setAddress(text)}
            editable={true}
            maxLength={150}
            placeholder={'Enter Full Address'}
            error={error.address}
        />

        <FormBlueButton title="NEXT" onPress={handleNextPress} />

        <GenderSelectionModal 
        modalVisible={genderModalVisible}
        setModalVisible={setGenderModalVisible}
        setGender={setGender}
        setIsChangeDetect = {setIsChangeDetect}
        isGender={true}
        />

        <GenderSelectionModal 
        modalVisible={MerriageModalVisible}
        setModalVisible={setMerriageModalVisible}
        setMarriageStatus={setMarriageStatus}
        setIsChangeDetect = {setIsChangeDetect}
        isGender={false}
        />

        <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              maximumDate={new Date()}
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
        />

      <Modal visible={showEmailModal} transparent animationType="fade">
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}
      >
        <View
          style={{
            width: '80%',
            backgroundColor: '#fff',
            borderRadius: 10,
            padding: 20,
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
            Enter Registered Email
          </Text>
          <TextInput
            style={{
              width: '100%',
              borderWidth: 1,
              borderColor: '#ccc',
              borderRadius: 5,
              padding: 10,
              color:'#2e2e2e',
              marginBottom: 10,
            }}
            value={userEmail}
            onChangeText={(text) => {
              setUserEmail(text);
              // if (error) setError('');
            }}
            placeholder="Email Address"
            keyboardType="email-address"
            autoCapitalize="none"
            maxLength={50}
          />
          {error.userEmail ? (
            <Text style={{ color: 'red', marginBottom: 10 }}>{error.userEmail}</Text>
          ) : null}
          {/* <FormBlueButton title={'Continue'} onPress={handleContinue} /> */}
          <TouchableOpacity
            style={{
              width:'80%',
              backgroundColor: '#4582e6',
              paddingVertical: 10,
              paddingHorizontal: 20,
              borderRadius: 5,
              justifyContent:'center',
              alignItems:'center',
              marginBottom: 10,
            }}
            onPress={handleContinue}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
    </ScrollView>
  )
}

export default Personal


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