import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import {
  Text,
  SafeAreaView,
  Alert,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  View,
} from 'react-native';

import { useAuth } from './_contexts/AuthContext';
import { auth } from '../utils/firebase';

import type { AuthButtonProps } from '~/types/AuthButton';
import type { AuthenticateUserProps } from '~/types/AuthenticateUser';
import type { EmailInputProps } from '~/types/EmailInput';
import type { PasswordInputProps } from '~/types/PasswordInput';

const BUTTON_TEXTS = {
  login: 'Login',
  signUp: 'Sign Up',
  loggingIn: 'Logging in...',
  registering: 'Registering...',
  alreadyHaveAccount: 'Already have an account? Login',
  dontHaveAccount: 'Don’t have an account? Sign up',
  successMessage: 'Registration completed successfully. Please login now.',
  errorMessage: 'An error occurred while trying to authenticate',
};

const EmailInput = ({ email, setEmail }: EmailInputProps) => (
  <View className="mb-4">
    <TextInput
      className="h-12 rounded-md border border-gray-300 px-4"
      placeholder="Email"
      value={email}
      onChangeText={setEmail}
      keyboardType="email-address"
      autoCapitalize="none"
    />
  </View>
);

const PasswordInput = ({
  password,
  setPassword,
  showPassword,
  setShowPassword,
}: PasswordInputProps) => (
  <View className="relative mb-6">
    <TextInput
      className="h-12 rounded-md border border-gray-300 px-4"
      placeholder="Password"
      value={password}
      onChangeText={setPassword}
      secureTextEntry={!showPassword}
    />
    <TouchableOpacity
      className="absolute right-4 top-3"
      onPress={() => setShowPassword(!showPassword)}>
      <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={24} color="gray" />
    </TouchableOpacity>
  </View>
);

const AuthButton = ({ isLoading, isSignUp, onPress }: AuthButtonProps) => (
  <TouchableOpacity
    className={`mb-4 rounded-md py-3 ${isLoading ? 'bg-zinc-950' : 'bg-zinc-900'}`}
    onPress={onPress}
    disabled={isLoading}>
    <Text className="text-center text-lg font-semibold text-white">
      {isLoading
        ? isSignUp
          ? BUTTON_TEXTS.registering
          : BUTTON_TEXTS.loggingIn
        : isSignUp
          ? BUTTON_TEXTS.signUp
          : BUTTON_TEXTS.login}
    </Text>
  </TouchableOpacity>
);

export default function Index() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuthError = (message: string) => {
    console.error(message);
    Alert.alert('Error', BUTTON_TEXTS.errorMessage);
  };

  const authenticateUser = async (authFunction: AuthenticateUserProps) => {
    setIsLoading(true);
    try {
      const userCredential = await authFunction(auth, email, password);
      login(userCredential);
      router.push('/(tabs)');
    } catch (error) {
      if (error instanceof Error) {
        handleAuthError(error.message);
      } else {
        handleAuthError(String(error));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = () => authenticateUser(signInWithEmailAndPassword);
  const signUp = () => authenticateUser(createUserWithEmailAndPassword);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 justify-center">
        <View className="px-8">
          <Text className="py-4 text-center text-3xl font-bold">
            {isSignUp ? BUTTON_TEXTS.signUp : BUTTON_TEXTS.login}
          </Text>

          <EmailInput email={email} setEmail={setEmail} />
          <PasswordInput
            password={password}
            setPassword={setPassword}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
          />
          <AuthButton
            isLoading={isLoading}
            isSignUp={isSignUp}
            onPress={isSignUp ? signUp : signIn}
          />

          <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
            <Text className="text-center">
              {isSignUp ? BUTTON_TEXTS.alreadyHaveAccount : BUTTON_TEXTS.dontHaveAccount}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
