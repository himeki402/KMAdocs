import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';

interface LoginFormProps {
  username: string;
  setUsername: (username: string) => void;
  password: string;
  setPassword: (password: string) => void;
  handleLogin: () => Promise<void>;
  errors: Partial<Record<keyof LoginFormData, string>>;
}

export interface LoginFormData {
  username: string;
  password: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  username,
  setUsername,
  password,
  setPassword,
  handleLogin,
  errors,
}) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Header with back button */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Đăng nhập</Text>
          </View>

          {/* Logo and app name */}
          <View style={styles.logoContainer}>
            <View style={styles.logoBox}>
              <Ionicons name="layers" size={28} color="#fff" />
            </View>
            <Text style={styles.appName}>KMA Document</Text>
            <Text style={styles.appDescription}>Hệ thống quản lý tài liệu</Text>
          </View>

          {/* Login form */}
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Tên đăng nhập</Text>
              <TextInput
                style={[styles.input, errors.username && styles.inputError]}
                placeholder="Nhập tên đăng nhập"
                value={username}
                onChangeText={setUsername}
              />
              {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>Mật khẩu</Text>
                <TouchableOpacity>
                  <Text style={styles.forgotPassword}>Quên mật khẩu?</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[styles.passwordInput, errors.password && styles.inputError]}
                  placeholder="Nhập mật khẩu"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={24} color="#777" />
                </TouchableOpacity>
              </View>
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            </View>

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Đăng nhập</Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>HOẶC TIẾP TỤC VỚI</Text>
              <View style={styles.divider} />
            </View>

            {/* Social login */}
            <TouchableOpacity style={styles.googleButton}>
              <View style={styles.googleIconContainer}>
                <Ionicons name="logo-google" size={20} color="#EA4335" />
              </View>
              <Text style={styles.googleButtonText}>Đăng nhập với Google</Text>
            </TouchableOpacity>

            {/* Register link */}
            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Chưa có tài khoản? </Text>
              <TouchableOpacity onPress={() => router.push('/register')}>
                <Text style={styles.registerLink}>Đăng ký ngay</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '500',
    marginLeft: 8,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoBox: {
    width: 60,
    height: 60,
    backgroundColor: '#EF4444',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  appName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  appDescription: {
    fontSize: 14,
    color: '#666',
  },
  formContainer: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  forgotPassword: {
    fontSize: 12,
    color: '#FF6600',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    height: 48,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    paddingRight: 50,
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
    top: 12,
  },
  loginButton: {
    height: 48,
    backgroundColor: '#000',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
    inputError: {
    borderColor: '#FF3333',
  },
  errorText: {
    color: '#FF3333',
    fontSize: 12,
    marginTop: 4,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  dividerText: {
    paddingHorizontal: 8,
    fontSize: 12,
    color: '#666',
  },
  googleButton: {
    height: 48,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  googleIconContainer: {
    marginRight: 8,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  registerText: {
    fontSize: 14,
    color: '#333',
  },
  registerLink: {
    fontSize: 14,
    color: '#FF6600',
    fontWeight: '500',
  },
  testButton: {
    height: 48,
    backgroundColor: '#555',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  testButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});