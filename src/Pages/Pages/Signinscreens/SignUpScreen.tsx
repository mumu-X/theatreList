import { View, Text, Image, StyleSheet, useWindowDimensions, ScrollView } from 'react-native';
import React, { useState } from 'react';
import ImagePath from '../../../constant/ImagePath';
import CustomInput from '../../../components/LoginComponents/CustomInput';
import CustomButton from '../../../components/LoginComponents/CustomButton';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../constant/types'

type Signup = StackNavigationProp<RootStackParamList, 'Signup'>;

const SignUpScreen = () => {

    const [username,setusername]=useState('');
    const [password,setpassword]=useState('');

    const onSignInPressed = ()=> {
        console.warn('Sign in')

         // validate User

         navigation.navigate('Home')
    }
    const onForgotPasswordPressed = ()=> {
        console.warn('onForgotPasswordPressed')
        navigation.navigate('ForgotPasswordSreen')
    }
    const onSignInWithGooglePressed = ()=> {
        console.warn('onSignInWithGooglePressed')
    }
    const onSignInWithApplePressed = ()=> {
        console.warn('onSignInWithApplePressed')
    }
    const onSignInAnonymouslyPressed = ()=> {
        console.warn('onSignInAnonymouslyPressed')
    }
    const onSignUpPressed = ()=> {
        console.warn('onSignUpPressed')
        navigation.navigate('CreateAcc')
    }

    const {height} = useWindowDimensions();
    const navigation = useNavigation<Signup>();


  return (
   <ScrollView>
     <View style={styles.root}>
      <Image 
      source={ImagePath.PGHlogo} 
      style={[styles.logo, {height: height*0.15}]}
      resizeMode='contain'

    />

    <CustomInput 
    placeholder='Username'
    value={username}
    setValue={setusername}
    SecureText={false}/>
    <CustomInput 
    placeholder='Password'
    value={password}
    setValue={setpassword}
    SecureText={true}/>

<CustomButton text='Sign in' onPress={onSignInPressed} />
<CustomButton text='Forgot Password' onPress={onForgotPasswordPressed} type='TERTIARY'/>
<CustomButton text='Sign in with Google' onPress={onSignInWithGooglePressed} bgColor='#E7EAF4' fgColour='#4765A9'/>
<CustomButton text='Sign in with Apple' onPress={onSignInWithApplePressed} bgColor='#FAE9EA' fgColour='#DD4D44' />
<CustomButton text='Sign in As Anonymous' onPress={onSignInAnonymouslyPressed} bgColor='#E3E3E3' fgColour='#363636'/>


<CustomButton text="Don't have an account? Create one  " onPress={onSignUpPressed} type='TERTIARY'/>
   
   
    </View>
   </ScrollView>

    
  )
}

const styles = StyleSheet.create({

    root:{
        alignItems:'center',
        padding: 20,
        backgroundColor:'#F9FBFC',
        
    },

    logo:{
     width: '70%',
     maxHeight: 200,
     maxWidth: 300,
     margin:10


    }
})

export default SignUpScreen


