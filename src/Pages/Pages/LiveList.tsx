import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import LivePtView from '../../components/LivePtView';
import LiveButton1 from '../../components/LiveButton1';
import firestore from '@react-native-firebase/firestore';

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

  /*
  // Adding data to Firestore
  const addPatientsToFirestore = () => {
    patients.forEach((patient) => {
      firestore()
        .collection(selectedSpecialty)
        .add({
          name: patient.firstName,
          procedure: patient.procedure,
          bednu: patient.bedNu,
          age: patient.age || 0,
          date: selectedDate,
        })
        .then(() => {
          console.log(`Patient ${patient.firstName} added to Firestore`);
        })
        .catch((error) => {
          console.error(`Error adding patient ${patient.firstName} to Firestore`, error);
        });
    });
  };
  */

  // Convert ISO string back to Date
  const date = selectedDate ? new Date(selectedDate) : null;


  // Fetch data from Firestore
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
      setPatients(fetchedPatients);
    } catch (error) {
      console.error('Error fetching data from Firestore', error);
    }
  };

  // Delete a patient from Firestore
  const handleDelete = async (id: string) => {
    try {
      // Delete the patient document from Firestore
      await firestore().collection(selectedSpecialty).doc(id).delete();

      // Remove the patient from the state
      const updatedPatients = patients.filter(patient => patient.id !== id);
      setPatients(updatedPatients);

      console.log(`Deleted patient with id ${id}`);
    } catch (error) {
      console.error('Error deleting patient', error);
    }
  };

  // Fetch data when the component mounts or selectedDate/selectedSpecialty changes
  useEffect(() => {
    fetchData();
  }, [selectedDate, selectedSpecialty]);

  // getting patient status to put into Readystatus
  const evaluatePatientStatus = (patient: any): string => {

    if (patient.isPatientReady === true && patient.isPatientDone === true) {
      return 'Done';
    }

    if (patient.isPatientReady === true && patient.isPatientDone === false) {
      return 'PtReady';
    }

    if (patient.isPatientReady === false && (patient.isPatientDone === false || patient.isPatientDone === undefined)) {
      return 'PtNotReady';
    }


    return '';
  };



  return (
    <View>
      <View>
        <Text>Selected Specialty: {selectedSpecialty}</Text>
        <Text>Selected Date: {date ? date.toLocaleDateString() : 'None'}</Text>
      </View>

      <ScrollView style={styles.scrollwindow}>
        {patients.length > 0 ? (
         patients.map((patient) => {
          const status = evaluatePatientStatus(patient); // Evaluate the patient's status
          console.log(`Patient ${patient.firstName} status: ${status}`); // Log the status

          return (
            <LivePtView
              key={patient.id}
              name={patient.firstName}
              procedure={patient.procedure}
              bednu={patient.bedNu}
              age={patient.age || 0}
              onDelete={() => handleDelete(patient.id)}
              Readystatus={status} // Pass the evaluated status to the component
            />
          );
        })
      ) : (
         <View style={styles.emptyList}>
           <Text>No patients found for this specialty and date.</Text>
         </View>
        )}
      </ScrollView>

      <View style={styles.Buttons}>
        <LiveButton1 date={date} specialty={selectedSpecialty} />
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
    borderColor: '#E71C23',
  },

  emptyList:{
    justifyContent: 'center',
    alignItems: 'center',
  },
});
