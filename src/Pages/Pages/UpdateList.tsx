import { Button, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import Dropdown from '../../components/Dropdown';
import { surgicalSpecialties } from '../../constant/specialtieslist';
import Datepicker1 from '../../components/Datepicker1';
import ListButton from '../../components/ListButton';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../constant/types';
import { useNavigation } from '@react-navigation/native';

// Define the navigation prop type
type Updates = StackNavigationProp<RootStackParamList, 'Update'>


const formattedSpecialties = surgicalSpecialties.map(s=>({value:s.label, Label:  s.label + s.flag,

}));




export default function SelectionScreen() {

  const navigation = useNavigation<Updates>();

  const check = ()=> {
    console.warn('CheckPressed');
    navigation.navigate('Signup');
  }


  const handlePress = () => {
    // Convert Date to ISO string
    const dateString = date ? date.toISOString() : null;

    // Navigate to the next screen and pass the date and specialty
    console.warn('CheckPressed');
    navigation.navigate('PostOP', {
      selectedDate: dateString,
      selectedSpecialty: value,
    });
  };

  const [date, setDate] = useState<Date | null>(null); // Specify the type as Date | null
  const [value,setValue] = useState('');

  return (
    <View style={styles.MainContainer}>
     <View style={styles.headerText}>
     <Text>Please select date and specialty from below</Text>
     </View>
     <View style={styles.container}>
      <View>
     <Dropdown data={formattedSpecialties} onChange={(item) => setValue(item.value)} placeholder="Choose Specialty" value= {value} setValue={setValue}/>
     </View>
     <View>
     <Datepicker1 thedate={date} thesetDate={setDate}/>
     </View>
     <View>
      <ListButton thedate={date} specialty={value} onPressed={handlePress}/>
     </View>
     </View>
    </View>
  );
}

const styles = StyleSheet.create({
  MainContainer:{
    flex: 1,
    alignItems: 'center',
  },

  container:{
    flex:1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    //backgroundColor:
    gap: 10,
  },

  headerText:{
    flex:1,
    justifyContent: 'center',
    //alignItems: 'center'
  },


});
