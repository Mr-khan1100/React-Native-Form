import { StyleSheet, ScrollView } from 'react-native';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import InputFields from '@utils/InputFields';
import CustomCheckbox from '@utils/CustomCheckbox ';
import FormBlueButton from '@utils/FormBlueButton';
import FormContext from '@context/FormContext';
import Calender from '@assets/date_input.png';
import { useFocusEffect } from '@react-navigation/native';
import { ATLEAST_ONE_APLHABET, COMPANY_ALPHABET_REGEX, COMPANY_IS_REQUIRED, COMPANY_LABEL, COMPANY_LENGTH, COMPANY_PLACEHOLDER, DOCUMENT, END_DATE, END_DATE_LABEL, END_DATE_PLACEHOLDER, END_DATE_REQUIRED, INVALID_OCCUPATION_CHARACTER, IS_AFTER_DOB, IS_AFTER_STARTDATE, IS_BEFORE_ENDDATE, MUST_HAVE_ALPHABET_REGEX, OCCUPATION_IS_REQUIRED, OCCUPATION_LABEL, OCCUPATION_LENGTH, OCCUPATION_PLACEHOLDER, OCCUPATION_REGEX, OFFICE_ADDRESS_LABEL, OFFICE_ADDRESS_PLACEHOLDER, REMOTE, START_DATE, START_DATE_LABEL, START_DATE_PLACEHOLDER, START_DATE_REQUIRED } from '@constants/workScreenConstant';
import { ADDRESS_IS_REQUIRED, ADDRESS_REGEX, CURRENTLY_WORKING, DATE, DEFAULT, FIELDS, FUTURE_DATE, INVALID_ADDRESS, INVALID_DATE, MISSING_INFO, NEXT, NEXT_BUTTON_ALERT_MESSAGE, PHONE_PAD } from '@constants/personalScreenConstants';
import { Alerts, formatDate, handleDateChange, isDateInFuture, isValidDate } from '@utils/helper';
import { useDispatch } from 'react-redux';
import { updateField } from '@redux/slice/userDetailsSlice';

