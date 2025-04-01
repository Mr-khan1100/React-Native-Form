import React, { useCallback, useContext, useEffect } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { SafeAreaView } from 'react-native-safe-area-context';
import TopBar from '../components/TopBar';
import Personal from '../components/Personal';
import Work from '../components/Work';
import Documents from '../components/Documents';
import { useNavigation } from '@react-navigation/native';
import FormContext from '../context/FormContext';
import { Alert, TouchableOpacity } from 'react-native';

const Tab = createMaterialTopTabNavigator();

const AppNavigator = () => {
  const { initalUserDetails, isChangeDetect, isWorkChangeDetect } = useContext(FormContext);
  console.log(isChangeDetect,'isChange');
  
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TopBar />
      <Tab.Navigator screenOptions={{ swipeEnabled: false }}>
        <Tab.Screen name="Personal" component={Personal}  />
        <Tab.Screen 
          name="Work" 
          component={Work} 
          options={{
            tabBarLabel: (!isChangeDetect && initalUserDetails.isPersonalDone) ? 'Work' : 'Work (Locked)',
          }}
          listeners={{
            tabPress: e => {
              if (!isChangeDetect && initalUserDetails.isPersonalDone) {
                // Allow navigation - do nothing
                return;
              }
              
              // Otherwise block navigation
              e.preventDefault();
              Alert.alert(
                'IMPORTANT',
                'Please fill all required fields, check no field is focused, or press blue button to save changes, and then proceed',
                [{ text: 'OK' }]
              );
            },
          }}
        />
        <Tab.Screen 
          name="Documents" 
          component={Documents}
          options={{
            tabBarLabel: (!isChangeDetect && !isWorkChangeDetect && initalUserDetails.isWorkDone) ? 'Document' : 'Document (Locked)',
          }}
          listeners={{
            tabPress: e => {
              if (!isChangeDetect && !isWorkChangeDetect && initalUserDetails.isWorkDone) {
                // Allow navigation - do nothing
                return;
              }
              // if(!initalUserDetails.isWorkDone){
               e.preventDefault(); // <-- this function blocks navigating to screen
               Alert.alert(
                'IMPORTANT',
                'Please fill all required fields, check no field is focused, or press blue button to save changes, and then proceed',
                [{ text: 'OK' }]
              );
              // }
            },
          }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

export default AppNavigator;
