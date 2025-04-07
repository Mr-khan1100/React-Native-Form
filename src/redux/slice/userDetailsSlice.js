import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import EncryptedStorage from 'react-native-encrypted-storage';
import { EMAIL_ALREADY_REGISTERED, ERROR_UPDATING_EMAIL } from '@constants/personalScreenConstants';

const initialState = {
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

const userDetailsSlice = createSlice({
  name: 'userDetails',
  initialState,
  reducers: {
    initializeUser: (state, { payload }) => {
      return { ...initialState, ...payload, email: payload.email };
    },
    updateField: (state, { payload }) => {
      state[payload.field] = payload.value;
    },
    resetUser: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateUserEmail.fulfilled, (state, action) => {
        return { 
          ...initialState,
          ...action.payload, 
        };
      });
  },
});

export const updateUserEmail = createAsyncThunk(
  'user/updateEmail',
  async ({ oldEmail, newEmail }, { getState, rejectWithValue  }) => {
    try {

      const existingData = await EncryptedStorage.getItem(`user_${newEmail}`);
      if (existingData) {
        return rejectWithValue(EMAIL_ALREADY_REGISTERED);
      }

      const currentState = getState().userDetails;

      const updatedState = {
        ...currentState,
        email: newEmail,
      };

      await EncryptedStorage.setItem(
        `user_${newEmail}`,
        JSON.stringify(updatedState)
      );

      await EncryptedStorage.removeItem(`user_${oldEmail}`);

      return {
        ...updatedState,
        _persist: undefined,
      };
    } catch (error) {
      return rejectWithValue(ERROR_UPDATING_EMAIL);
    }
  }
);


export const loadOrCreateUser = async(email) => {
  try {
    console.log(email, 'entered email');
    
    let userData;
    const encryptedData = await EncryptedStorage.getItem(`user_${email}`);
    console.log(encryptedData, 'encryptedData');
    
    if(encryptedData) {
      userData = JSON.parse(encryptedData);
      console.log(userData, 'userData in load');
    } else {
      userData = { ...initialState, email };
      await EncryptedStorage.setItem(`user_${email}`, JSON.stringify(userData));
    }
    return userData;
  } catch (error) {
    console.error('Storage error:', error);
  }
};

export const {initializeUser, updateField, resetUser } = userDetailsSlice.actions;
export default userDetailsSlice.reducer;
