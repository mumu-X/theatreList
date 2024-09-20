import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

type PtProps = {
    name: string;
    procedure: string;
    bednu: string;
    age: number;
    onDelete: () => void;
    Readystatus: string;
  };



export default function LivePtView({name, procedure, bednu, age, onDelete,  Readystatus='Default'}:PtProps) {
  return (
    <View style={styles.V}>
        <TouchableOpacity style={[styles.deleteButton,
            styles[`deleteButton_${Readystatus}`]]} 
            onPress={onDelete}>
          <Text>X</Text>
        </TouchableOpacity>
      <View style={styles.V0}>
        <View style= {styles.V1}>
            <View style= {styles.V4}>
                <Text style={styles.V4Text}>Name: {name}</Text>
            </View>
            <View>
                <Text>Procedure : {procedure}</Text>
            </View>
        </View>
        <View style={styles.V2}>
            <Text>Age : {age}</Text>
        </View>
        <View>
            <Text style={styles.V2}>
                bed no. {bednu}
            </Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({

    V:{
        alignItems: 'center',
        marginTop: 5,
       // height: '80%',
       // borderColor: '#000000',
       // borderWidth: 2,
    },

    V0:{
        
        marginTop: 5,
        marginBottom: 10,
        marginHorizontal: 8,
        borderColor: '#0A3D62',
        borderWidth: 2,
        borderRadius:5,
        width: '80%'
        
    },

    V1:{
        flexDirection:'row',
        margin: 5,
    },
    V2:{
        margin: 5,
        justifyContent: 'flex-start'
    },

    V4:{
        width: '50%',
        
    },

    V4Text:{
        textAlign:'left'
    },

    

    deleteButton:
      {
        position: 'absolute',
        top: 3,
        left: 23, 
        //backgroundColor: '#FFFFFF',
        borderRadius: 15,
        padding: 5,
      },

    deleteButton_Default: {
        backgroundColor: '#FFFFFF',
      },

    deleteButton_PtNotReady:
      {
    backgroundColor: '#E71C23',
      },

    deleteButton_PtReady: {
        backgroundColor: '#019031',
      },
    deleteButton_Done: {
        backgroundColor: '#FFF222',
      },
})