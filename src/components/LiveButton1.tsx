import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../constant/types';

type LiveButton1Props = {
  date: Date | null;
  specialty: string;
};

type LiveButton1NavigationProp = StackNavigationProp<RootStackParamList, 'AddPt'>;

export default function LiveButton1({ date, specialty }: LiveButton1Props) {
  const navigation = useNavigation<LiveButton1NavigationProp>();

  const handlePress = () => {
    // Convert Date to ISO string for serialization
    const dateString = date ? date.toISOString() : null;

    navigation.navigate('AddPt', {
      selectedDate: dateString,
      selectedSpecialty: specialty,
    });
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.button}>
      <Text>ADD</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 40,
    width: 100,
    backgroundColor: '#A4B0BD',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
});
