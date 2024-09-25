
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import React, { useState } from 'react';
import CustomInput from '../../../components/LoginComponents/CustomInput';
import CustomButton from '../../../components/LoginComponents/CustomButton';
import { hospitalDepartments } from '../../../constant/Departments';
import { titles } from '../../../constant/Titles';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../constant/types';

type confmEmail = StackNavigationProp<RootStackParamList,'ConfirmEmailScreen'>






const formattedSpecialties = hospitalDepartments.map(s=>({value:s.label, Label:  s.label + s.flag,
}));
const formattedTitles = titles.map(s=>({value:s.label, Label:  s.label + s.flag,
}));



const ConfirmEmailScreen = () => {

    const navigation = useNavigation<confmEmail>();

    const [code,setcode] = useState('')
    ;

    const onConfirmPressed = ()=> {
        console.warn('Confirm');

        // Logic to verify code

        navigation.navigate('Home');

    };
    const onResendPressed = ()=> {
        console.warn('onResendPressed');
    };

    const onPrivacyPolicy = ()=> {
        console.warn('onPrivacyPolicyPressed');
    };
    const onSigninPressed = ()=> {
        console.warn('onSigninPressed');
        navigation.navigate('Signup');
    };




  return (



   <ScrollView>
     <View style={styles.root}>
      <Text style={styles.title}>
        Confirm Email
      </Text>

    <CustomInput
    placeholder="Enter Your confirmation Code"
    value={code}
    setValue={setcode}
    SecureText={false}/>


<CustomButton text="Confirm" onPress={onConfirmPressed} />






<View style={styles.sidebyside}>

<View>
<CustomButton
text="Resend Code"
onPress={onResendPressed}
type="SECONDARY"/>
</View>

<View>
<CustomButton
text="Back to sign in"
onPress={onSigninPressed}
type="SECONDARY"/>
</View>

</View>

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

export default ConfirmEmailScreen;


