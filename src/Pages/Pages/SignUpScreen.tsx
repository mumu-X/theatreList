import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

export default function SignUpScreen() {
  return (
    <View style={styles.MainBox}>
        <View style={styles.headingBox}>
        <Text style={styles.headingText}>SignUpScreen</Text>
        </View>
        <View style={styles.logBox}>
            <View style={styles.Button}>
                <TouchableOpacity>
                    <Text>Login</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.Button}>
                <TouchableOpacity>
                    <Text>SignUp</Text>
                </TouchableOpacity>
            </View>
        </View>
        <View style={styles.noteBox}>
            <Text>hello</Text>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({

    MainBox:{
        flex:1,
        alignItems:'center',
        justifyContent:'center'
    },
    headingBox:{
        height: '25%',
        //backgroundColor:'#E71C23',
        alignItems:'center',
        justifyContent:'center'

    },
    logBox:{
        height: '35%',
        //backgroundColor:'#E71C23',
        alignItems:'center',
        justifyContent:'space-evenly'
    },
    Button:{},
    headingText:{
        fontSize: 40,
    },
    noteBox:{
        height: '25%',
        //backgroundColor:'#E71C23',
        alignItems:'center',
        justifyContent:'center'
    }


})