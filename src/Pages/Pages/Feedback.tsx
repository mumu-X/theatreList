import { ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import AnaeRender from '../../components/AnaeRender';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SubmitFeedback from '../../components/SubmitFeedback';

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

  const date = selectedDate ? new Date(selectedDate) : null;

  const fetchData = async () => {
    const dateKey = selectedDate ? selectedDate.split('T')[0] : '';
    const key = `${selectedSpecialty}_${dateKey}`;

    try {
      console.log(`Fetching data with key: ${key}`);
      const savedData = await AsyncStorage.getItem(key);
      if (savedData) {
        console.log(`Fetched data: ${savedData}`);
        setPatients(JSON.parse(savedData));
      } else {
        console.log(`No data found for key: ${key}`);
        setPatients([]);
      }
    } catch (error) {
      console.error('Error fetching data', error);
    }
  };

  const updatePatient = async (index: number, updates: any) => {
    const dateKey = selectedDate ? selectedDate.split('T')[0] : '';
    const key = `${selectedSpecialty}_${dateKey}`;

    try {
      const updatedPatients = [...patients];
      updatedPatients[index] = { ...updatedPatients[index], ...updates };
      setPatients(updatedPatients);

      console.log(`Updated patients state: ${JSON.stringify(updatedPatients)}`);

      await AsyncStorage.setItem(key, JSON.stringify(updatedPatients));
      console.log(`Patient at index ${index} updated.`);
    } catch (error) {
      console.error('Error updating patient', error);
    }
  };

  const handleNotReady = (index: number) => {
    updatePatient(index, { isPatientReady: false, isPatientDone: false });
  };

  const handleReady = (index: number) => {
    updatePatient(index, { isPatientReady: true, isPatientDone: false });
  };

  const handleToggleChange = (index: number, value: boolean) => {
    // Update the patient status based on toggle value
    if (value) {
      // Switching to Done
      updatePatient(index, { isPatientDone: true, isPatientReady: true });
    } else {
      // Switching to Not Yet Done
      updatePatient(index, { isPatientDone: false, isPatientReady: false });
    }
  };

  const handleSubmit = async () => {
    const dateKey = selectedDate ? selectedDate.split('T')[0] : '';
    const key = `${selectedSpecialty}_${dateKey}`;

    try {
      const updatedPatients = patients.map(patient => ({
        ...patient,
        isPatientDone: patient.isPatientDone ?? false,
      }));

      await AsyncStorage.setItem(key, JSON.stringify(updatedPatients));
      console.log('Patient data submitted and updated.');
    } catch (error) {
      console.error('Error submitting patient data', error);
    }
  };

  useEffect(() => {
    fetchData();
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
            <AnaeRender
              key={index}
              name={patient.firstName}
              surName={patient.surName}
              procedure={patient.procedure}
              bednu={patient.bedNu}
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
