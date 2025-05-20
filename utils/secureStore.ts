import * as SecureStore from 'expo-secure-store';

export const saveToSecureStore = async (key: string, value: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync(key, value);
  } catch (error) {
    throw new Error(`Failed to save ${key}: ${(error as Error).message}`);
  }
};

export const getFromSecureStore = async (key: string): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(key);
  } catch (error) {
    throw new Error(`Failed to get ${key}: ${(error as Error).message}`);
  }
};

export const removeFromSecureStore = async (key: string): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch (error) {
    throw new Error(`Failed to remove ${key}: ${(error as Error).message}`);
  }
};