import React, { createContext, useState } from 'react';

const FormContext = createContext();

const initialFormState = {
    fullName: '',
    email: '',
    dob: '',
    gender: '',
    phoneNumber: '',
    selectedCountry:{code : '+91', flag: '🇮🇳', initial:'IN', phoneLength: 10 },
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
  const [userEmail, setUserEmail] = useState('');
  const [isChangeDetect, setIsChangeDetect] = useState(false);
  const [isWorkChangeDetect, setIsWorkChangeDetect] = useState(false);

  return (
    <FormContext.Provider value={{
        initalUserDetails,
        setInitialUserDetails,
        isChangeDetect,
        setIsChangeDetect,
        isWorkChangeDetect,
        setIsWorkChangeDetect,
        userEmail,
        setUserEmail,
        }}>
      {children}
    </FormContext.Provider>
  );
};

export default FormContext;
