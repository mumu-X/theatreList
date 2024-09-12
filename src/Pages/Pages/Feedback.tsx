import { ScrollView, StyleSheet, Text, View, Button, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import AnaeRender from '../../components/AnaeRender';
import SubmitFeedback from '../../components/SubmitFeedback';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';

type LiveScreenProps = {
  route: {
    params: {
      selectedDate: string | null;
      selectedSpecialty: string;
    };
  };
};

export default function Feedback({ route }: LiveScreenProps) {
  const { selectedDate, selectedSpecialty } = route.params;
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [previousPatients, setPreviousPatients] = useState<any[]>([]);
  const isFocused = useIsFocused(); // Hook to determine if the screen is focused

  // Convert ISO string back to Date
  const date = selectedDate ? new Date(selectedDate) : null;

  const fetchPatientsFromFirestore = async () => {
    setLoading(true);
    if (!selectedDate || !selectedSpecialty) {
      console.log('Missing date or specialty');
      setLoading(false);
      return;
    }

    const startOfDay = new Date(selectedDate);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(selectedDate);
    endOfDay.setUTCHours(23, 59, 59, 999);

    console.log(`Fetching data from Firestore collection: ${selectedSpecialty} with date range: ${startOfDay.toISOString()} - ${endOfDay.toISOString()}`);

    try {
      const querySnapshot = await firestore()
        .collection(selectedSpecialty)
        .where('date', '>=', startOfDay.toISOString())
        .where('date', '<=', endOfDay.toISOString())
        .get();

      const patientData: any[] = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log(`Fetched data: ${JSON.stringify(patientData)}`);
      setPreviousPatients(patients); // Save previous state
      setPatients(patientData);
    } catch (error) {
      console.error('Error fetching patients from Firestore: ', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePatient = async (index: number, updates: any) => {
    const updatedPatients = [...patients];
    const patientId = updatedPatients[index].id;

    try {
      // Update patient locally
      updatedPatients[index] = { ...updatedPatients[index], ...updates };
      setPatients(updatedPatients);

      // Update patient in Firestore
      await firestore()
        .collection(selectedSpecialty)
        .doc(patientId)
        .update(updates);

      console.log(`Patient at index ${index} updated.`);
    } catch (error) {
      console.error('Error updating patient in Firestore: ', error);
    }
  };

  const handleNotReady = (index: number) => {
    updatePatient(index, { isPatientReady: false, isPatientDone: false });
  };

  const handleReady = (index: number) => {
    updatePatient(index, { isPatientReady: true, isPatientDone: false });
  };

  const handleToggleChange = (index: number, value: boolean) => {
    if (value) {
      updatePatient(index, { isPatientDone: true, isPatientReady: true });
    } else {
      updatePatient(index, { isPatientDone: false, isPatientReady: false });
    }
  };

  const handleSubmit = async () => {
    try {
      // Process patient data before submitting
      const updatedPatients = patients.map(patient => ({
        ...patient,
        isPatientDone: patient.isPatientDone ?? false,
      }));

      if (notificationsEnabled) {
        // Check for added or removed patients
        const addedPatients = updatedPatients.filter(patient => !previousPatients.some(p => p.id === patient.id));
        const removedPatients = previousPatients.filter(patient => !updatedPatients.some(p => p.id === patient.id));

        if (addedPatients.length > 0) {
          console.log('Patients added:', addedPatients);
          Alert.alert('Notification', 'Patients added: ' + JSON.stringify(addedPatients));
        }
        if (removedPatients.length > 0) {
          console.log('Patients removed:', removedPatients);
          Alert.alert('Notification', 'Patients removed: ' + JSON.stringify(removedPatients));
        }
      }

      // Update the previous patients list
      setPreviousPatients(updatedPatients);

      console.log('Patient data submitted and updated.');
    } catch (error) {
      console.error('Error submitting patient data', error);
    }
  };

  const loadNotificationsEnabledState = async () => {
    try {
      const value = await AsyncStorage.getItem('notificationsEnabled');
      if (value !== null) {
        setNotificationsEnabled(JSON.parse(value));
      }
    } catch (error) {
      console.error('Error loading notifications state', error);
    }
  };

  const saveNotificationsEnabledState = async (value: boolean) => {
    try {
      await AsyncStorage.setItem('notificationsEnabled', JSON.stringify(value));
    } catch (error) {
      console.error('Error saving notifications state', error);
    }
  };

  const toggleNotifications = () => {
    const newState = !notificationsEnabled;
    setNotificationsEnabled(newState);
    saveNotificationsEnabledState(newState);
    console.log('Notifications Enabled:', newState);
  };

  useEffect(() => {
    if (isFocused) {
      fetchPatientsFromFirestore();
      loadNotificationsEnabledState(); // Load the persisted state
    }
  }, [isFocused, selectedDate, selectedSpecialty]);

  return (
    <View>
      <View>
        <Text>Selected Specialty: {selectedSpecialty}</Text>
        <Text>Selected Date: {date ? date.toLocaleDateString() : 'None'}</Text>
      </View>

      <ScrollView style={styles.scrollwindow}>
        {loading ? (
          <Text>Loading patients...</Text>
        ) : patients.length > 0 ? (
          patients.map((patient, index) => (
            <AnaeRender
              key={patient.id}
              name={patient.firstName}
              surName={patient.surName}
              procedure={patient.procedure}
              bednu={patient.bednu}
              age={patient.age || 0}
              NotReady={() => handleNotReady(index)}
              Ready={() => handleReady(index)}
              isPatientReady={patient.isPatientReady}
              isPatientDone={patient.isPatientDone}
              onToggleChange={(value) => handleToggleChange(index, value)}
            />
          ))
        ) : (
          <View style={styles.emptyList}>
            <Text>No patients found for this specialty and date.</Text>
          </View>
        )}
      </ScrollView>

      <SubmitFeedback onSubmit={handleSubmit} />

      <Button
        title={notificationsEnabled ? 'Disable Notifications' : 'Enable Notifications'}
        onPress={toggleNotifications}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  scrollwindow: {
    height: '70%',
  },
  emptyList: {
    alignItems: 'center',
    marginTop: 20,
  },
});
