// ListButton.tsx
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../constant/types'; // Import your navigation types

type ButtonProps = {
  thedate: Date | null;
  specialty: string;
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'Live'>;

export default function ListButton({ thedate, specialty }: ButtonProps) {
  const navigation = useNavigation<NavigationProp>();

  const handlePress = () => {
    // Convert Date to ISO string
    const dateString = thedate ? thedate.toISOString() : null;

    // Navigate to the next screen and pass the date and specialty
    navigation.navigate('Live', {
      selectedDate: dateString,
      selectedSpecialty: specialty,
    });
  };



  return (
      <TouchableOpacity
        style={styles.Touchst}
        activeOpacity={0.8}
        onPress={handlePress}
      >
       <Text>Submit</Text>
      
      </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  Touchst: {
    height: 50,
    justifyContent: 'space-between',
    backgroundColor: '#A4B0BD',
    flexDirection: 'row',
    width: '100%' ,
    alignItems: 'center',
    paddingHorizontal: 15,
    borderRadius: 8
  },

});
