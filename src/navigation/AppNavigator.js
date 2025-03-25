import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { SafeAreaView } from 'react-native-safe-area-context';
import TopBar from '../components/TopBar';
import Personal from '../components/Personal';
import Work from '../components/Work';
import Documents from '../components/Documents';

const Tab = createMaterialTopTabNavigator();

const AppNavigator = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TopBar />
      <Tab.Navigator screenOptions={{ swipeEnabled: false }}>
        <Tab.Screen name="Personal" component={Personal}  />
        <Tab.Screen name="Work" component={Work} />
        <Tab.Screen name="Documents" component={Documents}   />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

export default AppNavigator;
