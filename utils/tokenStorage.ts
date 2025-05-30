import { User } from '@/types/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

export class TokenStorage {
  private static readonly TOKEN_KEY = 'access_token';
  private static readonly USER_INFO_KEY = 'user_info';

  static async saveToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(this.TOKEN_KEY, token);
    } catch (error) {
      console.error('Error saving token:', error);
      throw error;
    }
  }

  static async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(this.TOKEN_KEY);
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }

  static async removeToken(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([this.TOKEN_KEY, this.USER_INFO_KEY]);
    } catch (error) {
      console.error('Error removing token:', error);
      throw error;
    }
  }

  static async saveUserInfo(userInfo: User): Promise<void> {
    try {
      await AsyncStorage.setItem(this.USER_INFO_KEY, JSON.stringify(userInfo));
    } catch (error) {
      console.error('Error saving user info:', error);
      throw error;
    }
  }

  static async getUserInfo(): Promise<User | null> {
    try {
      const userInfo = await AsyncStorage.getItem(this.USER_INFO_KEY);
      return userInfo ? JSON.parse(userInfo) : null;
    } catch (error) {
      console.error('Error getting user info:', error);
      return null;
    }
  }
}