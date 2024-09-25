import { View, Text, Image, StyleSheet, useWindowDimensions, ScrollView } from 'react-native';
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

  const onRegisterPressed = (values: any) => {
    console.warn('Registering', values);
    navigation.navigate('ConfirmEmailScreen');
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
          onSubmit={(values) => {
            onRegisterPressed(values);
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
                placeholder="Firstname"
                value={values.firstname}
                onChangeText={handleChange('firstname')}
                onBlur={handleBlur('firstname')}
                SecureText={false}
              />
              {touched.firstname && errors.firstname && <Text style={styles.errorTxt}>{errors.firstname}</Text>}

              <CustomInput
                placeholder="Lastname"
                value={values.lastname}
                onChangeText={handleChange('lastname')}
                onBlur={handleBlur('lastname')}
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
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                SecureText={false}
              />
              {touched.email && errors.email && <Text style={styles.errorTxt}>{errors.email}</Text>}

              <CustomInput
                placeholder="Password"
                value={values.password}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                SecureText={true}
              />
              {touched.password && errors.password && <Text style={styles.errorTxt}>{errors.password}</Text>}

              <CustomInput
                placeholder="Repeat Password"
                value={values.passwordrpt}
                onChangeText={handleChange('passwordrpt')}
                onBlur={handleBlur('passwordrpt')}
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
