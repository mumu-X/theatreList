import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import LivePtView from '../../components/LivePtView';
import LiveButton1 from '../../components/LiveButton1';
import LiveButton2 from '../../components/LiveButton2';
import AsyncStorage from '@react-native-async-storage/async-storage';

type LiveScreenProps = {
  route: {
    params: {
      selectedDate: string | null;
      selectedSpecialty: string;
    };
  };
};

export default function Display({ route }: LiveScreenProps) {
  const { selectedDate, selectedSpecialty } = route.params;
  const [patients, setPatients] = useState<any[]>([]);

  // Convert ISO string back to Date
  const date = selectedDate ? new Date(selectedDate) : null;

  // Fetch data from AsyncStorage
  const fetchData = async () => {
      const dateKey = selectedDate ? selectedDate.split('T')[0] : ''; // Extract date part only
      const key = `${selectedSpecialty}_${dateKey}`; // Generate key using specialty and date only

      console.log(`Fetching data with key: ${key}`);
      
      try {
          const savedData = await AsyncStorage.getItem(key); // Fetch data from AsyncStorage
          if (savedData) {
              console.log(`Fetched data: ${savedData}`);
              setPatients(JSON.parse(savedData)); // Set fetched data to state
          } else {
              console.log(`No data found for key: ${key}`);
              setPatients([]); // Set an empty array if no data is found
          }
      } catch (error) {
          console.error('Error fetching data', error);
      }
  };

// Delete a patient from the list
const handleDelete = async (index: number) => {
  const dateKey = selectedDate ? selectedDate.split('T')[0] : '';
  const key = `${selectedSpecialty}_${dateKey}`;
  
  try {
    // Filter out the patient to delete
    const updatedPatients = patients.filter((_, i) => i !== index);
    setPatients(updatedPatients);

    // Save the updated list to AsyncStorage
    await AsyncStorage.setItem(key, JSON.stringify(updatedPatients));
    console.log(`Deleted patient at index ${index}`);
  } catch (error) {
    console.error('Error deleting patient', error);
  }
};

// fetchData function is called inside useEffect:
  useEffect(() => {
      fetchData(); // Fetch data when the component mounts or selectedDate/selectedSpecialty changes
  }, [selectedDate, selectedSpecialty]);

  return (
    <View>
      <View>
        <Text>Selected Specialty: {selectedSpecialty}</Text>
        <Text>Selected Date: {date ? date.toLocaleDateString() : 'None'}</Text>
      </View>

      <ScrollView style={styles.scrollwindow}>
        {patients.length > 0 ? (
          patients.map((patient, index) => (
            <LivePtView
              key={index}
              name={patient.firstName} 
              procedure={patient.procedure}
              bednu={patient.bedNu}
              age={patient.age || 0}
              onDelete={() => handleDelete(index)} 
            />
          ))
        ) : (
         <View style={styles.emptyList}>
           <Text>No patients found for this specialty and date.</Text>
         </View>
        )}
      </ScrollView>

      <View style={styles.Buttons}>
        <LiveButton1 date={date} specialty={selectedSpecialty} />
        <LiveButton2 />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  Buttons: {
    flexDirection: 'row',
    marginTop: 10,
    marginHorizontal: 30,
    padding: 5,
    justifyContent: 'space-between',
  },

  scrollwindow: {
    height: '60%',
    borderWidth: 2,
    borderColor: '#E71C23'
  },

  emptyList:{
    justifyContent: 'center',
    alignItems: 'center'
  }
});
