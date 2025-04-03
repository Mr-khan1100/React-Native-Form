import { Alert, Linking, PermissionsAndroid, Platform } from "react-native";
// import { NativeModules } from 'react-native';


export const requestGalleryPermission = async () => {
    if (Platform.OS !== 'android') return true;
  
    try {
      if (Platform.Version >= 33) {
        const permissions = [
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
        ];
  
        const results = await PermissionsAndroid.requestMultiple(permissions);
        
        const granted = Object.values(results).every(
          result => result === PermissionsAndroid.RESULTS.GRANTED
        );
  
        if (!granted) {
          if (Object.values(results).includes('never_ask_again')) {
            Alert.alert(
              'Permission Required',
              'Please enable media access in app settings',
              [
                { text: 'Cancel' },
                { text: 'Open Settings', onPress: () => Linking.openSettings() },
              ]
            );
          }
          return false;
        }
        return true;
      }
  
      // Handle Android <13
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
  
    } catch (error) {
      console.error('Permission error:', error);
      return false;
    }
  };

