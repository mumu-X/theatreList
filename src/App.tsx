// In App.js in a new project

import * as React from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './Pages/Pages/HomeScreen';
import SelectionScreen from './Pages/Pages/SelectionScreen';
import Display from './Pages/Pages/LiveList';
import { RootStackParamList } from './constant/types'; // Import your navigation types
import AddPtForm from './Pages/Pages/AddPtForm';

import Check from './Pages/Pages/Check';
import UpdateList from './Pages/Pages/UpdateList';
import Feedback from './Pages/Pages/Feedback';
import SignUpScreen from './Pages/Pages/SignUpScreen';






//const Stack = createNativeStackNavigator();
const Stack = createNativeStackNavigator<RootStackParamList>(); // stack navigator

function App() {
  return (
    
    <NavigationContainer >
      <Stack.Navigator initialRouteName='Home'>
        <Stack.Screen name="Signup" component={SignUpScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Selection" component={SelectionScreen} />
        <Stack.Screen name="AddPt" component={AddPtForm}/>
        <Stack.Screen name="Live" component={Display} />
        <Stack.Screen name="plist" component={Check}/>
        <Stack.Screen name="Update" component={UpdateList}/>
        <Stack.Screen name="Feedback" component={Feedback}/>
      
      </Stack.Navigator>
    </NavigationContainer>
  
    
  );
}

export default App;