const Work = (props) => {
    const {initalUserDetails, setInitialUserDetails, setIsWorkChangeDetect} = useContext(FormContext);
    const [currentField, setCurrentField] = useState('');
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isFocus, setIsFocus] = useState(false);
    const [error, setError] = useState({occupation:'', company:'', startDate:'', endDate:'', address:''});
    const isCurrentlyWorking = useRef(false);
    const isRemote = useRef(false);
    const dispatch = useDispatch();

    useFocusEffect(
      useCallback(() => {
        const hasNoErrors = Object.values(error).every(err => err === '');
        if(!isFocus && hasNoErrors){
          setIsWorkChangeDetect(false);
        }
      }, [isFocus, error, setIsWorkChangeDetect]) 
    );
    
    const validateOccupation = () => {
        const trimmedOccupation = initalUserDetails.occupation.trim();
        const occupationRegex = OCCUPATION_REGEX;

    
        if(!trimmedOccupation){
            setError((prev) => ({ ...prev, occupation: OCCUPATION_IS_REQUIRED }));
          return OCCUPATION_IS_REQUIRED;
        }

        if (trimmedOccupation.length < 4) {
          setError((prev) => ({ ...prev, occupation: OCCUPATION_LENGTH }));
          return OCCUPATION_LENGTH;
        }
        if (!occupationRegex.test(trimmedOccupation)) {
          setError((prev) => ({
            ...prev,
            occupation: INVALID_OCCUPATION_CHARACTER,
          }));
          return INVALID_OCCUPATION_CHARACTER;
        }

        const hasAlphabet = MUST_HAVE_ALPHABET_REGEX.test(trimmedOccupation);
        if (!hasAlphabet) {
            setError((prev) => ({ ...prev, occupation: ATLEAST_ONE_APLHABET}));
          return ATLEAST_ONE_APLHABET;
        }
    
        setError((prev) => ({ ...prev, occupation: '' }));
        setIsFocus(false);
        dispatch(updateField({ field: FIELDS.OCCUPATION , value: trimmedOccupation }));
        return '';
    };

    const validateCompany = () => {
        const trimmedCompany = initalUserDetails.company?.trim();
        const  companyRegex = OCCUPATION_REGEX;
    
        if(!trimmedCompany){
            setError((prev) => ({ ...prev, company: COMPANY_IS_REQUIRED }));
          return COMPANY_IS_REQUIRED;
        }

        if (trimmedCompany.length < 3) {
            setError((prev) => ({ ...prev, company: COMPANY_LENGTH }));
          return COMPANY_LENGTH;
        }

        
        if (!companyRegex.test(trimmedCompany)) {
            setError((prev) => ({ ...prev, company: INVALID_OCCUPATION_CHARACTER }));
          return INVALID_OCCUPATION_CHARACTER;
        }

        const hasAlphabet = MUST_HAVE_ALPHABET_REGEX.test(trimmedCompany);
        if (!hasAlphabet) {
            setError((prev) => ({ ...prev, company: COMPANY_ALPHABET_REGEX }));
          return COMPANY_ALPHABET_REGEX;
        }
        setError((prev) => ({ ...prev, company: '' }));
        setIsFocus(false);
        dispatch(updateField({ field: FIELDS.COMPANY , value: trimmedCompany }));
        return '';
    };

    const validateStartDate = (jobStartDate) =>{
        if (!jobStartDate) {
          setError((prev) => ({ ...prev, startDate: START_DATE_REQUIRED }));
            return START_DATE_REQUIRED;
          } 
          
        else if (!isValidDate(jobStartDate)) {
          setError((prev) => ({ ...prev, startDate: INVALID_DATE }));
           return INVALID_DATE;
          } 
        else if (isDateInFuture(jobStartDate)) {
          setError((prev) => ({ ...prev, startDate: FUTURE_DATE }));
            return FUTURE_DATE;
          }
        else if(isBeforeEndDate(jobStartDate)) {
            setError((prev) => ({ ...prev, startDate: IS_BEFORE_ENDDATE }));
            return IS_BEFORE_ENDDATE;
          }
        else if(isAfterDob(jobStartDate)){
            setError((prev) => ({ ...prev, startDate: IS_AFTER_DOB }));
            return IS_AFTER_DOB;
          }
        setIsFocus(false);
        setError((prev) => ({ ...prev, startDate: '' }));
        dispatch(updateField({ field: FIELDS.START_DATE , value: jobStartDate }));
        return '';
          
      
    };

    const validateEndDate = (jobEndDate) =>{
        if(!initalUserDetails.isEndDateChecked){
            if (!jobEndDate) {
            setError((prev) => ({ ...prev, endDate: END_DATE_REQUIRED }));
                return END_DATE_REQUIRED;
            } else if (!isValidDate(jobEndDate)) {
            setError((prev) => ({ ...prev, endDate: INVALID_DATE }));
                return INVALID_DATE;
            } else if (isDateInFuture(jobEndDate)) {
            setError((prev) => ({ ...prev, endDate: FUTURE_DATE }));
                return FUTURE_DATE;
            }else if(isAfterStartDate(jobEndDate)) {
                setError((prev) => ({ ...prev, endDate: IS_AFTER_STARTDATE }));
                return IS_AFTER_STARTDATE;
            }else if(isAfterDob(jobEndDate)){
                setError((prev) => ({ ...prev, endDate: IS_AFTER_DOB }));
                return IS_AFTER_DOB;
            }
        }
        setIsFocus(false);
        setError((prev) => ({ ...prev, endDate: '' }));
        dispatch(updateField({ field: FIELDS.END_DATE , value: jobEndDate }));
        return '';
    };


    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };
    
    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (selectedDate) => {
        const formattedDate = formatDate(selectedDate);
        if (currentField === START_DATE) {
            setError(prev => ({...prev, startDate: ''}));
            setIsWorkChangeDetect(true);
            setInitialUserDetails(prev => ({...prev, startDate : formattedDate}));
            hideDatePicker();
            validateStartDate(formattedDate);
          } else if (currentField === END_DATE) {
            setError(prev => ({...prev, endDate: ''}));
            setIsWorkChangeDetect(true);
            setInitialUserDetails(prev => ({...prev, endDate : formattedDate}));
            hideDatePicker();
            validateEndDate(formattedDate);
        }
        hideDatePicker();
    };

    const isBeforeEndDate = dateString => {
        if (initalUserDetails.endDate === CURRENTLY_WORKING || initalUserDetails.endDate === '') {
            return false;
        }

        const [day, month, year] = dateString.split('/').map(Number);
        const startdate = new Date(year, month - 1, day);
        const [endDay, endMonth, endYear] = initalUserDetails.endDate.split('/').map(Number);
        const enddate = new Date(endYear, endMonth - 1, endDay);
        return startdate > enddate;
      };

    const isAfterStartDate = dateString => {

        if (initalUserDetails.startDate === '') {
            return false;
        }
        if(dateString === CURRENTLY_WORKING) {
          return false;
      }

        const [day, month, year] = dateString.split('/').map(Number);
        const enddate = new Date(year, month - 1, day);
        const [endDay, endMonth, endYear] = initalUserDetails.startDate.split('/').map(Number);
        const startdate = new Date(endYear, endMonth - 1, endDay);
        return startdate > enddate;
      };

    const isAfterDob = dateString => {
      if (!initalUserDetails.dob) {
        return false;
      }
      if(dateString === CURRENTLY_WORKING) {
        return false;
    }
      
      const [day, month, year] = dateString.split('/').map(Number);
      const dateToCheck = new Date(year, month - 1, day);
    
      if (initalUserDetails.dob) {
        const [sDay, sMonth, sYear] = initalUserDetails.dob.split('/').map(Number);
        const dobDateObj = new Date(sYear, sMonth - 1, sDay);
        return dateToCheck <= dobDateObj;
      }
      return false;
    };

    const validateDateChange = (text) => {
        const formattedText = handleDateChange(text);
        setInitialUserDetails(prev => ({...prev, startDate : formattedText}));
        setIsWorkChangeDetect(true);
    };
    
    const validateEndDateChange = (text) => {
        const formattedText = handleDateChange(text);
        setInitialUserDetails(prev => ({...prev, endDate : formattedText}));
        setIsWorkChangeDetect(true);

    };

    const validateAddress = () => {
        const trimmedAddress = initalUserDetails.officeAddress.trim();
        const addressRegex = ADDRESS_REGEX;
        if(!initalUserDetails.isAddressChecked){
            if(!trimmedAddress){
                setError((prev) => ({ ...prev, address: ADDRESS_IS_REQUIRED }));
                return ADDRESS_IS_REQUIRED;
            }    
            if (!addressRegex.test(trimmedAddress)) {
                setError((prev) => ({ ...prev, address: INVALID_ADDRESS }));
              return INVALID_ADDRESS;
            }
        }
        
        setError((prev) => ({ ...prev, address: '' }));
        setIsFocus(false);
        dispatch(updateField({ field: FIELDS.OFFICE_ADDRESS , value: trimmedAddress }));
        return '';
    };
    

  const handleEnDateCheck = () => {
    const newIsEndChecked = !initalUserDetails.isEndDateChecked;
    const newEndDate = newIsEndChecked ? CURRENTLY_WORKING : '';
    isCurrentlyWorking.current = true;
    setIsWorkChangeDetect(true);
    setInitialUserDetails(prev => ({
      ...prev,
      isEndDateChecked: newIsEndChecked,
      endDate: newEndDate,
    }));
    dispatch(updateField({ field: FIELDS.IS_END_DATE_CHECKED , value: newIsEndChecked }));
    dispatch(updateField({ field: FIELDS.END_DATE , value: newEndDate }));

  };

  
    useEffect(() => {
      if (isCurrentlyWorking.current) {
          isCurrentlyWorking.current = false; 
          validateEndDate(initalUserDetails.endDate);
        }
    }, [initalUserDetails.endDate]);

  const handleAddressCheck = () => {
      const newIsChecked = !initalUserDetails.isAddressChecked;
      const newOfficeAddress = newIsChecked ? REMOTE : '';
      setIsWorkChangeDetect(true);
      isRemote.current = true;
      setInitialUserDetails(prev => ({
        ...prev,
        isAddressChecked: newIsChecked,
        officeAddress: newOfficeAddress,
      }));
      dispatch(updateField({ field: FIELDS.IS_ADDRESS_CHECKED , value: newIsChecked }));
      dispatch(updateField({ field: FIELDS.OFFICE_ADDRESS , value: newOfficeAddress }));
  };
  
  
  useEffect(() => {
    if (isRemote.current) {
        isRemote.current = false; 
        validateAddress();
      }
  }, [initalUserDetails.officeAddress]);
  

  
  const handleNextPress = async () => {
    const newErrors = {
        occupation: validateOccupation(), 
        company: validateCompany(), 
        startDate: validateStartDate(initalUserDetails.startDate), 
        endDate: validateEndDate(initalUserDetails.endDate), 
        address: validateAddress(),
    };
 
    setError(newErrors);
  
  console.log(newErrors);
  
    const hasError = Object.values(newErrors).some(err => err !== '');
    if (hasError) {
        Alerts(MISSING_INFO, NEXT_BUTTON_ALERT_MESSAGE);
      return;
    }else{

      setIsWorkChangeDetect(false);
      setInitialUserDetails(prev => ({...prev, isPersonalDone:true}));
      dispatch(updateField({ field: FIELDS.IS_WORK_DONE , value: true }));
      props.navigation.navigate(DOCUMENT);
    }
  };

  return (
    <ScrollView style={styles.container}>
       <InputFields 
            label={OCCUPATION_LABEL} 
            value={initalUserDetails.occupation} 
            keyboardType={DEFAULT}
            onFocus={() => {
              setError(prev => ({...prev, occupation: ''})); 
              setIsFocus(true);
            }} 
            onBlur={()=> validateOccupation()}
            onChangeText={(text) => {setInitialUserDetails(prev => ({...prev, occupation:text})); setIsWorkChangeDetect(true);}}
            editable={true}
            maxLength={25}
            placeholder={OCCUPATION_PLACEHOLDER}
            error={error.occupation}
        />

        <InputFields 
            label={COMPANY_LABEL} 
            value={initalUserDetails.company}
            keyboardType={DEFAULT}
            onFocus={() => {setError(prev => ({...prev, company: ''})); setIsFocus(true);}}
            onBlur={()=> validateCompany()}
            onChangeText={(text) => {setInitialUserDetails(prev => ({...prev, company:text})); setIsWorkChangeDetect(true);}}
            editable={true}
            maxLength={30}
            placeholder={COMPANY_PLACEHOLDER}
            error={error.company}
        />

        <InputFields 
            label={START_DATE_LABEL} 
            value={initalUserDetails.startDate} 
            keyboardType={PHONE_PAD}
            onFocus={() => {setError(prev => ({...prev, startDate: ''})); setIsFocus(true);}}
            onBlur={()=> validateStartDate(initalUserDetails.startDate)}
            onChangeText={text => validateDateChange(text)}
            onIconPress={() => {
                setCurrentField(START_DATE);
                showDatePicker();
              }}
            iconSource={Calender}
            editable={true}
            placeholder={START_DATE_PLACEHOLDER}
            error={error.startDate}
        />

        <InputFields 
            label={END_DATE_LABEL} 
            value={initalUserDetails.endDate} 
            keyboardType={PHONE_PAD}
            onFocus={() => {setError(prev => ({...prev, endDate: ''})); setIsFocus(true);}}
            onBlur={()=> validateEndDate(initalUserDetails.endDate)}
            onChangeText={text => validateEndDateChange(text)}
            onIconPress={() => {
                setCurrentField(END_DATE);
                showDatePicker();
              }}
            isDisabled={initalUserDetails.isEndDateChecked}
            iconSource={Calender}
            editable={initalUserDetails.isEndDateChecked ? false : true}
            placeholder={END_DATE_PLACEHOLDER}
            error={error.endDate}
        />
        <CustomCheckbox
        isChecked={initalUserDetails.isEndDateChecked}
        onPress={handleEnDateCheck}
        label={CURRENTLY_WORKING}
        />


        <InputFields 
            label={OFFICE_ADDRESS_LABEL} 
            value={initalUserDetails.officeAddress} 
            keyboardType={DEFAULT}
            onFocus={() => {setError(prev => ({...prev, address: ''})); setIsFocus(true);}}
            onBlur={()=> validateAddress()}
            onChangeText={(text) => {
                setInitialUserDetails(prev => ({...prev, officeAddress:text}));
                setIsWorkChangeDetect(true);
              }}
            editable={initalUserDetails.isAddressChecked ? false : true}
            maxLength={150}
            placeholder={OFFICE_ADDRESS_PLACEHOLDER}
            error={error.address}
        />
        <CustomCheckbox
        isChecked={initalUserDetails.isAddressChecked}
        onPress={handleAddressCheck}
        label={REMOTE}
        />


        <FormBlueButton title={NEXT} onPress={handleNextPress} />

        <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode={DATE}
              maximumDate={new Date()}
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
        />
    </ScrollView>
  );
};

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
  
  });

export default Work;
