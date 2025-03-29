import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, ScrollView, Button, Alert } from 'react-native';
import React, { useContext, useState } from 'react';
import FormBlueButton from '../utils/FormBlueButton';
import DocumentInput from '../utils/DocumentInput';
import { pick, types  } from '@react-native-documents/picker'
import { requestGalleryPermission } from '../utils/AppHooks';
import { NativeModules } from 'react-native';
import RNFS from 'react-native-fs';
import ReactNativeBlobUtil from 'react-native-blob-util';
import { decode } from 'base-64'; 
import FormContext from '../context/FormContext';


const Documents = (props) => {
    const {userDetails, setUserDetails,setIsWorkDone} = useContext(FormContext);
    const [aadharFile, setAadharFile] = useState({name: userDetails.aadharFile?.name || '', type: userDetails.aadharFile?.type ||'', uri: userDetails.aadharFile?.uri || '', blob: userDetails.aadharFile?.blob || ''});
    const [panFile, setPanFile] = useState({name: userDetails.panFile?.name || '', type: userDetails.panFile?.type || '', uri: userDetails.panFile?.uri || '', blob: userDetails.panFile?.blob || ''});
    const [error, setError] = useState({Aadhar:'', PanCard:''});
    const { ManageExternalStorage } = NativeModules;
      
    const MAX_FILE_SIZE_MB = 2; // 2MB maximum
    const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
      // Check permission
      async function checkPermission() {
        const hasPermission = await ManageExternalStorage.hasPermission();
        console.log(hasPermission);
        
        if (!hasPermission) {
          requestPermission();
        }
      }
      
      // Request permission
      function requestPermission() {
        ManageExternalStorage.requestPermission();
      }


      const handleFileSelect = async (field) => {
        try {

          setError(prev => ({...prev, [field]: ''}));

          await checkPermission();
          const isPermitted = await requestGalleryPermission();
          if (!isPermitted) return;
    
          // Pick file(s) with allowed types
          const [pickResults] = await pick({
            mode: 'open',
            allowMultiSelection: false,
            allowVirtualFiles: true,
            type: [types.pdf, types.docx, types.images],
          });

          if (!pickResults) {
            throw new Error('No file selected');
          }
          // Ensure a file was picked
          if (pickResults) {
      
            console.log(pickResults ,'file');
            
            if (!pickResults.hasRequestedType) {
              console.log('Selected file format is not allowed');
              setError((prev) => ({ ...prev, [field]: 'Selected file format is not allowed.' }));
              // throw new Error('Invalid file format. Allowed formats: PDF, DOCX, Images');
              return 'Selected file format is not allowed';
            }
    
            if (pickResults.size > MAX_FILE_SIZE_BYTES) {
              setError((prev) => ({ ...prev, [field]: `File size exceeds ${MAX_FILE_SIZE_MB}MB limit` }));
              // throw new Error(`File size exceeds ${MAX_FILE_SIZE_MB}MB limit`);
              return `File size exceeds ${MAX_FILE_SIZE_MB}MB limit`;
            }
            console.log('1');

            const base64Data = await ReactNativeBlobUtil.fs.readFile(
              pickResults.uri, 
              'base64'
            );

            const blob = await ReactNativeBlobUtil.polyfill.Blob.build(base64Data, {
              type: pickResults.type + ';BASE64',
            });
          
            
            console.log('2',blob);
            
         
            return({
              success: true,
                data: {
                    name: pickResults.name,
                    type: pickResults.type,
                    uri: pickResults.uri,
                    blob: blob
                }
            });
    
            // console.log('Picked file:', file);
          }
        } catch (err) {
          console.error('Error picking file:', err);
          setError((prev) => ({ ...prev, [field]: `${field} is required` }));
          // Alert.alert('Message', `${err}`);
        }
      };

      const handleAadharSelection = async() =>{
        const result =  await handleFileSelect('Aadhar');
        console.log(result, 'result');
        if(result.success){
          setAadharFile({
            name: result.data.name,
            type: result.data.type,
            uri: result.data.uri,
            blob: result.data.blob
          });
          setError(prev => ({...prev, Aadhar: ''}));
        }
        

      }

      const handlePanSelection = async() =>{
        const result =  await handleFileSelect('PanCard');
        console.log(result, 'result');

        if(result.success){
          setPanFile({
            name: result.data.name,
            type: result.data.type,
            uri: result.data.uri,
            blob: result.data.blob

          });
          setError(prev => ({...prev, PanCard: ''}));
        }

      }

      const handleSubmit = () =>{
        const isAadharEmpty = Object.values(aadharFile).some(x => x === null || x === '');
        const isPanCardEmpty = Object.values(panFile).some(x => x === null || x === '');
        

        if(isAadharEmpty){
          setError(prev=> ({...prev, Aadhar:'Aadhar Card is required' }))
        } 
        if(isPanCardEmpty){
          setError(prev=> ({...prev, PanCard:'Pan Card is required' }))
        }
        if(!isAadharEmpty && !isPanCardEmpty){
          setUserDetails((prev) => ({...prev, 
            aadharFile: {
              ...prev.aadharFile, 
              name: aadharFile.name,
              type: aadharFile.type,
              uri: aadharFile.uri,
              blob: aadharFile.blob,
            },
            panFile: {
              ...prev.panFile, 
              name: panFile.name,
              type: panFile.type,
              uri: panFile.uri,
              blob: panFile.blob,
            },
          }))
          Alert.alert('Success', 'Form Submitted Successfully.')
        }
      }

  return (
    <View style={styles.container}>
        <DocumentInput 
          label={'Aadhaar*'}
          isFileUpload = {true} 
          value={aadharFile.name}
          iconSource={require('../../assets/Images/fileIcon.png')}  
          onPress={handleAadharSelection}   
          error={error.Aadhar}
        />

        <DocumentInput 
          label={'Pan Card*'}
          isFileUpload = {true} 
          value={panFile.name}
          iconSource={require('../../assets/Images/fileIcon.png')}  
          onPress={handlePanSelection}   
          error={error.PanCard}
        />
        <FormBlueButton title="SUBMIT" onPress={handleSubmit} />

    </View>
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

export default Documents