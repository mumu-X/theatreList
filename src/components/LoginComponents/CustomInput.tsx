import { View, Text, TextInput, StyleSheet } from 'react-native'
import React from 'react'

interface CustomInputProps {
    value: string,
    setValue: (value: string) => void,
    placeholder: string,
    SecureText: boolean,
}

const CustomInput = ({value, setValue, placeholder, SecureText}:CustomInputProps) => {
  return (
    <View style={styles.container}>
    <TextInput
    value={value}
    onChangeText={setValue}
    style={styles.Input} 
    placeholder={placeholder}
    secureTextEntry={SecureText}>
    

      </TextInput>
    </View>
  )
}

const styles = StyleSheet.create({

    container:{
        backgroundColor:'white',
        width: '100%',
        borderColor: 'blue',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginVertical:10,
        padding : 15
    },
    Input:{
        
    },
})

export default CustomInput