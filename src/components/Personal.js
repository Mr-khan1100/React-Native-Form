import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Modal } from 'react-native';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import  GenderSelectionModal  from '../utils/GenderModal';
import PhoneNumberInput from '../utils/PhoneNumberInput';
import FormBlueButton from '../utils/FormBlueButton';
import InputFields from '../utils/InputFields';
import FormContext from '../context/FormContext';
import CalenderIcon from '../../assets/Images/date_input.png';
import DropDownIcon from '../../assets/Images/DropDownIcon.png';
import { getData, removeData, storeData } from '../services/storageService';
import { useFocusEffect } from '@react-navigation/native';
import { ADDRESS_IS_REQUIRED, ADDRESS_LABEL, ADDRESS_PLACEHOLDER, ADDRESS_REGEX, CURRENTLY_WORKING, DATE, DEFAULT, DOB_LABEL, DOB_PLACEHOLDER, DOB_REQUIRED, DOB_VALIDATE_WTIH_WORK_EXPERIENCE, EMAIL_ADDRESS, EMAIL_ALREADY_REGISTERED, EMAIL_IS_REQUIRED, EMAIL_LABEL, EMAIL_PLACEHOLDER, EMAIL_REGEX, ERROR_GETTING_USERDETAIL, ERROR_UPDATING_EMAIL, FADE, FULL_NAME_REQUIRED, FUTURE_DATE, GENDER_LABEL, GENDER_PLACEHOLDER, INVALID_ADDRESS, INVALID_DATE, INVALID_EMAIL, MARRIAGE_LABEL, MARRIAGE_PLACEHOLDER, MISSING_INFO, NAME_IS_REQUIRED, NAME_LABEL, NAME_LENGTH, NAME_ONLY_ALPHABETS, NAME_PLACEHOLDER, NEXT, NEXT_BUTTON_ALERT_MESSAGE, PHONE_NUMBER_REQUIRED, PHONE_PAD, SOMETHING_WENT_WRONG, WORK } from '../constants/personalScreenConstants';
import { Alerts, countryValidations, formatDate, handleDateChange, isDateInFuture, isValidDate } from '../utils/helper';

