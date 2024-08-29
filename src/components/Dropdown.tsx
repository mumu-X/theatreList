import { FlatList, Image, Modal, Platform, SafeAreaView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React, { useCallback, useRef, useState } from 'react'
import ImagePath from '../constant/ImagePath'

type optionItem = {
    value: string;
    Label: string;
};

interface DropdownProps{
    data:optionItem[];
    onChange: (item: optionItem ) => void;
    placeholder: string
    value: string; 
    setValue: (value: string) => void; 
}

export default function Dropdown({data, onChange, placeholder, value, setValue}:DropdownProps) {
    const[expanded, setExpanded] =useState(false)
    const toggleExpanded = useCallback(()=>setExpanded(!expanded),[expanded]);

    const buttonRef = useRef<View>(null);
    const [top,setTop] = useState(0)


    //const [value,setValue] = useState('')
    const onSelect= useCallback((item:optionItem)=>{
        onChange(item)
        setValue(item.value);
        setExpanded(false);
    },[])

  return (
  
    <View
        ref ={buttonRef} 
        onLayout={(event) => {
            const layout = event.nativeEvent.layout
            const topOffset =(layout.y);
            const heightOfComponent = layout.height;

            const finalValue = topOffset + heightOfComponent + (Platform.OS === "android" ? 80 : 175);

            setTop(finalValue);
        }}>
        

        

         <TouchableOpacity 
         style={styles.btnstyle}
         activeOpacity={0.8}
         onPress={toggleExpanded}
         >
     <Text style={styles.text}>{value || placeholder}</Text>
     <Image source={expanded ? ImagePath.downarrow : ImagePath.caretup} />
     </TouchableOpacity>
     
     {expanded ? ( <Modal 
        visible={expanded} transparent={true}>
           <TouchableWithoutFeedback onPress={()=> setExpanded(false)}>
            <View style={styles.backdrop}>
        <View style= {[styles.options,{top}]}>
            <FlatList
            keyExtractor={(item) => item.value}
            data={data}
        renderItem={({item})=>( 
            <TouchableOpacity
            style={styles.optionItem} 
            activeOpacity={0.8}
            onPress={() => onSelect(item)}>
            <Text>{item.Label}</Text>
            </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style= {styles.separator} />}
            />
        </View>
        </View>
        </TouchableWithoutFeedback>
        </Modal>)
     
     : null}
     
    </View>
    

)}

const styles = StyleSheet.create({
    text:{
        fontSize: 15,
        opacity: 0.8,
    },

    btnstyle:{
        height: 50,
        justifyContent: "space-between",
        backgroundColor: '#A4B0BD',
        flexDirection: 'row',
        width: '100%' ,
        alignItems: 'center',
        paddingHorizontal: 15,
        borderRadius: 8
    },

    options:{
        position: 'absolute',
        backgroundColor: '#DAE0E2',
        //top: 53,
        width:'100%',
        padding: 10,
        borderRadius: 10,
        maxHeight: 250
    },
    optionItem:{
        height: 40,
        justifyContent:'center'
    
    },
    separator:{
     height: 6

    },

    backdrop:{
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1

    }
})