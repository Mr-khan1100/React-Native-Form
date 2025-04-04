import EncryptedStorage from 'react-native-encrypted-storage';

export const storeData = async (key, value) => {
  try {
    await EncryptedStorage.setItem(key, JSON.stringify(value));
    console.log('Data saved securely');
  } catch (error) {
    console.error('Failed to save data securely', error);
  }
};

export const getData = async (key) => {
  try {
    const result = await EncryptedStorage.getItem(key);
    return result ? JSON.parse(result) : null;
  } catch (error) {
    console.error('Failed to fetch data securely', error);
  }
};

export const removeData = async (key) => {
  try {
    await EncryptedStorage.removeItem(key);
    console.log('Data removed securely');
  } catch (error) {
    console.error('Failed to remove data securely', error);
  }
};
