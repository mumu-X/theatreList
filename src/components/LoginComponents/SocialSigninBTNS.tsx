import { View, Text } from 'react-native';
import React from 'react';
import CustomButton from './CustomButton';

const onSignInWithGooglePressed = ()=> {
    console.warn('onSignInWithGooglePressed');
};
const onSignInWithApplePressed = ()=> {
    console.warn('onSignInWithApplePressed');
};

const SocialSigninBTNS = () => {
  return (
    <>
     <CustomButton text="Sign in with Google" onPress={onSignInWithGooglePressed} bgColor="#E7EAF4" fgColour="#4765A9"/>
     <CustomButton text="Sign in with Apple" onPress={onSignInWithApplePressed} bgColor="#FAE9EA" fgColour="#DD4D44" />
    </>
  );
};

export default SocialSigninBTNS;
