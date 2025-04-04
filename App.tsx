import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { FormProvider } from '@context/FormContext';
import { persistor, store } from '@redux/store/EncryptedStorageEngine';

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
          <FormProvider>
            <AppNavigator />
          </FormProvider>
        </NavigationContainer>
      </PersistGate>
    </Provider>
        
  );
};

export default App;
