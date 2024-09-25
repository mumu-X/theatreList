
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import React, { useState } from 'react';
import CustomInput from '../../../components/LoginComponents/CustomInput';
import CustomButton from '../../../components/LoginComponents/CustomButton';
import { hospitalDepartments } from '../../../constant/Departments';
import { titles } from '../../../constant/Titles';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../constant/types';

type forgotpass = StackNavigationProp<RootStackParamList, 'ForgotPasswordSreen'>




const formattedSpecialties = hospitalDepartments.map(s=>({value:s.label, Label:  s.label + s.flag,
}));
const formattedTitles = titles.map(s=>({value:s.label, Label:  s.label + s.flag,
}));



const ForgotPasswordSreen = () => {

    const navigation = useNavigation<forgotpass>();

    const [Email,setEmail] = useState('')
    ;

    const onSendPressed = ()=> {
        console.warn('Confirm');
        navigation.navigate('ConfirmEmailScreen');
    };
    const onBacktoSigninPressed = ()=> {
        console.warn('onBacktoSigninPressed');
        navigation.navigate('Signup');
    };




  return (
   <ScrollView>
     <View style={styles.root}>
      <Text style={styles.title}>
Reset Your Password
      </Text>

    <CustomInput
    placeholder="Email"
    value={Email}
    setValue={setEmail}
    SecureText={false}/>


<CustomButton text="Send" onPress={onSendPressed} />



<CustomButton
text="Back to sign in"
onPress={onBacktoSigninPressed}
type="TERTIARY"/>




    </View>
   </ScrollView>


  );
};

const styles = StyleSheet.create({

    root:{
        alignItems:'center',
        padding: 20,
        backgroundColor:'#F9FBFC',

    },

    link:{
        color:'#fdb075',

    },

    title:{
        fontSize: 24,
        fontWeight: 'bold',
        color: '#051c60',
        margin: 10,
    },

    text:{
        color:'gray',
        marginVertical: 10,

    },

    sidebyside:{
        flexDirection: 'row',
        justifyContent: 'space-evenly',

    },
});

export default ForgotPasswordSreen;


