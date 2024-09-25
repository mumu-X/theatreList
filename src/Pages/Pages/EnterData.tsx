import React from 'react';
import { Alert, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../constant/types';
import { Formik } from 'formik';
import * as Yup from 'yup';
import firestore from '@react-native-firebase/firestore';

// Validation schema for the form using Yup
const UpdateSchema = Yup.object().shape({
  criticalEvents: Yup.string().required('Critical events are required'),
  dateOfProcedure: Yup.date().required('Date of procedure is required').typeError('Invalid date'),
  procedureDone: Yup.string().required('Procedure done is required'),
  outcome: Yup.string().required('Outcome is required'),
  reasonForCancellation: Yup.string(),
  type: Yup.string().required('Type is required'),
  anaesthetic: Yup.string(),
  procedureDuration: Yup.number().required('Procedure duration is required').positive().integer(),
  surgeonName: Yup.string().required('Surgeon name is required'),
  assistantSurgeonName: Yup.string(),
  anaesthetistName: Yup.string(),
  assistantAnaesthetistName: Yup.string(),
  scrubNurseName: Yup.string(),
  dateOfAdmission: Yup.date().required('Date of admission is required').typeError('Invalid date'),
  dateOfDischarge: Yup.date().required('Date of discharge is required').typeError('Invalid date'),
  durationOfStay: Yup.number().required('Duration of stay is required').positive().integer(),
  overallOutcome: Yup.string(),
  surgicalSiteInfection: Yup.string(),
});

// Props type for the DataEntry component
type DataEntryProps = {
  route: RouteProp<RootStackParamList, 'DataEntry'>;
};

export default function DataEntry({ route }: DataEntryProps) {
  const { patientId, selectedDate, selectedSpecialty } = route.params;
  const navigation = useNavigation();

  // Function to update data in Firestore
  const updateData = async (values: any) => {
    try {
      const collectionName = `${selectedSpecialty}`;
      await firestore().collection(collectionName).doc(patientId).update(values);
      Alert.alert('Data updated successfully', '', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(), // Navigate back after alert
        },
      ]);
    } catch (error) {
      console.error('Error updating data in Firestore', error);
      Alert.alert('Failed to update the data in Firestore');
    }
  };

  return (
    <Formik
      initialValues={{
        criticalEvents: '',
        dateOfProcedure: '',
        procedureDone: '',
        outcome: '',
        reasonForCancellation: '',
        type: '',
        anaesthetic: '',
        procedureDuration: '',
        surgeonName: '',
        assistantSurgeonName: '',
        anaesthetistName: '',
        assistantAnaesthetistName: '',
        scrubNurseName: '',
        dateOfAdmission: '',
        dateOfDischarge: '',
        durationOfStay: '',
        overallOutcome: '',
        surgicalSiteInfection: '',
      }}
      validationSchema={UpdateSchema}
      onSubmit={(values) => {
        updateData(values);
      }}
    >
      {({ values, errors, touched, handleChange, setFieldTouched, isValid, handleSubmit }) => (
        <View style={styles.wrapper}>
          <StatusBar barStyle={'dark-content'} />
          <Text>Update Patient Details</Text>
          <View style={styles.formContainer}>
            {/* Render input fields */}
            <InputField
              label="Critical Events"
              value={values.criticalEvents}
              onChangeText={handleChange('criticalEvents')}
              onBlur={() => setFieldTouched('criticalEvents')}
              error={touched.criticalEvents && errors.criticalEvents}
            />
            <InputField
              label="Date of Procedure"
              value={values.dateOfProcedure}
              onChangeText={handleChange('dateOfProcedure')}
              onBlur={() => setFieldTouched('dateOfProcedure')}
              error={touched.dateOfProcedure && errors.dateOfProcedure}
            />
            <InputField
              label="Procedure Done"
              value={values.procedureDone}
              onChangeText={handleChange('procedureDone')}
              onBlur={() => setFieldTouched('procedureDone')}
              error={touched.procedureDone && errors.procedureDone}
            />
            {/* Add additional fields as necessary */}
            <TouchableOpacity
              onPress={() => handleSubmit()}
              disabled={!isValid}
              style={[styles.submitBtn, { backgroundColor: isValid ? '#2475B0' : '#000000' }]}
            >
              <Text style={styles.submitBtnTxt}>Update</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </Formik>
  );
}

// Component for rendering input fields with error handling
const InputField = ({ label, value, onChangeText, onBlur, error }) => (
  <View style={styles.inputWrapper}>
    <Text>{label}</Text>
    <TextInput
      style={styles.inputStyle}
      value={value}
      onChangeText={onChangeText}
      onBlur={onBlur}
      placeholder={label}
    />
    {error && <Text style={styles.errorTxt}>{error}</Text>}
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2C3333',
    paddingHorizontal: 15,
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 20,
    width: '100%',
  },
  inputWrapper: {
    marginBottom: 15,
  },
  inputStyle: {
    borderColor: '#16213E',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  errorTxt: {
    color: '#E71C23',
    fontSize: 12,
  },
  submitBtn: {
    padding: 10,
    borderRadius: 15,
    justifyContent: 'center',
  },
  submitBtnTxt: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '900',
  },
});
