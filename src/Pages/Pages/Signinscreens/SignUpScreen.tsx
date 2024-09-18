import { View, Text, Image, StyleSheet, useWindowDimensions, ScrollView, Alert } from 'react-native';
import React, { useState } from 'react';
import ImagePath from '../../../constant/ImagePath';
import CustomInput from '../../../components/LoginComponents/CustomInput';
import CustomButton from '../../../components/LoginComponents/CustomButton';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../constant/types';
import auth from '@react-native-firebase/auth';

// Define the navigation prop type for navigation
type Signup = StackNavigationProp<RootStackParamList, 'Signup'>;

// Function to check user role using Firebase custom claims
const checkUserRole = async () => {
  const user = auth().currentUser;

  if (user) {
    const idTokenResult = await user.getIdTokenResult();
    console.log('User role:', idTokenResult.claims.role);  // Logs the user role (department)
    return idTokenResult.claims.role;  // Return the role for further use
  }
  return null;  // Return null if no role is found
};

const SignUpScreen = () => {
  const [username, setusername] = useState('');
  const [password, setpassword] = useState('');

  // Initialize navigation
  const navigation = useNavigation<Signup>();
  const { height } = useWindowDimensions();

  // Function to handle sign-in process
  const onSignInPressed = async () => {
    console.warn('Signing in...');

    // Try signing the user in with their credentials
    const success = await SigningUserIn();

    if (success) {
      // After successful sign-in, check the user's role
      try {
        const role = await checkUserRole();  // Retrieve the user's role

        // Based on the role, navigate to the appropriate screen
        if (role === 'Surgery' || role === 'Cardiologist') {
          navigation.navigate('Selection');  // For surgeons or cardiologists
          console.log('Surgery')
        } else if (role === 'Anesthesiology') {
          navigation.navigate('plist');  // For anesthetists
          console.log('anesthetists')
        } else {
          navigation.navigate('Home');  // Default to Home if no specific role
          console.log('no specific role')
        }
      } catch (error) {
        console.error('Role check failed:', error);
      }
    }
  };

  // Function to handle forgotten password
  const onForgotPasswordPressed = () => {
    console.warn('Forgot password pressed');
    navigation.navigate('ForgotPasswordSreen');  // Navigate to Forgot Password Screen
  };

  // Stub functions for social sign-in
  const onSignInWithGooglePressed = () => console.warn('Sign in with Google pressed');
  const onSignInWithApplePressed = () => console.warn('Sign in with Apple pressed');
  const onSignInAnonymouslyPressed = () => console.warn('Sign in anonymously pressed');

  // Navigate to SignUp Screen when "Sign Up" is pressed
  const onSignUpPressed = () => {
    console.warn('Sign up pressed');
    navigation.navigate('CreateAcc');
  };

  // Function to sign the user in
  const SigningUserIn = async () => {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(username, password);
      console.log('User signed in successfully!');
      return true;  // Return true on success
    } catch (error) {
      // Handle errors during sign-in
      if (error instanceof Error) {
        const errorCode = (error as any).code;
        const errorMessage = error.message;

        console.error('Error code:', errorCode);
        console.error('Error message:', errorMessage);

        // Display appropriate alert based on error type
        switch (errorCode) {
          case 'auth/invalid-email':
            Alert.alert('Error', 'The email address is invalid.');
            break;
          case 'auth/user-not-found':
            Alert.alert('Error', 'User not found.');
            break;
          case 'auth/wrong-password':
            Alert.alert('Error', 'The password is incorrect.');
            break;
          case 'auth/invalid-credential':
            Alert.alert('Error', 'The supplied credentials are invalid.');
            break;
          default:
            Alert.alert('Error', 'An unknown error occurred.');
            break;
        }
      }
      return false;  // Return false if authentication fails
    }
  };

  return (
    <ScrollView>
      <View style={styles.root}>
        <Image 
          source={ImagePath.PGHlogo} 
          style={[styles.logo, { height: height * 0.15 }]} 
          resizeMode='contain'
        />

        {/* Username input */}
        <CustomInput 
          placeholder='Username'
          value={username}
          setValue={setusername}
          SecureText={false}
        />

        {/* Password input */}
        <CustomInput 
          placeholder='Password'
          value={password}
          setValue={setpassword}
          SecureText={true}
        />

        {/* Sign in button triggers the sign-in process */}
        <CustomButton text='Sign in' onPress={onSignInPressed} />

        {/* Forgot password button */}
        <CustomButton text='Forgot Password' onPress={onForgotPasswordPressed} type='TERTIARY' />

        {/* Social sign-in buttons */}
        <CustomButton text='Sign in with Google' onPress={onSignInWithGooglePressed} bgColor='#E7EAF4' fgColour='#4765A9' />
        <CustomButton text='Sign in with Apple' onPress={onSignInWithApplePressed} bgColor='#FAE9EA' fgColour='#DD4D44' />
        <CustomButton text='Sign in As Anonymous' onPress={onSignInAnonymouslyPressed} bgColor='#E3E3E3' fgColour='#363636' />

        {/* Sign up button */}
        <CustomButton text="Don't have an account? Create one" onPress={onSignUpPressed} type='TERTIARY' />
      </View>
    </ScrollView>
  );
};

// Styles
const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F9FBFC',
  },
  logo: {
    width: '70%',
    maxHeight: 200,
    maxWidth: 300,
    margin: 10,
  },
});

export default SignUpScreen;

