import React, { createContext, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { storeData } from '../services/storageService';

const FormContext = createContext();

const initialFormState = {
    fullName: '',
    email: '',
    dob: '',
    gender: '',
    phoneNumber: '',
    selectedCountry:{code : '+91', flag: '🇮🇳',initial:'IN', phoneLength: 10 },
    marriageStatus: '',
    address:'',
    occupation:'',
    company: '',
    startDate:'',
    endDate:'',
    officeAddress:'',
    isEndDateChecked:false,
    isAddressChecked:false,
    aadharFile:{name:'', type:'', uri:'', blob: ''},
    panFile:{name:'', type:'', uri:'', blob: ''},
    isPersonalDone:false,
    isWorkDone:false,
};

export const FormProvider = ({ children }) => {
  
  const [initalUserDetails, setInitialUserDetails] = useState(initialFormState);
  const [userDetails, setUserDetails] = useState(initialFormState);
  const [userEmail, setUserEmail] = useState('');
  const [isChangeDetect, setIsChangeDetect] = useState(false);
  const [isWorkChangeDetect, setIsWorkChangeDetect] = useState(false);
  // const [isPersonalDone, setIsPersonalDone] = useState(userDetails?.isPersonalDone || false);
  // const [isWorkDone, setIsWorkDone] = useState(userDetails?.isWordDone || false);
  const [isLoading, setIsLoading] = useState(false);

  const handleStore = async (updatedUserDetails) => {
        if (!userEmail) {
          console.error('Cannot save data: Email not set');
          return;
        }
      
        try {
          await storeData(userEmail, updatedUserDetails);
          // console.log('Data saved for:', initalUserDetails.email);
        } catch (error) {
          console.error('Save failed:', error);
        }
      };



  return (
    <FormContext.Provider value={{ 
        // isPersonalDone, 
        // setIsPersonalDone, 
        userDetails, 
        setUserDetails, 
        // isWorkDone, 
        // setIsWorkDone,
        setIsLoading,
        initalUserDetails,
        setInitialUserDetails,
        isChangeDetect,
        setIsChangeDetect,
        isWorkChangeDetect,
        setIsWorkChangeDetect,
        handleStore,
        userEmail,
        setUserEmail,
        }}>
            {isLoading ? (
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: 'rgba(255,255,255,0.8)',
            flex: 1,
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            justifyContent: 'center',
            height:'100%',
            width: '100%',
            zIndex: 20000,
          }}>
            <ActivityIndicator size={65} color="#348" />
          </View>
        ) : null}
      {children}
    </FormContext.Provider>
  );
};

export default FormContext;
