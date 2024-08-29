import React from 'react';
import { Alert, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../constant/types';
import { Formik } from 'formik';
import * as Yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Validation schema for the form using Yup
const SignupSchema = Yup.object().shape({
  firstName: Yup.string().required('Name is required'),
  age: Yup.number().required('Required'),
  surName: Yup.string().required('Surname is required'),
  hospNU: Yup.number().required('Hospital no. is required'),
  procedure: Yup.string().required('Required'),
  ward: Yup.string().required('Required'),
  bedNu: Yup.number().required('Required'),
});

// Props type for the AddPtForm component, extracting navigation and params
type AddPtFormProps = {
  route: RouteProp<RootStackParamList, 'AddPt'>;
};

// Component for adding patient information
export default function AddPtForm({ route }: AddPtFormProps) {
  // Extract selectedDate and selectedSpecialty from route params
  const { selectedDate, selectedSpecialty } = route.params;

  // Convert ISO string back to Date object if selectedDate is not null
  const date = selectedDate ? new Date(selectedDate) : null;

  // Access navigation object using the useNavigation hook
  const navigation = useNavigation();

  // Function to save data to AsyncStorage
  const saveData = async (newData: any) => {
    // Type guard to ensure selectedDate is a string before calling split
    const dateKey = selectedDate ? new Date(selectedDate).toISOString().split('T')[0] : '';
    
    // Generate a key using the selected specialty and the date part
    const key = `${selectedSpecialty}_${dateKey}`;
    console.log(`Saving data with key: ${key}`);
    
    try {
      // Fetch existing data from AsyncStorage using the generated key
      let existingData = await AsyncStorage.getItem(key);

      // If data exists, parse it, otherwise use an empty array
      existingData = existingData ? JSON.parse(existingData) : [];

      // Ensure existingData is an array
      const updatedData = Array.isArray(existingData) ? [...existingData, newData] : [newData];

      // Save the updated data back to AsyncStorage
      await AsyncStorage.setItem(key, JSON.stringify(updatedData));
      console.log(`Data to save: ${JSON.stringify(updatedData)}`);
      
      // Show a success alert and navigate back to the previous screen
      Alert.alert('Data saved successfully', '', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(), // Ensure navigation happens after the alert is dismissed
        },
      ]);
    } catch (error) {
      // Handle any errors during the save process
      console.error('Error saving data', error);
      Alert.alert('Failed to save the data to the storage');
    }
  };

  // Render the form using Formik
  return (
    <Formik
      initialValues={{
        firstName: '',
        age: '',
        surName: '',
        hospNU: '',
        procedure: '',
        ward: '',
        bedNu: '',
      }}
      validationSchema={SignupSchema}
      onSubmit={(values, { resetForm }) => {
        saveData(values);
        resetForm();
      }}
    >
      {({ values, errors, touched, handleChange, setFieldTouched, isValid, handleSubmit }) => (
        <View style={styles.wrapper}>
          <StatusBar barStyle={'dark-content'} />
          <View>
            <Text>Selected Date: {date ? date.toLocaleDateString() : 'None'}</Text>
            <Text>Selected Specialty: {selectedSpecialty}</Text>
          </View>
          <View style={styles.formContainer}>
            <Text style={styles.title}>Patient Details</Text>
            <View style={styles.inputwrapper}>
              <TextInput
                style={styles.inputStyle}
                placeholder='First name'
                value={values.firstName}
                onChangeText={handleChange('firstName')}
                onBlur={() => setFieldTouched('firstName')}
              />
              {touched.firstName && errors.firstName && (
                <Text style={styles.errorTxt}>{errors.firstName}</Text>
              )}
            </View>
            <View style={styles.inputwrapper}>
              <TextInput
                style={styles.inputStyle}
                placeholder='Age'
                value={values.age}
                onChangeText={handleChange('age')}
                onBlur={() => setFieldTouched('age')}
              />
              {touched.age && errors.age && (
                <Text style={styles.errorTxt}>{errors.age}</Text>
              )}
            </View>
            <View style={styles.inputwrapper}>
              <TextInput
                style={styles.inputStyle}
                placeholder='Last name'
                value={values.surName}
                onChangeText={handleChange('surName')}
                onBlur={() => setFieldTouched('surName')}
              />
              {touched.surName && errors.surName && (
                <Text style={styles.errorTxt}>{errors.surName}</Text>
              )}
            </View>
            <View style={styles.inputwrapper}>
              <TextInput
                style={styles.inputStyle}
                keyboardType='phone-pad'
                placeholder='Hospital no.'
                value={values.hospNU}
                onChangeText={handleChange('hospNU')}
                onBlur={() => setFieldTouched('hospNU')}
              />
              {touched.hospNU && errors.hospNU && (
                <Text style={styles.errorTxt}>{errors.hospNU}</Text>
              )}
            </View>
            <View style={styles.inputwrapper}>
              <TextInput
                style={styles.inputStyle}
                placeholder='Procedure'
                value={values.procedure}
                onChangeText={handleChange('procedure')}
                onBlur={() => setFieldTouched('procedure')}
              />
              {touched.procedure && errors.procedure && (
                <Text style={styles.errorTxt}>{errors.procedure}</Text>
              )}
            </View>
            <View style={styles.inputwrapper}>
              <TextInput
                style={styles.inputStyle}
                placeholder='Ward'
                value={values.ward}
                onChangeText={handleChange('ward')}
                onBlur={() => setFieldTouched('ward')}
              />
              {touched.ward && errors.ward && (
                <Text style={styles.errorTxt}>{errors.ward}</Text>
              )}
            </View>
            <View style={styles.inputwrapper}>
              <TextInput
                style={styles.inputStyle}
                keyboardType='phone-pad'
                placeholder='Bed no.'
                value={values.bedNu}
                onChangeText={handleChange('bedNu')}
                onBlur={() => setFieldTouched('bedNu')}
              />
              {touched.bedNu && errors.bedNu && (
                <Text style={styles.errorTxt}>{errors.bedNu}</Text>
              )}
            </View>
            <TouchableOpacity
              onPress={() => handleSubmit()}
              disabled={!isValid}
              style={[styles.submitBtn, { backgroundColor: isValid ? '#2475B0' : '#000000' }]}
            >
              <Text style={styles.submitBtnTxt}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </Formik>
  );
}

// Styles for the component
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
  title: {
    color: '#16213E',
    fontSize: 26,
    fontWeight: '400',
    marginBottom: 15,
  },
  inputwrapper: {
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
