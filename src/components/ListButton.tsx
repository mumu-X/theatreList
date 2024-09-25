// ListButton.tsx
import { Button, GestureResponderEvent, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../constant/types'; // Import your navigation types

type ButtonProps = {
  thedate: Date | null;
  specialty: string;
  onPressed: (() => void) | ((event: GestureResponderEvent) => void) | null | undefined,
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'Live'>;

export default function ListButton({ thedate, specialty, onPressed}: ButtonProps) {

  return (
      <Pressable
        style={styles.Touchst}
        onPress={onPressed}
      >
       <Text>Check</Text>

      </Pressable>
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
    borderRadius: 8,
  },

});
