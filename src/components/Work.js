import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, ScrollView, Button, Alert } from 'react-native';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import InputFields from '../utils/InputFields';
import CustomCheckbox from '../utils/CustomCheckbox ';
import FormBlueButton from '../utils/FormBlueButton';
import FormContext from '../context/FormContext';
import { storeData } from '../services/storageService';
import { useFocusEffect } from '@react-navigation/native';

const Work = (props) => {
    const {userDetails, setUserDetails,setIsWorkDone, initalUserDetails, setInitialUserDetails, setIsWorkChangeDetect, handleStore, isWorkChangeDetect} = useContext(FormContext);
    // const [occupation, setOccupation] = useState(userDetails?.occupation || '');
    // const [company, setCompany] = useState(userDetails?.company || '');
    // const [startDate, setStartDate] = useState(userDetails?.startDate || '');
    // const [endDate, setEndDate] = useState(userDetails?.endDate || '');
    const [currentField, setCurrentField] = useState('');
    // const [officeAddress, setOfficeAddress] = useState(userDetails?.officeAddress || '');
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    // const [isEndDateChecked, setIsEndDateChecked] = useState(userDetails?.isEndDateChecked || false);
    // const [isAddressChecked, setIsAddressChecked] = useState(userDetails?.isAddressChecked || false);
    // const [isChangeDetect, setIsChangeDetect] = useState(false);
    
    const [isFocus, setIsFocus] = useState(false);
    const [error, setError] = useState({occupation:'', company:'', startDate:'', endDate:'', address:''});

    useFocusEffect(
      useCallback(() => {
        const hasNoErrors = Object.values(error).every(err => err === '');
        if(!isFocus && hasNoErrors){
        console.log('focus here');
        
          setIsWorkChangeDetect(false);
        }
        return () => {
         
          console.log('Screen unfocused - cleanup');
        };
      }, [isFocus, error ]) 
    );
    
    const validateOccupation = () => {
      setIsFocus(false);
      console.log('came here');
      
        const trimmedOccupation = initalUserDetails.occupation.trim();
        const nameRegex = /^[a-zA-Z0-9&.,\-\s]+$/;

    
        if(!trimmedOccupation){
            setError((prev) => ({ ...prev, occupation: 'Occupation is required' }));
          return 'Occupation is required';
        }

        if (trimmedOccupation.length < 4) {
          setError((prev) => ({ ...prev, occupation: 'Occupation must be at least 4 characters long.' }));
          return 'Occupation must be at least 4 characters long.';
        }
    
        // const nameRegex = /^[a-zA-Z]+$/;
        if (!nameRegex.test(trimmedOccupation)) {
          setError((prev) => ({
            ...prev,
            occupation: 'Invalid characters used. Only letters, numbers, spaces, &, ., and - are allowed.',
          }));
          return 'Invalid characters used. Only letters, numbers, spaces, &, ., and - are allowed.';
        }

        const hasAlphabet = /[a-zA-Z]/.test(trimmedOccupation);
        if (!hasAlphabet) {
            setError((prev) => ({ ...prev, occupation: 'Occupation name must contain at least one letter.' }));
          return 'Occupation name must contain at least one letter.';
        }
    
        setError((prev) => ({ ...prev, occupation: '' }));
        setUserDetails((prev) => {
          const updatedDetails = { ...prev, occupation: trimmedOccupation };
            handleStore(updatedDetails);
            return updatedDetails;
        });
        return '';
    };

    const validateCompany = () => {
      setIsFocus(false);
      console.log('came to compnay');
      
        const trimmedCompany = initalUserDetails.company?.trim();
        const nameRegex = /^[a-zA-Z0-9&.,\-\s]+$/;
    
        if(!trimmedCompany){
      console.log('came to compnay 1');

            setError((prev) => ({ ...prev, company: 'Company is required' }));
          return 'Company is required';
        }

        if (trimmedCompany.length < 3) {
      console.log('came to compnay 2');

            setError((prev) => ({ ...prev, company: 'Company name must be between 3 and 50 characters.' }));
          return 'Company name must be between 3 and 50 characters.';
        }

        
        if (!nameRegex.test(trimmedCompany)) {
      console.log('came to compnay 3');
          
            setError((prev) => ({ ...prev, company: 'Invalid characters used. Only letters, numbers, spaces, &, ., and - are allowed.' }));
          return 'Invalid characters used. Only letters, numbers, spaces, &, ., and - are allowed.';
        }

        const hasAlphabet = /[a-zA-Z]/.test(trimmedCompany);
        if (!hasAlphabet) {

      console.log('came to compnay 4');

            setError((prev) => ({ ...prev, company: 'Company name must contain at least one letter.' }));
          return 'Company name must contain at least one letter.';
        }
      console.log('came to compnay 5');


        setError((prev) => ({ ...prev, company: '' }));
        setUserDetails((prev) => {
          const updatedDetails = { ...prev, company: trimmedCompany };
            handleStore(updatedDetails);
            return updatedDetails;
        });
        return '';
    };

    const validateStartDate = (jobStartDate) =>{
      setIsFocus(false);
      console.log('1');
      
        if (!jobStartDate) {
          setError((prev) => ({ ...prev, startDate: 'Start date is required.' }));
            return 'Start date is required.';
          } 
          
        else if (!isValidDate(jobStartDate)) {
      console.log('2');

          setError((prev) => ({ ...prev, startDate: 'Date must be in this format. (dd/mm/yyyy) & year less than 1900' }));
           return 'Date must be in this format. (dd/mm/yyyy) & year less than 1900';
          } 
        else if (isDateInFuture(jobStartDate)) {
      console.log('3');

          setError((prev) => ({ ...prev, startDate: 'Date must be today or earlier.' }));
            return 'Date must be today or earlier.';
          }
        else if(isBeforeEndDate(jobStartDate)) {
      console.log('4');

            setError((prev) => ({ ...prev, startDate: 'Start date must be less than EndDate' }));
            return 'Start date must be less than EndDate';
          }
        else if(isAfterDob(jobStartDate)){
      console.log('5');

            setError((prev) => ({ ...prev, startDate: 'Start date must be greater than dob' }));
            return 'Start date must be greater than dob';
          }
      console.log('6');
      setIsFocus(false);
        setError((prev) => ({ ...prev, startDate: '' }));
        setUserDetails((prev) => {
          const updatedDetails = { ...prev, startDate: jobStartDate };
            handleStore(updatedDetails);
            return updatedDetails;
        });
        return '';
          
      
    };

    const validateEndDate = (jobEndDate) =>{
      setIsFocus(false);
        if(!initalUserDetails.isEndDateChecked){
            if (!jobEndDate) {
            setError((prev) => ({ ...prev, endDate: 'End date is required.' }));
                return 'End date is required.';
            } else if (!isValidDate(jobEndDate)) {
            setError((prev) => ({ ...prev, endDate: 'Date must be in this format. (dd/mm/yyyy) & year less than 1900' }));
                return 'Date must be in this format. (dd/mm/yyyy) & year less than 1900';
            } else if (isDateInFuture(jobEndDate)) {
            setError((prev) => ({ ...prev, endDate: 'Date must be today or earlier.' }));
                return 'Date must be today or earlier.';
            }else if(isAfterStartDate(jobEndDate)) {
                setError((prev) => ({ ...prev, endDate: 'End date must be greater than start Date' }));
                return 'End date must be greater than start Date';
            }else if(isAfterDob(jobEndDate)){
                setError((prev) => ({ ...prev, endDate: 'End date must be greater than dob' }));
                return 'End date must be greater than dob';
            }
        }
        setIsFocus(false);
        setError((prev) => ({ ...prev, endDate: '' }));
        setUserDetails((prev) => {
          const updatedDetails = { ...prev, endDate: jobEndDate };
            handleStore(updatedDetails);
            return updatedDetails;
        });
        return '';
    }


    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };
    
    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (selectedDate) => {
        // setStartDate(formatDate(selectedDate));
        console.log(currentField,'current field');
        const formattedDate = formatDate(selectedDate);
        if (currentField === 'startDate') {
            setError(prev => ({...prev, startDate: ''}));
            setIsWorkChangeDetect(true);
            setInitialUserDetails(prev => ({...prev, startDate : formattedDate}));
            hideDatePicker();
            validateStartDate(formattedDate);
          } else if (currentField === 'endDate') {
            setError(prev => ({...prev, endDate: ''}));
            setIsWorkChangeDetect(true);
            setInitialUserDetails(prev => ({...prev, endDate : formattedDate}));
            hideDatePicker();
            validateEndDate(formattedDate);
        }
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
        if(date === 'Currently Working') {
            return false;
        }
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
      if(dateString === 'Currently Working') {
        return false;
    }
        const [day, month, year] = dateString.split('/').map(Number);
        const date = new Date(year, month - 1, day);
        const today = new Date();
        return date > today;
    };

    const isBeforeEndDate = dateString => {
        if (initalUserDetails.endDate === 'Currently Working' || initalUserDetails.endDate === '') {
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
        if(dateString === 'Currently Working') {
          return false;
      }

        const [day, month, year] = dateString.split('/').map(Number);
        const enddate = new Date(year, month - 1, day);
        const [endDay, endMonth, endYear] = initalUserDetails.startDate.split('/').map(Number);
        const startdate = new Date(endYear, endMonth - 1, endDay);
        return startdate > enddate;
      };

    const isAfterDob = dateString => {
      // If neither startDate nor endDate exists, nothing to validate
      if (!initalUserDetails.dob) {
        return false;
      }
      if(dateString === 'Currently Working') {
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
        // console.log(text,'text');
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
        // setStartDate(formattedText);
        setInitialUserDetails(prev => ({...prev, startDate : formattedText}));
        setIsWorkChangeDetect(true);
    };
    
    const validateEndDateChange = (text) => {
        console.log(text,'text');
        let sanitizedText = text?.replace(/[^0-9]/g, '');
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
        setInitialUserDetails(prev => ({...prev, endDate : formattedText}));
        setIsWorkChangeDetect(true);

    };

    const validateAddress = () => {
      // console.log('came to validate address', initalUserDetails);
      
        setIsFocus(false);
        const trimmedAddress = initalUserDetails.officeAddress.trim();
        console.log(trimmedAddress, 'trimmedAdress');
        
        const addressRegex = /^[a-zA-Z0-9&.,\-\s]+$/;
        if(!initalUserDetails.isAddressChecked){
            if(!trimmedAddress){
                setError((prev) => ({ ...prev, address: 'Address is required' }));
                return 'Address is required';
            }    
            if (!addressRegex.test(trimmedAddress)) {
                setError((prev) => ({ ...prev, address: 'Invalid characters used. Only letters, numbers, spaces, &, ., and - are allowed.' }));
              return 'Invalid characters used. Only letters, numbers, spaces, &, ., and - are allowed.';
            }
        }
        
        setError((prev) => ({ ...prev, address: '' }));
        setUserDetails((prev) => {
          const updatedDetails = { ...prev, officeAddress: trimmedAddress };
            handleStore(updatedDetails);
            return updatedDetails;
        });
        return '';
    };

    const isCurrentlyWorking = useRef(false);
    const isRemote = useRef(false);

    

  const handleEnDateCheck = () => {
    const newIsEndChecked = !initalUserDetails.isEndDateChecked;
    const newEndDate = newIsEndChecked ? 'Currently Working' : '';
    isCurrentlyWorking.current = true;
    setIsWorkChangeDetect(true);
    // console.log(newIsChecked, newOfficeAddress, 'inside handle Address');
    
  setInitialUserDetails(prev => ({
     ...prev,
     isEndDateChecked: newIsEndChecked,
     endDate: newEndDate,
    }));
   
    setUserDetails(userPrev => {
      const updatedDetails = {
        ...userPrev,
        isEndDateChecked: newIsEndChecked,
        endDate: newEndDate,
      };
      
      handleStore(updatedDetails);
      return updatedDetails;
    });
  };

  
    useEffect(() => {
      if (isCurrentlyWorking.current) {
          isCurrentlyWorking.current = false; 
          // if (initalUserDetails.endDate) {
            console.log('here to check useEffect');
            
              validateEndDate(initalUserDetails.endDate);
          // }
      }
    }, [initalUserDetails.endDate]);

  const handleAddressCheck = () => {
    // Use functional update to get latest state for initialUserDetails
      const newIsChecked = !initalUserDetails.isAddressChecked;
      const newOfficeAddress = newIsChecked ? 'Remote' : '';
      setIsWorkChangeDetect(true);
      isRemote.current = true;
      console.log(newIsChecked, newOfficeAddress, 'inside handle Address');
      
    setInitialUserDetails(prev => ({
       ...prev,
        isAddressChecked: newIsChecked,
        officeAddress: newOfficeAddress,
      }));
     

      setUserDetails(userPrev => {
        const updatedDetails = {
          ...userPrev,
          isAddressChecked: newIsChecked,
          officeAddress: newOfficeAddress,
        };

        // validateAddress(newOfficeAddress);
        
        handleStore(updatedDetails);
        return updatedDetails;
      });
      
  };
  
  
  useEffect(() => {
    if (isRemote.current) {
        isRemote.current = false; 
        // if (initalUserDetails.endDate) {
          console.log('here to check useEffect');
          
            validateAddress();
        // }
    }
  }, [initalUserDetails.officeAddress]);
  

  
  const handleNextPress = async () => {
        console.log('now first ');
        
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
    console.log('now where');
    
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

      setIsWorkChangeDetect(false);
      // setIsWorkDone(true);
      setInitialUserDetails(prev => ({...prev, isWorkDone:true}));
      setUserDetails((prev) => {
        const updatedDetails = { ...prev, isWorkDone:true};
          handleStore(updatedDetails);
          return updatedDetails;
      });
      props.navigation.navigate('Documents');
      console.log('here');
    }
  };

  return (
    <ScrollView style={styles.container}>
       <InputFields 
            label={'Occupation*'} 
            value={initalUserDetails.occupation} 
            keyboardType={'default'}
            onFocus={() => {setError(prev => ({...prev, occupation: ''})); setIsFocus(true);}} 
            onBlur={()=> validateOccupation()}
            // onChangeText={setFullName}
            onChangeText={(text) => {setInitialUserDetails(prev => ({...prev, occupation:text})); setIsWorkChangeDetect(true);}}
            editable={true}
            maxLength={25}
            placeholder={'Enter Occupation eg:(Engineer/Doctor/Business...)'}
            error={error.occupation}
        />

        <InputFields 
            label={'Company Name*'} 
            value={initalUserDetails.company}
            keyboardType={'defualt'}
            onFocus={() => {setError(prev => ({...prev, company: ''})); setIsFocus(true);}}
            onBlur={()=> validateCompany()}
            onChangeText={(text) => {setInitialUserDetails(prev => ({...prev, company:text})); setIsWorkChangeDetect(true);}}
            editable={true}
            maxLength={30}
            placeholder={'Enter Company Name'}
            error={error.company}
        />

        <InputFields 
            label={'Start Date*'} 
            value={initalUserDetails.startDate} 
            keyboardType={'phone-pad'}
            onFocus={() => {setError(prev => ({...prev, startDate: ''})); setIsFocus(true);}}
            onBlur={()=> validateStartDate(initalUserDetails.startDate)}
            onChangeText={text => validateDateChange(text)}
            onIconPress={() => {
                setCurrentField('startDate');
                showDatePicker();
              }}
            iconSource={require('../../assets/Images/date_input.png')}
            editable={true}
            placeholder={'Enter start date(dd/mm/yyyy).'}
            error={error.startDate}
        />

        <InputFields 
            label={'EndDate Date*'} 
            value={initalUserDetails.endDate} 
            keyboardType={'phone-pad'}
            onFocus={() => {setError(prev => ({...prev, endDate: ''})); setIsFocus(true);}}
            onBlur={()=> validateEndDate(initalUserDetails.endDate)}
            onChangeText={text => validateEndDateChange(text)}
            onIconPress={() => {
                setCurrentField('endDate');
                showDatePicker();
              }}
            isDisabled={initalUserDetails.isEndDateChecked}
            iconSource={require('../../assets/Images/date_input.png')}
            editable={initalUserDetails.isEndDateChecked ? false : true}
            placeholder={initalUserDetails.isEndDateChecked ? 'Currently Working' : 'Enter end date(dd/mm/yyyy)'}
            error={error.endDate}
        />
        <CustomCheckbox
        isChecked={initalUserDetails.isEndDateChecked}
        onPress={handleEnDateCheck}
        label="Currently Working"
        />


        <InputFields 
            label={'Office Address*'} 
            value={initalUserDetails.officeAddress} 
            keyboardType={'default'}
            onFocus={() => {setError(prev => ({...prev, address: ''})); setIsFocus(true);}}
            onBlur={()=> validateAddress()}
            // onChangeText={setAddress}
            onChangeText={(text) => {
                // if (text.length > 150) {
                //   setError(prev => ({ ...prev, address: 'Address cannot exceed more than 150 characters remove 1 character' }));
                // } else {
                //   setError(prev => ({ ...prev, address: '' }));
                // }
                // setOfficeAddress(text);
                // setIsChangeDetect(true);
                setInitialUserDetails(prev => ({...prev, officeAddress:text}));
                setIsWorkChangeDetect(true);
              }}
            editable={initalUserDetails.isAddressChecked ? false : true}
            maxLength={150}
            placeholder={'Enter Full Address'}
            error={error.address}
        />
        <CustomCheckbox
        isChecked={initalUserDetails.isAddressChecked}
        onPress={handleAddressCheck}
        label="Remote"
        />


        <FormBlueButton title="NEXT" onPress={handleNextPress} />

        <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              maximumDate={new Date()}
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
        />
    </ScrollView>
  );
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

export default Work;
