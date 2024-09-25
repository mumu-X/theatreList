import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../constant/types';
import firestore from '@react-native-firebase/firestore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';

type Dataupdate = {
  route: RouteProp<RootStackParamList, 'PostOP'>;
};

// Define the navigation prop type for DataEntry
type PostOP_ = StackNavigationProp<RootStackParamList, 'DataEntry'>;

export default function PostOp_Data({ route }: Dataupdate) {
  const { selectedDate, selectedSpecialty } = route.params;
  const [patients, setPatients] = useState<any[]>([]); // State for fetched patients
  const navigation = useNavigation<PostOP_>();

  // Convert ISO string back to Date
  const date = selectedDate ? new Date(selectedDate) : null;

  // Handle press on a patient to navigate to DataEntry screen
  const handlePress = (patientId: string) => {
    navigation.navigate('DataEntry', {
      selectedDate,
      selectedSpecialty,
      patientId, // Passing the selected patient ID to the DataEntry screen
    });
  };

  // Get patient status to determine background color
  const evaluatePatientStatus = (patient: any): string => {
    if (patient.isPatientReady && patient.isPatientDone) {
      return 'green';
    } else if (patient.isPatientReady && !patient.isPatientDone) {
      return 'yellow';
    } else {
      return 'red';
    }
  };

  // Fetch data from Firestore when component mounts or selectedDate/selectedSpecialty changes
  useEffect(() => {
    const fetchData = async () => {
      if (!selectedDate || !selectedSpecialty) {
        console.log('Missing date or specialty');
        return;
      }

      const startOfDay = new Date(selectedDate);
      startOfDay.setUTCHours(0, 0, 0, 0);

      const endOfDay = new Date(selectedDate);
      endOfDay.setUTCHours(23, 59, 59, 999);

      console.log(`Fetching data from Firestore collection: ${selectedSpecialty} with date range: ${startOfDay.toISOString()} - ${endOfDay.toISOString()}`);

      try {
        const snapshot = await firestore()
          .collection(selectedSpecialty)
          .where('date', '>=', startOfDay.toISOString())
          .where('date', '<=', endOfDay.toISOString())
          .get();

        const fetchedPatients = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log(`Fetched data: ${JSON.stringify(fetchedPatients)}`);
        setPatients(fetchedPatients); // Update state with fetched patients
      } catch (error) {
        console.error('Error fetching data from Firestore', error);
      }
    };

    fetchData();
  }, [selectedDate, selectedSpecialty]); // Re-fetch when selectedDate or selectedSpecialty changes

  return (
    <SafeAreaView>
      <View style={styles.MainBox}>
        <View>
          <Text>Please select a Patient to update</Text>
          <Text>Selected Date: {date ? date.toLocaleDateString() : 'None'}</Text>
          <Text>Selected Specialty: {selectedSpecialty}</Text>
        </View>
        <View style={styles.container}>
          <FlatList
            data={patients} // Use fetched patients as the data source
            keyExtractor={(item) => item.id} // Unique key for each item
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handlePress(item.id)}>
                <View style={[styles.FlatBox, { backgroundColor: evaluatePatientStatus(item) }]}>
                  <View style={styles.element}>
                    <Text style={styles.name}>
                      {item.firstName} {item.surName}
                    </Text>
                  </View>
                  <View style={styles.element}>
                    <Text style={styles.name}>{item.procedure}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  MainBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  FlatBox: {
    borderWidth: 3,
    borderColor: 'black',
    height: 100,
    marginTop: 24,
    padding: 10,
  },
  name: {},
  container: {
    backgroundColor: 'white',
    paddingTop: 40,
    paddingHorizontal: 20,
    width: '100%',
  },
  element: {
    marginVertical: 5,
  },
});