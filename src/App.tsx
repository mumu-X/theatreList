import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './Pages/Pages/HomeScreen';
import SelectionScreen from './Pages/Pages/SelectionScreen';
import Display from './Pages/Pages/LiveList';
import { RootStackParamList } from './constant/types'; // Import navigation types
import AddPtForm from './Pages/Pages/AddPtForm';
import Check from './Pages/Pages/Check';
import UpdateList from './Pages/Pages/UpdateList';
import Feedback from './Pages/Pages/Feedback';
import SignUpScreen from './Pages/Pages/Signinscreens/SignUpScreen';
import CreateAcc from './Pages/Pages/Signinscreens/CreateAcc';
import ConfirmEmailScreen from './Pages/Pages/Signinscreens/ConfirmEmailscreen';
import ForgotPasswordSreen from './Pages/Pages/Signinscreens/ForgotPasswordScreen';
import ResetPassword from './Pages/Pages/Signinscreens/ResetPassword';
import { useEffect } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import PostOp_Data from './Pages/Pages/PostOp_Data';
import EnterData from './Pages/Pages/EnterData';

// Create Native Stack Navigator with types
const Stack = createNativeStackNavigator<RootStackParamList>();

// Function to request iOS notification permission
async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
}

// Function to request Android notification permission (API 33+)
async function requestAndroidNotificationPermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Notification permission granted');
    } else {
      console.log('Notification permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
}

function App() {
  // Handle notification permissions and FCM token retrieval
  useEffect(() => {
    // Request notification permissions
    if (Platform.OS === 'ios') {
      requestUserPermission(); // iOS permission
    } else if (Platform.OS === 'android' && Platform.Version >= 33) {
      requestAndroidNotificationPermission(); // Android API level 33+ permission
    }

    // Retrieve FCM Token
    async function getToken() {
      const fcmToken = await messaging().getToken();
      if (fcmToken) {
        console.log('FCM Token:', fcmToken);
      } else {
        console.log('No token received');
      }
    }
    getToken();

    // Handle notifications in the foreground
    const unsubscribeForeground = messaging().onMessage(async (remoteMessage) => {
      console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
      // Handle foreground notification here (e.g., show a local notification)
    });

    // Handle notifications when the app is opened from the background
    const unsubscribeOpenedApp = messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log('Notification caused app to open from background state:', JSON.stringify(remoteMessage));
      // Handle background notification action here
    });

    // Handle notification when the app is completely killed
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log('Notification caused app to open from quit state:', JSON.stringify(remoteMessage));
          // Handle notification action from killed state here
        }
      });

    // Clean up listeners on unmount
    return () => {
      unsubscribeForeground();
      unsubscribeOpenedApp();
    };
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Signup">
        <Stack.Screen name="ResetPassword" component={ResetPassword} />
        <Stack.Screen name="PostOP" component={PostOp_Data} />
        <Stack.Screen name="DataEntry" component={EnterData} />
        <Stack.Screen name="ConfirmEmailScreen" component={ConfirmEmailScreen} />
        <Stack.Screen name="ForgotPasswordSreen" component={ForgotPasswordSreen} />
        <Stack.Screen name="CreateAcc" component={CreateAcc} />
        <Stack.Screen name="Signup" component={SignUpScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Selection" component={SelectionScreen} />
        <Stack.Screen name="AddPt" component={AddPtForm} />
        <Stack.Screen name="Live" component={Display} />
        <Stack.Screen name="plist" component={Check} />
        <Stack.Screen name="Update" component={UpdateList} />
        <Stack.Screen name="Feedback" component={Feedback} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// This should be placed at the root level for background message handling
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log('Message handled in the background!', remoteMessage);
});

export default App;
