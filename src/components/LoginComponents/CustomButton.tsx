import { View, Text, StyleSheet, Pressable, GestureResponderEvent } from 'react-native'
import React from 'react'
import { string } from 'yup';



interface CustomButtonProps{
    onPress: (() => void) | ((event: GestureResponderEvent) => void) | null | undefined,
    text: string,
    type: any,
    bgColor: string,
    fgColour: string,

}

const CustomButton = ({onPress, text, type ='PRIMARY', bgColor, fgColour}:CustomButtonProps) => {
  return (
    <Pressable 
    onPress={onPress}
    style={[styles.container, 
    styles[`container_${type}`],
    bgColor ? {backgroundColor: bgColor}: {}]}>


      <Text style={[styles.text,
         styles[`text_${type}`],
         fgColour ? {color: fgColour} : {}]}
         >{text}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
    container:{
        
        width: '100%',
        padding: 15,
        marginVertical: 5,
        alignItems: 'center',
        borderRadius: 5
    },

    container_PRIMARY:{
        backgroundColor: 'blue',
    },
    container_TERTIARY:{},

    container_SECONDARY:{
        borderColor: '#3871f3',
        borderWidth: 2,
    },


    text:{
        fontWeight:'bold',
        color: 'white'
    },

    text_TERTIARY:{
        color:'gray'
    },

    text_SECONDARY:{
        color:'#3871f3'
    },
})

export default CustomButton