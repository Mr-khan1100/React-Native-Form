import { View, StyleSheet } from 'react-native';
import React, { useContext, useState } from 'react';
import FormBlueButton from '@utils/FormBlueButton';
import DocumentInput from '@utils/DocumentInput';
import FileIcon from '@assets/fileIcon.png';
import { pick, types  } from '@react-native-documents/picker';
import { requestGalleryPermission } from '@utils/AppHooks';
import ReactNativeBlobUtil from 'react-native-blob-util';
import FormContext from '@context/FormContext';
import NetInfo from '@react-native-community/netinfo';
import { AADHAR, AADHAR_IS_REQUIRED, AADHAR_LABEL, CHECK_INTERNET_MESSAGE, FILE_SIZE_LIMIT, INVALID_FILE_FORMAT, MAX_FILE_SIZE_BYTES, NO_INTERNET, OPEN, PAN_CARD, PAN_CARD_IS_REQUIRED, PAN_CARD_LABEL, PERMISSION_DENIED, STORAGE_PERMISSION_REQUIRED, SUBMIT, SUCCESS, SUCCESS_MESSAGE } from '@constants/documentScreenConstant';
import { Alerts } from '@utils/helper';
import { useDispatch } from 'react-redux';
import { FIELDS } from '@constants/personalScreenConstants';
import { updateField } from '@redux/slice/userDetailsSlice';


const Documents = (props) => {
    const {initalUserDetails, setInitialUserDetails} = useContext(FormContext);
    const [error, setError] = useState({Aadhar:'', PanCard:''});
    const dispatch = useDispatch();
      const handleFileSelect = async (field) => {
        try {

          setError(prev => ({...prev, [field]: ''}));
          const isPermitted = await requestGalleryPermission();
          if (!isPermitted){
            Alerts(PERMISSION_DENIED, STORAGE_PERMISSION_REQUIRED);
            return;
          } 
          
          const [pickResults] = await pick({
            mode: OPEN,
            allowMultiSelection: false,
            allowVirtualFiles: true,
            type: [types.pdf, types.docx, types.images],
          });

          if (pickResults) {
            if (!pickResults.hasRequestedType) {
              return INVALID_FILE_FORMAT;
            }
    
            if (pickResults.size > MAX_FILE_SIZE_BYTES) {
              return FILE_SIZE_LIMIT;
            }
            const base64Data = await ReactNativeBlobUtil.fs.readFile(
              pickResults.uri, 
              'base64'
            );

            const blob = await ReactNativeBlobUtil.polyfill.Blob.build(base64Data, {
              type: pickResults.type + ';BASE64',
            });
          
            return({
              success: true,
                data: {
                    name: pickResults.name,
                    type: pickResults.type,
                    uri: pickResults.uri,
                    blob: blob,
                },
            });
          }
        } catch (err) {
          console.error('Error picking file:', err);
          return `${field} is required`;
        }
      };

      const handleAadharSelection = async() =>{
        const result =  await handleFileSelect(AADHAR);
        if(result.success){
          setError(prev => ({...prev, Aadhar: ''}));
          setInitialUserDetails(prev => ({...prev,
            aadharFile: {
              ...prev.aadharFile,
              name: result.data.name,
              type: result.data.type,
              uri: result.data.uri,
              blob: result.data.blob,
            },
          }));
          dispatch(updateField({ field: FIELDS.AADHAR_FILE , value: {
            name: result.data.name,
            type: result.data.type,
            uri: result.data.uri,
            blob: result.data.blob,
          } }));
        }
        else {
          setInitialUserDetails(prev => ({...prev,
            aadharFile: {
              ...prev.aadharFile,
              name: '',
              type: '',
              uri: '',
              blob: '',
            },
          }));
          setError(prev => ({ ...prev, Aadhar: result }));
        }

      };

      const handlePanSelection = async() =>{
        const result =  await handleFileSelect(PAN_CARD);

        if(result.success){
          setError(prev => ({...prev, PanCard: ''}));
          setInitialUserDetails(prev => ({...prev,
            panFile: {
              ...prev.panFile,
              name: result.data.name,
              type: result.data.type,
              uri: result.data.uri,
              blob: result.data.blob,
            },
          }));
          dispatch(updateField({ field: FIELDS.PAN_FILE , value: {
            name: result.data.name,
            type: result.data.type,
            uri: result.data.uri,
            blob: result.data.blob,
          } }));
        }
        else {
          setInitialUserDetails(prev => ({...prev,
            panFile: {
              ...prev.panFile,
              name: '',
              type: '',
              uri: '',
              blob: '',
            },
          }));
          setError(prev => ({ ...prev, PanCard: result }));
        }
      };

      const handleSubmit = async() =>{
        const isAadharEmpty = Object.values(initalUserDetails.aadharFile).some(x => x === null || x === '');
        const isPanCardEmpty = Object.values(initalUserDetails.panFile).some(x => x === null || x === '');
        

        if(isAadharEmpty){
          setError(prev=> ({...prev, Aadhar: AADHAR_IS_REQUIRED }));
        } 
        if(isPanCardEmpty){
          setError(prev=> ({...prev, PanCard: PAN_CARD_IS_REQUIRED }));
        }
        if(!isAadharEmpty && !isPanCardEmpty){
          const netState = await NetInfo.fetch();
          if (!netState.isConnected || !netState.isInternetReachable) {
            Alerts(NO_INTERNET, CHECK_INTERNET_MESSAGE);
            return;
          }
          Alerts(SUCCESS, SUCCESS_MESSAGE);
        }
      };

  return (
    <View style={styles.container}>
        <DocumentInput 
          label={AADHAR_LABEL}
          isFileUpload = {true} 
          value={initalUserDetails.aadharFile.name}
          iconSource={FileIcon}  
          onPress={handleAadharSelection}   
          error={error.Aadhar}
        />

        <DocumentInput 
          label={PAN_CARD_LABEL}
          isFileUpload = {true} 
          value={initalUserDetails.panFile.name}
          iconSource={FileIcon}  
          onPress={handlePanSelection}   
          error={error.PanCard}
        />
        <FormBlueButton title={SUBMIT} onPress={handleSubmit} />

    </View>
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
    fileInfo: {
      marginTop: 20,
      padding: 10,
      backgroundColor: '#e0e0e0',
      borderRadius: 8,
    },
    fileName: {
      fontSize: 16,
      color: '#333',
    },
  
  });

export default Documents;
