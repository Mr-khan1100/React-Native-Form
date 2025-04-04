import React, { useContext } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { SafeAreaView } from 'react-native-safe-area-context';
import TopBar from '@components/TopBar';
import Personal from '@components/Personal';
import Work from '@components/Work';
import Documents from '@components/Documents';
import FormContext from '@context/FormContext';
import { StyleSheet } from 'react-native';
import { IMPORTANT, IMPORTANT_MESSAGE, PERSONAL, WORK, WORK_LOCKED } from '@constants/personalScreenConstants';
import { Alerts } from '@utils/helper';
import { DOCUMENT, DOCUMENT_LOCKED } from '@constants/workScreenConstant';

const Tab = createMaterialTopTabNavigator();

const AppNavigator = () => {
  const { initalUserDetails, isChangeDetect, isWorkChangeDetect } = useContext(FormContext);
  
  return (
    <SafeAreaView style={styles.safeAreaFlex}>
      <TopBar />
      <Tab.Navigator screenOptions={{ swipeEnabled: false }}>
        <Tab.Screen name={PERSONAL} component={Personal}  />
        <Tab.Screen 
          name={WORK} 
          component={Work} 
          options={{
            tabBarLabel: (!isChangeDetect && initalUserDetails.isPersonalDone) ? WORK : WORK_LOCKED,
          }}
          listeners={{
            tabPress: e => {
              if (!isChangeDetect && initalUserDetails.isPersonalDone) {
                return null;
              }
              e.preventDefault();
             Alerts(IMPORTANT, IMPORTANT_MESSAGE);
            },
          }}
        />
        <Tab.Screen 
          name={DOCUMENT}
          component={Documents}
          options={{
            tabBarLabel: (!isChangeDetect && !isWorkChangeDetect && initalUserDetails.isWorkDone) ? DOCUMENT : DOCUMENT_LOCKED,
          }}
          listeners={{
            tabPress: e => {
              if (!isChangeDetect && !isWorkChangeDetect && initalUserDetails.isWorkDone) {
                return null;
              }
               e.preventDefault();
               Alerts(IMPORTANT, IMPORTANT_MESSAGE);
            },
          }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
};
 const styles =  StyleSheet.create({
    safeAreaFlex :{
      flex: 1,
    },
 });

export default AppNavigator;
