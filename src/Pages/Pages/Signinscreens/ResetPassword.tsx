
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import React, { useState } from 'react';
import CustomInput from '../../../components/LoginComponents/CustomInput';
import CustomButton from '../../../components/LoginComponents/CustomButton';
import { hospitalDepartments } from '../../../constant/Departments';
import { titles } from '../../../constant/Titles';




const formattedSpecialties = hospitalDepartments.map(s=>({value:s.label, Label:  s.label + s.flag,
}));
const formattedTitles = titles.map(s=>({value:s.label, Label:  s.label + s.flag,
}));



const ForgotPasswordSreen = () => {

    const [code,setcode] = useState('');
    const [NewPassword,setNewPassword] = useState('')
    ;

    const onSubmitPressed = ()=> {
        console.warn('Confirm');
    };
    const onBacktoSigninPressed = ()=> {
        console.warn('onBacktoSigninPressed');
    };




  return (
   <ScrollView>
     <View style={styles.root}>
      <Text style={styles.title}>
Reset Your Password
      </Text>

    <CustomInput
    placeholder="code"
    value={code}
    setValue={setcode}
    SecureText={false}/>

<CustomInput
    placeholder="Password"
    value={NewPassword}
    setValue={setNewPassword}
    SecureText={false}/>


<CustomButton text="SUBMIT" onPress={onSubmitPressed} />



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


