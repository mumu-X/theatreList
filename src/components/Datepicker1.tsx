import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DatePicker from 'react-native-date-picker';


type DatePickerProps = {
  thedate: Date | null;
  thesetDate: (date: Date) => void;
};

export default ({thedate , thesetDate}: DatePickerProps) => {
  //const [date, setDate] = useState<Date | null>(null); // Specify the type as Date | null
  const [open, setOpen] = useState(false); // Open date picker

  // Format the date to a string if a date is selected
  const yourdate = thedate ? thedate.toLocaleDateString() : null;

  return (
   <View>
    <TouchableOpacity
        style={styles.btnstyle}
        activeOpacity={0.8}
        onPress={() => setOpen(true)}>
        <Text>
          {yourdate || 'Pick Date'}
        </Text>
        <Text>.</Text>
      </TouchableOpacity>
      <DatePicker
        modal
        mode="date"
        open={open}
        date={thedate || new Date()} // Show today's date initially in the picker
        onConfirm={(selectedDate) => {
          setOpen(false);
          thesetDate(selectedDate); // setDate with Date object
        }}
        onCancel={() => {
          setOpen(false);
        }}
      />
   </View>
  );
};

const styles = StyleSheet.create({
  btnstyle: {
    height: 50,
    justifyContent: 'space-between',
    backgroundColor: '#A4B0BD',
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 15,
    borderRadius: 8,
  },

  
});
