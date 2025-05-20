import React from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { AuthFormProps } from '../types';

const AuthForm: React.FC<AuthFormProps> = ({
  username,
  setUsername,
  password,
  setPassword,
  isRegistering,
  handleSubmit,
  toggleMode,
  handleAuthenticatedRequest,
  handleLogout,
}) => {
  return (
    <View style={{ flex: 1, padding: 20, justifyContent: 'center' }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>
        {isRegistering ? 'Register' : 'Login'}
      </Text>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />
      <Button
        title={isRegistering ? 'Register' : 'Login'}
        onPress={handleSubmit}
        disabled={!username || !password}
      />
      <Button
        title={`Switch to ${isRegistering ? 'Login' : 'Register'}`}
        onPress={toggleMode}
      />
      <Button
        title="Make Authenticated Request"
        onPress={() => handleAuthenticatedRequest('/protected')}
      />
      <Button
        title="Logout"
        onPress={handleLogout}
      />
    </View>
  );
};

export default AuthForm;