import { ScrollView, StyleSheet, Text, View, Button, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import AnaeRender from '../../components/AnaeRender';
import SubmitFeedback from '../../components/SubmitFeedback';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';




type LiveScreenProps = {
  route: {
    params: {
      selectedDate: string;
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
  const isFocused = useIsFocused();

  // Convert ISO string back to Date
  const date = selectedDate ? new Date(selectedDate) : null;

  // Fetch patients from Firestore based on date range
  const fetchPatientsFromFirestore = async () => {
    setLoading(true);
    if (!selectedDate || !selectedSpecialty) {
      console.log('Missing date or specialty');
      setLoading(false);
      return;
    }

    // Create a range for the start and end of the selected date
    const startOfDay = new Date(selectedDate);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(selectedDate);
    endOfDay.setUTCHours(23, 59, 59, 999);

    console.log(`Fetching data from Firestore collection: ${selectedSpecialty} with date range: ${startOfDay.toISOString()} - ${endOfDay.toISOString()}`);

    try {
      // Query Firestore for patients in the selected specialty and date range
      const querySnapshot = await firestore()
        .collection(selectedSpecialty)
        .where('date', '>=', startOfDay.toISOString())
        .where('date', '<=', endOfDay.toISOString())
        .get();

      const patientData: any[] = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log(`Fetched data: ${JSON.stringify(patientData)}`);

      // Save the previous state for comparison in real-time updates
      setPreviousPatients(patients);

      // Update the state with the newly fetched data
      setPatients(patientData);
    } catch (error) {
      console.error('Error fetching patients from Firestore: ', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to update a patient's readiness in Firestore
  const updatePatient = async (index: number, updates: any) => {
    const updatedPatients = [...patients];
    const patientId = updatedPatients[index].id;

    try {
      // Update patient locally
      updatedPatients[index] = { ...updatedPatients[index], ...updates };
      setPatients(updatedPatients);

      // Update patient data in Firestore
      await firestore()
        .collection(selectedSpecialty)
        .doc(patientId)
        .update(updates);

      console.log(`Patient at index ${index} updated.`);
    } catch (error) {
      console.error('Error updating patient in Firestore: ', error);
    }
  };

  // Mark the patient as not ready
  const handleNotReady = (index: number) => {
    updatePatient(index, { isPatientReady: false, isPatientDone: false });
  };

  // Mark the patient as ready
  const handleReady = (index: number) => {
    updatePatient(index, { isPatientReady: true, isPatientDone: false });
  };

  // Toggle patient's "done" status
  const handleToggleChange = (index: number, value: boolean) => {
    if (value) {
      updatePatient(index, { isPatientDone: true, isPatientReady: true });
    } else {
      updatePatient(index, { isPatientDone: false, isPatientReady: false });
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      const updatedPatients = patients.map(patient => ({
        ...patient,
        isPatientDone: patient.isPatientDone ?? false,
      }));

      if (notificationsEnabled) {
        // Check for added patients
        const addedPatients = updatedPatients.filter(patient => !previousPatients.some(p => p.id === patient.id));
        // Check for removed patients
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
    } catch (error) {
      console.error('Error submitting patient data', error);
    }
  };

  // Load notifications enabled state from AsyncStorage
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

  // Save notifications enabled state to AsyncStorage
  const saveNotificationsEnabledState = async (value: boolean) => {
    try {
      await AsyncStorage.setItem('notificationsEnabled', JSON.stringify(value));
    } catch (error) {
      console.error('Error saving notifications state', error);
    }
  };

  // Toggle notification setting
  const toggleNotifications = () => {
    const newState = !notificationsEnabled;
    setNotificationsEnabled(newState);
    saveNotificationsEnabledState(newState);
    console.log('Notifications Enabled:', newState);
  };

  // Fetch patients on screen focus or when selectedDate or selectedSpecialty changes
  useEffect(() => {
    if (isFocused) {
      fetchPatientsFromFirestore();
      loadNotificationsEnabledState();
    }
  }, [isFocused, selectedDate, selectedSpecialty]);

  // Listen for real-time updates in Firestore when notifications are enabled
  useEffect(() => {
    async function saveFCMToken(selectedSpecialty: string) {
      try {
        const token = await messaging().getToken();
        if (token) {
          await firestore().collection('notificationTokens').doc(token).set({
            token,
            selectedSpecialty, // Save the specialty user has enabled notifications f
          });
          console.log('FCM Token saved:', token);
        }
      } catch (error) {
        console.error('Error fetching FCM Token:', error);
      }
    }

    if (notificationsEnabled) {
      saveFCMToken(selectedSpecialty);
    }
  }, [notificationsEnabled, selectedSpecialty]);

  useEffect(() => {
    // Background notification handler
    const unsubscribeBackground = messaging().onNotificationOpenedApp(remoteMessage => {
      if (remoteMessage) {
        console.log('Notification caused app to open from background state:', remoteMessage.notification);
        // Add any action you want to perform, e.g., navigating to a specific screen.
      }
    });

    // Quit-state notification handler
    messaging().getInitialNotification().then(remoteMessage => {
      if (remoteMessage) {
        console.log('Notification caused app to open from quit state:', remoteMessage.notification);
        // Add any action you want to perform, e.g., navigating to a specific screen.
      }
    });

    return unsubscribeBackground;
  }, []);



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

// Styles for the component
const styles = StyleSheet.create({
  scrollwindow: {
    height: '70%',
  },
  emptyList: {
    alignItems: 'center',
    marginTop: 20,
  },
});


