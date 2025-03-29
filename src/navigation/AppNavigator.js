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
  const { isPersonalDone, isWorkDone } = useContext(FormContext);
  console.log(isPersonalDone,'ispersonal');
  
  // const navigation = useNavigation();

  const LockedTabButton = (props) => {
    const { isPersonalDone } = useContext(FormContext);
    const { onPress, accessibilityState, style, children } = props;
  
    return (
      <TouchableOpacity
        style={style}
        onPress={() => {
          if (isPersonalDone) {
            
          } else {
            onPress();
          }
        }}
      >
        {children}
      </TouchableOpacity>
    );
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TopBar />
      <Tab.Navigator screenOptions={{ swipeEnabled: false }}>
        <Tab.Screen name="Personal" component={Personal}  />
        <Tab.Screen 
          name="Work" 
          component={Work} 
          options={{
            tabBarLabel: !isPersonalDone ? 'Work (Locked)' : 'Work',
          }}
          listeners={{
            tabPress: e => {
              if(!isPersonalDone){
               e.preventDefault(); // <-- this function blocks navigating to screen
               Alert.alert(
                'IMPORTANT',
                'Please fill all required field press blue button to save changes and proceed',
                [{ text: 'OK' }]
              );
              }
            },
          }}
        />
        <Tab.Screen 
          name="Documents" 
          component={Documents}
          options={{
            tabBarLabel: !isWorkDone ? 'Document (Locked)' : 'Document',
          }}
          listeners={{
            tabPress: e => {
              if(!isWorkDone){
               e.preventDefault(); // <-- this function blocks navigating to screen
               Alert.alert(
                'IMPORTANT',
                'Please fill all required field press blue button to save changes and proceed',
                [{ text: 'OK' }]
              );
              }
            },
          }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

export default AppNavigator;
