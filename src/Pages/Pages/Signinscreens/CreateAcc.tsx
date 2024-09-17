import { View, Text, Image, StyleSheet, useWindowDimensions, ScrollView, Alert } from 'react-native';
import React from 'react';
import CustomInput from '../../../components/LoginComponents/CustomInput';
import CustomButton from '../../../components/LoginComponents/CustomButton';
import DropDropdownSelectordown from '../../../components/LoginComponents/DropdownSelector';
import { hospitalDepartments } from '../../../constant/Departments';
import { titles } from '../../../constant/Titles';
import SocialSigninBTNS from '../../../components/LoginComponents/SocialSigninBTNS';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../constant/types';
import { Formik } from 'formik';
import * as Yup from 'yup';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

// Define the navigation prop type
type createaccscreen = StackNavigationProp<RootStackParamList, 'CreateAcc'>

// Format data for dropdowns
const formattedSpecialties = hospitalDepartments.map(s => ({ value: s.label, Label: s.label + s.flag }));
const formattedTitles = titles.map(s => ({ value: s.label, Label: s.label + s.flag }));

// Validation schema using Yup
const SignupSchema = Yup.object().shape({
  firstname: Yup.string().required('First name is required'),
  lastname: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  passwordrpt: Yup.string().oneOf([Yup.ref('password')], 'Passwords must match').required('Repeat password is required'),
  title: Yup.string().required('Title is required'),
  department: Yup.string().required('Department is required'),
});





const CreateAcc = () => {
  const navigation = useNavigation<createaccscreen>();

  const createUser = async (values: any) => {
    try {
      // Create the user
    const userCredential = await auth().createUserWithEmailAndPassword(values.email, values.password);
    const user = userCredential.user;


      console.log('User account created & signed in!');

      // Update the user's display name
    await user.updateProfile({
      displayName: `${values.title} ${values.lastname}`,
    });
    console.log('User account created with display name:', user.displayName);


    // Now save their role (department) via custom claims, which needs to be done server-side

    // Optionally, save user data to Firestore
    await saveData(values);
      console.warn('Registered', values);
      navigation.navigate('ConfirmEmailScreen');
    } 
    
    catch (error) {
      // Add more detailed error handling
      if (error instanceof Error) {
        const errorCode = (error as any).code; // Use 'any' to bypass TypeScript check
        const errorMessage = error.message;
  
        // Log the error for debugging
        console.error('Error code:', errorCode);
        console.error('Error message:', errorMessage);
  
        // Check for specific error codes and show alerts accordingly
        switch (errorCode) {
          case 'auth/email-already-in-use':
            Alert.alert('Error', 'That email address is already in use.');
            break;
          case 'auth/invalid-email':
            Alert.alert('Error', 'That email address is invalid.');
            break;
          case 'auth/weak-password':
            Alert.alert('Error', 'The password is too weak.');
            break;
          default:
            Alert.alert('Error', 'An unknown error occurred.');
            break;
        }
      }
    }
  };
  

  const onRegisterPressed = async (values: any) => {
    console.warn('Registering', values);
    try {
      await createUser(values); // **Create user now**
    } catch (error) {
      console.error('Error during registration:', error);
    }
  };

  const onTermsofuse = () => {
    console.warn('onTermsofusePressed');
  };

  const onPrivacyPolicy = () => {
    console.warn('onPrivacyPolicyPressed');
  };

  const onSigninPressed = () => {
    console.warn('onSigninPressed');
    navigation.navigate('Signup');
  };

    // Function to save data to Firestore
  const saveData = async (newData: any) => {
    // Create a new object with fields from newData and include selectedDate
    const dataToSave = {
      ...newData,
    };

    // Generate a collection name using the selected specialty
    const collectionName = `Users`;
    console.log(`Saving data to Firestore collection: ${collectionName}`);

    try {
      // Add new data to Firestore collection
      await firestore().collection(collectionName).add(dataToSave);

      // Show a success alert and navigate back to the previous screen
      Alert.alert('Data saved successfully', '',);
    } catch (error) {
      // Handle any errors during the save process
      console.error('Error saving data to Firestore', error);
      Alert.alert('Failed to save the data to Firestore');
    }
  };

  

  return (
    <ScrollView>
      <View style={styles.root}>
        <Text style={styles.title}>Create an Account</Text>

        {/* Formik integration */}
        <Formik
          initialValues={{
            firstname: '',
            lastname: '',
            email: '',
            password: '',
            passwordrpt: '',
            title: '',
            department: ''
          }}
          validationSchema={SignupSchema}
          onSubmit={(values , {resetForm}) => {
            onRegisterPressed(values);
            resetForm();
          }}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
            isValid
          }) => (
            <>
              <CustomInput
                placeholder="First name"
                value={values.firstname}
                setValue={handleChange('firstname')}
                SecureText={false}
              />
              {touched.firstname && errors.firstname && <Text style={styles.errorTxt}>{errors.firstname}</Text>}

              <CustomInput
                placeholder="Lastname"
                value={values.lastname}
                setValue ={handleChange('lastname')}
                SecureText={false}
              />
              {touched.lastname && errors.lastname && <Text style={styles.errorTxt}>{errors.lastname}</Text>}

              <DropDropdownSelectordown
                data={formattedTitles}
                onChange={(item) => handleChange('title')(item.value)}
                placeholder="Choose Title"
                value={values.title}
                setValue={handleChange('title')}
              />
              {touched.title && errors.title && <Text style={styles.errorTxt}>{errors.title}</Text>}
              <CustomInput
                placeholder="Email"
                value={values.email}
                setValue={handleChange('email')}
                SecureText={false}
              />
              {touched.email && errors.email && <Text style={styles.errorTxt}>{errors.email}</Text>}

              <CustomInput
                placeholder="Password"
                value={values.password}
                setValue={handleChange('password')}
                SecureText={true}
              />
              {touched.password && errors.password && <Text style={styles.errorTxt}>{errors.password}</Text>}

              <CustomInput
                placeholder="Repeat Password"
                value={values.passwordrpt}
                setValue={handleChange('passwordrpt')}
               // onBlur={handleBlur('passwordrpt')}
                SecureText={true}
              />
              {touched.passwordrpt && errors.passwordrpt && <Text style={styles.errorTxt}>{errors.passwordrpt}</Text>}

              <DropDropdownSelectordown
                data={formattedSpecialties}
                onChange={(item) => handleChange('department')(item.value)}
                placeholder="Choose Department"
                value={values.department}
                setValue={handleChange('department')}
              />
              {touched.department && errors.department && <Text style={styles.errorTxt}>{errors.department}</Text>}

              {/* Register Button */}
              <CustomButton
                text="Register"
                onPress={handleSubmit}
                type={isValid ? 'PRIMARY' : 'TERTIARY'}
              />

              <Text style={styles.text}>
                By registering you confirm that you accept our{' '}
                <Text style={styles.link} onPress={onTermsofuse}>terms of use </Text> and{' '}
                <Text style={styles.link} onPress={onPrivacyPolicy}>privacy policy</Text>
              </Text>

              <SocialSigninBTNS />

              <CustomButton
                text="Have an account? Sign in?"
                onPress={onSigninPressed}
                type="TERTIARY"
              />
            </>
          )}
        </Formik>
      </View>
    </ScrollView>
  );
};

// Styles
const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F9FBFC',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#051c60',
    margin: 10,
  },
  text: {
    color: 'gray',
    marginVertical: 10,
  },
  link: {
    color: '#fdb075',
  },
  errorTxt: {
    color: 'red',
    fontSize: 12,
  },
});

export default CreateAcc;
