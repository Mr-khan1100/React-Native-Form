import React, { useContext } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import TopBar from '@components/TopBar';
import Personal from '@components/Personal';
import Work from '@components/Work';
import Documents from '@components/Documents';
import FormContext from '@context/FormContext';
import { StyleSheet } from 'react-native';
import { IMPORTANT, IMPORTANT_MESSAGE, PERSONAL, WORK } from '@constants/personalScreenConstants';
import { Alerts } from '@utils/helper';
import { DOCUMENT } from '@constants/workScreenConstant';
import { canAccessDocumentTab, canAccessWorkTab, getDocumentTabLabel, getWorkTabLabel } from '@utils/tabHelper';

const Tab = createMaterialTopTabNavigator();

const AppNavigator = () => {
  const { initalUserDetails, isChangeDetect, isWorkChangeDetect } = useContext(FormContext);
  
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeAreaFlex}>
        <TopBar />
        <Tab.Navigator screenOptions={{ swipeEnabled: false }}>
          <Tab.Screen name={PERSONAL} component={Personal}  />
          <Tab.Screen 
            name={WORK} 
            component={Work} 
            options={{
              tabBarLabel: getWorkTabLabel(isChangeDetect, initalUserDetails.isPersonalDone),
              
            }}
            listeners={{
              tabPress: e => {
                if (!canAccessWorkTab(isChangeDetect, initalUserDetails.isPersonalDone)) {
                  e.preventDefault();
                  Alerts(IMPORTANT, IMPORTANT_MESSAGE);
                }
              },
            }}
          />
          <Tab.Screen 
            name={DOCUMENT}
            component={Documents}
            options={{
              tabBarLabel: getDocumentTabLabel(isChangeDetect, isWorkChangeDetect, initalUserDetails.isWorkDone),
            }}
            listeners={{
              tabPress: e => {
                if (!canAccessDocumentTab(isChangeDetect, isWorkChangeDetect, initalUserDetails.isWorkDone)) {
                  e.preventDefault();
                  Alerts(IMPORTANT, IMPORTANT_MESSAGE);
                }
              },
            }}
          />
        </Tab.Navigator>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};
 const styles =  StyleSheet.create({
    safeAreaFlex :{
      flex: 1,
    },
 });

export default AppNavigator;