const Personal = (props) => {
    const {userDetails, setUserDetails, setIsChangeDetect,  initalUserDetails, setInitialUserDetails, handleStore, userEmail, setUserEmail} = useContext(FormContext);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [genderModalVisible, setGenderModalVisible] = useState(false);
    const [MerriageModalVisible, setMerriageModalVisible] = useState(false);
    const [showEmailModal, setShowEmailModal] = useState(true);
    const [isFocus, setIsFocus] = useState(false);
    const [error, setError] = useState({name:'', email:'', dob:'', gender:'', phoneNumber:'', marriage:'', address:'',userEmail:''});

    useEffect(() => {
      setShowEmailModal(true);
    }, []);

    useFocusEffect(
      useCallback(() => {
        const hasNoErrors = Object.values(error).every(err => err === '');
        if(!isFocus && hasNoErrors){
          setIsChangeDetect(false);
        }
      }, [isFocus, error, setIsChangeDetect]) 
    );

    const validateName = () => {
      // console.log(NAME_IS_REQUIRED);
      
        const trimmedName = initalUserDetails.fullName.trim();
        const nameParts = trimmedName.split(/\s+/);
        const nameRegex = /^[a-zA-Z]+$/;
        if(!trimmedName){
            setError((prev) => ({ ...prev, name: NAME_IS_REQUIRED }));
          return NAME_IS_REQUIRED;
        }
        else if (trimmedName.length < 4) {
          setError((prev) => ({ ...prev, name: NAME_LENGTH }));
          return NAME_LENGTH;
        }
        else if (nameParts.length < 3) {
          setError((prev) => ({
            ...prev,
            name: FULL_NAME_REQUIRED,
          }));
          return  FULL_NAME_REQUIRED;
        }
       else  if (!nameParts.every((part) => nameRegex.test(part))) {
          setError((prev) => ({
            ...prev,
            name: NAME_ONLY_ALPHABETS,
          }));
          return NAME_ONLY_ALPHABETS;
        }
        else{
          setIsFocus(false);
          setError((prev) => ({ ...prev, name: '' }));
          setUserDetails((prev) => {
            const updatedDetails = { ...prev, fullName: trimmedName };
              handleStore(updatedDetails);
              return updatedDetails;
          });
          return '';
        }
      };

    const validateEmail = async() => {
        const emailRegex = EMAIL_REGEX;
        const newEmail = initalUserDetails.email.trim();
        if (!newEmail) {
          setError((prev) => ({ ...prev, email: EMAIL_IS_REQUIRED }));
          return EMAIL_IS_REQUIRED;
        } else if (!emailRegex.test(newEmail)) {
          setError((prev) => ({ ...prev, email: INVALID_EMAIL}));
          return INVALID_EMAIL;
        }
        try {
            if (newEmail !== userEmail) {
              const existingDataWithNewEmail = await getData(newEmail);
        
            if (existingDataWithNewEmail) {
              setError((prev) => ({ 
                ...prev, 
                email: EMAIL_ALREADY_REGISTERED,
              }));

              return EMAIL_ALREADY_REGISTERED;
            }
            setError((prev) => ({ ...prev, email: '' }));

            const existingData = await getData(userEmail);

            await storeData(newEmail, existingData || { ...initalUserDetails, email: newEmail });

            if (existingData){
              await removeData(userEmail);
            } 

            setUserEmail(newEmail);
            setUserDetails(prev => ({ ...prev, email: newEmail }));
            setInitialUserDetails(prev => ({ ...prev, email: newEmail }));
            await storeData(newEmail, { ...userDetails, email: newEmail });

            setIsFocus(false);
          } else {
            const updatedDetails = { ...userDetails, email: newEmail };
            await handleStore(updatedDetails);
            setUserDetails(updatedDetails);
            setIsFocus(false);
          }
        } catch (err) {
          setError((prev) => ({ ...prev, email: ERROR_UPDATING_EMAIL }));
          return ERROR_UPDATING_EMAIL;
        }
        return '';
      };

    const validateDob = (dob) =>{
        if (!dob) {
          setError((prev) => ({ ...prev, dob: DOB_REQUIRED }));
            return DOB_REQUIRED;
          } else if (!isValidDate(dob)) {
          setError((prev) => ({ ...prev, dob: INVALID_DATE }));
           return INVALID_DATE;
          } else if (isDateInFuture(dob)) {
          setError((prev) => ({ ...prev, dob: FUTURE_DATE }));
            return FUTURE_DATE;
          }else if(isBeforeStartAndEndDate(dob)){
          setError((prev) => ({ ...prev, dob: DOB_VALIDATE_WTIH_WORK_EXPERIENCE }));
            return DOB_VALIDATE_WTIH_WORK_EXPERIENCE;
          }

        setError((prev) => ({ ...prev, dob: '' }));
        setUserDetails((prev) => {
          const updatedDetails = { ...prev, dob: dob };
            handleStore(updatedDetails);
            return updatedDetails;
        });
        setIsFocus(false);
        return '';
      };


    const isBeforeStartAndEndDate = dateString => {
      if (!initalUserDetails.startDate && !initalUserDetails.endDate) {
        return false;
      }

      const [day, month, year] = dateString.split('/').map(Number);
      const dateToCheck = new Date(year, month - 1, day);

      if (initalUserDetails.startDate) {
        const [sDay, sMonth, sYear] = initalUserDetails.startDate.split('/').map(Number);
        const startDateObj = new Date(sYear, sMonth - 1, sDay);
        return dateToCheck >= startDateObj;
      }
      if (initalUserDetails.endDate && initalUserDetails.endDate !== CURRENTLY_WORKING) {
        const [eDay, eMonth, eYear] = initalUserDetails.endDate.split('/').map(Number);
        const endDateObj = new Date(eYear, eMonth - 1, eDay);
        return dateToCheck >= endDateObj;

      }
      return false;
    };

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = selectedDate => {
        const formattedDate = formatDate(selectedDate);
        setError(prev => ({...prev, dob: ''}));
        setIsChangeDetect(true);
        setInitialUserDetails(prev => ({...prev, dob : formattedDate}));
        hideDatePicker();
        validateDob(formattedDate);
    };

    const validatePhoneNumber = () => {
        const cleanedNumber = initalUserDetails.phoneNumber?.replace(/\D/g, '');
        const validation = countryValidations[initalUserDetails.selectedCountry.initial];
        if(!cleanedNumber){
            setError(prev => ({
                ...prev,
                phoneNumber: PHONE_NUMBER_REQUIRED}));
            return  PHONE_NUMBER_REQUIRED;
        }
        if(cleanedNumber.length !== initalUserDetails.selectedCountry.phoneLength) {
          setError(prev => ({
            ...prev,
            phoneNumber: `Phone number must be ${initalUserDetails.selectedCountry.phoneLength} digits`,
          }));
          return `Phone number must be ${initalUserDetails.selectedCountry.phoneLength} digits`;
        } 
        if(validation && !validation.regex.test(cleanedNumber)){
            setError(prev => ({
                ...prev,
                phoneNumber: validation.error,
              }));
              return validation.error;
        } else{
        setIsFocus(false);
          setError(prev => ({ ...prev, phoneNumber: '' }));
          setUserDetails((prev) => {
            const updatedDetails = { ...prev, phoneNumber: cleanedNumber };
              handleStore(updatedDetails);
              return updatedDetails;
          });
          setUserDetails((prev) => {
            const updatedDetails = { ...prev,  selectedCountry: initalUserDetails.selectedCountry };
              handleStore(updatedDetails);
              return updatedDetails;
          });
          return '';
        }
    };
    
    const handlePhoneNumberChange = (text) => {
        const cleanedNumber = text.replace(/\D/g, '');
        setInitialUserDetails(prev => ({...prev, phoneNumber:cleanedNumber}));
        setIsChangeDetect(true);
    };


    const validateAddress = () => {
        const trimmedAddress = initalUserDetails.address.trim();
        const addressRegex = ADDRESS_REGEX;

        if(!trimmedAddress){
            setError((prev) => ({ ...prev, address: ADDRESS_IS_REQUIRED }));
            return ADDRESS_IS_REQUIRED;
        }    
        if (!addressRegex.test(trimmedAddress)) {
            setError((prev) => ({ ...prev, address: INVALID_ADDRESS }));
            return INVALID_ADDRESS;
        }
        
        setError((prev) => ({ ...prev, address: '' }));
        setIsFocus(false);
        setUserDetails((prev) => {
          const updatedDetails = { ...prev, address: trimmedAddress };
            handleStore(updatedDetails);
            return updatedDetails;
        });
        return '';
      };

 

    const handleNextPress = async () => {
        const newErrors = {
          name: validateName(),
          email: await validateEmail(),
          dob: validateDob(initalUserDetails.dob),
          phoneNumber: validatePhoneNumber(),
          address: validateAddress(),
        };
        setError(newErrors);
        const hasError = Object.values(newErrors).some(err => err !== '');
        
        if (hasError) {
          Alerts(MISSING_INFO, NEXT_BUTTON_ALERT_MESSAGE);
          return;
        }else{
          setIsChangeDetect(false);
          setInitialUserDetails(prev => ({...prev, isPersonalDone:true}));
          setUserDetails((prev) => {
            const updatedDetails = { ...prev, isPersonalDone:true};
              handleStore(updatedDetails);
              return updatedDetails;
          });
          props.navigation.navigate(WORK);

        }
    };


    const handleContinue = async () => {
      if (!userEmail) {
        setError((prev) => ({ ...prev, userEmail: EMAIL_IS_REQUIRED }));
        return;
      } else if (!EMAIL_REGEX.test(userEmail)) {
        setError((prev) => ({ ...prev, userEmail: INVALID_EMAIL }));
        return;
      }
    
      try {
        const existingData = await getData(userEmail);
        
        if (existingData) {
          setUserDetails(prev => ({
            ...prev, 
            ...existingData, 
            email: userEmail,
          }));
          setInitialUserDetails(prev => ({
            ...prev, 
            ...existingData, 
            email: userEmail,
          }));
          
          
        } else {
          const newUser = {
            ...initalUserDetails,
            email: userEmail,
          };
          setInitialUserDetails(newUser);
          await storeData(userEmail, newUser);
        }
        
        setShowEmailModal(false);
        setError((prev) => ({ ...prev, userEmail: '' }));
      } catch (err) {
        Alerts(SOMETHING_WENT_WRONG, ERROR_GETTING_USERDETAIL);
      }
    };

    
  return (
    <ScrollView style={styles.container}>
       <InputFields 
            label={NAME_LABEL} 
            value={initalUserDetails.fullName} 
            keyboardType={DEFAULT}
            onFocus={() => {
              setError(prev => ({...prev, name: ''})); 
              setIsFocus(true);
            }} 
            onBlur={()=> validateName()}
            onChangeText={(text) => {
              setInitialUserDetails(prev => ({...prev, fullName:text}));
              setIsChangeDetect(true);
            }}
            editable={true}
            maxLength={50}
            placeholder={NAME_PLACEHOLDER}
            error={error.name}
        />

        <InputFields 
            label={EMAIL_LABEL} 
            value={initalUserDetails.email} 
            keyboardType={EMAIL_ADDRESS}
            onFocus={() => {setError(prev => ({...prev, email: ''})); setIsFocus(true);}} 
            onBlur={async()=> await validateEmail()}
            onChangeText={(text) => {
              setInitialUserDetails(prev => ({...prev, email:text.toLowerCase()}));
              setIsChangeDetect(true);
            }}
            maxLength={50}
            editable={true}
            placeholder={EMAIL_PLACEHOLDER}
            error={error.email}
        />

        <InputFields 
            label={DOB_LABEL} 
            value={initalUserDetails.dob} 
            keyboardType={PHONE_PAD}
            onFocus={() => {setError(prev => ({...prev, dob: ''})); setIsFocus(true);}} 
            onBlur={()=> validateDob(initalUserDetails.dob)}
            onChangeText={text => {
                const formattedText = handleDateChange(text);
                setInitialUserDetails(prev => ({...prev, dob:formattedText}));
                setIsChangeDetect(true);
              }}
            onIconPress={showDatePicker}
            iconSource={CalenderIcon}
            editable={true}
            placeholder={DOB_PLACEHOLDER}
            error={error.dob}
        />

        <InputFields 
            label={GENDER_LABEL} 
            value={initalUserDetails.gender} 
            keyboardType={DEFAULT}
            onIconPress={() => setGenderModalVisible(true)}
            iconSource={DropDownIcon}
            editable={false}
            placeholder={GENDER_PLACEHOLDER}
            error={error.gender}
        />

        <PhoneNumberInput
            phoneNumber={initalUserDetails.phoneNumber}
            onBlur={validatePhoneNumber}
            onChangeText={handlePhoneNumberChange}
            onFocus={() => {setError(prev => ({...prev, phoneNumber: ''})); setIsFocus(true);}}
            error={error.phoneNumber}
        />

        <InputFields 
            label={MARRIAGE_LABEL} 
            value={initalUserDetails.marriageStatus} 
            keyboardType={DEFAULT}
            onIconPress={() => setMerriageModalVisible(true)}
            iconSource={DropDownIcon}
            editable={false}
            placeholder={MARRIAGE_PLACEHOLDER}
            error={error.marriage}
        />

        <InputFields 
            label={ADDRESS_LABEL} 
            value={initalUserDetails.address} 
            keyboardType={DEFAULT}
            onFocus={() => {setError(prev => ({...prev, address: ''})); setIsFocus(true);}} 
            onBlur={()=> validateAddress()}
            onChangeText={(text) => {setInitialUserDetails(prev => ({...prev, address:text})); setIsChangeDetect(true);}}
            editable={true}
            maxLength={150}
            placeholder={ADDRESS_PLACEHOLDER}
            error={error.address}
        />

        <FormBlueButton title={NEXT} onPress={handleNextPress} />

        <GenderSelectionModal 
        modalVisible={genderModalVisible}
        setModalVisible={setGenderModalVisible}
        handleStore={handleStore}
        isGender={true}
        />

        <GenderSelectionModal 
        modalVisible={MerriageModalVisible}
        setModalVisible={setMerriageModalVisible}
        handleStore={handleStore}
        isGender={false}
        />

        <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode={DATE}
              maximumDate={new Date()}
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
        />

      <Modal visible={showEmailModal} transparent animationType={FADE}>
      <View
        style={styles.modalView}
      >
        <View
          style={styles.modalContainer}
        >
          <Text style={styles.modalHeader}>
            Enter Registered Email
          </Text>
          <TextInput
            style={styles.modalInput}
            value={userEmail}
            onChangeText={(text) => {
              setUserEmail(text.toLowerCase());
            }}
            placeholder={EMAIL_PLACEHOLDER}
            keyboardType={EMAIL_ADDRESS}
            autoCapitalize="none"
            maxLength={50}
          />
          {error.userEmail ? (
            <Text style={styles.userEmailErrorText}>{error.userEmail}</Text>
          ) : null}
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
          >
            <Text style={styles.continueText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
    </ScrollView>
  );
};

export default Personal;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  button:{
    height:50,
    display:'flex',
  },
  modalView:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer : {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalHeader :{
    fontSize: 18, 
    fontWeight: 'bold', 
    marginBottom: 10,
  },
  modalInput:{
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    color:'#2e2e2e',
    marginBottom: 10,
  },
  userEmailErrorText :{
    color: 'red', 
    marginBottom: 10,
  },
  continueButton:{
    width:'80%',
    backgroundColor: '#4582e6',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    justifyContent:'center',
    alignItems:'center',
    marginBottom: 10,
  },
  continueText:{ 
    color: '#fff', 
    fontWeight: 'bold', 
  },
});
