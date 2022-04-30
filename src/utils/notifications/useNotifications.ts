import * as Notifications from 'expo-notifications'
import Constants from 'expo-constants';
import * as Device from 'expo-device'
import { useState, useEffect, useRef} from 'react';
import {Platform} from 'react-native'
import { Subscription } from 'expo-modules-core';
import { useUserActions } from '../session/useUserActions';
import { usePersistentAtom } from '../state/userState';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

export function useNotifications(){
    const userActions = useUserActions()
    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(null as Notifications.Notification);
    const notificationListener = useRef(null as Subscription);
    const responseListener = useRef(null as Subscription);

    useEffect(() => {
        registerForPushNotificationsAsync().then(token =>{
            setExpoPushToken(token)
            // console.log({pushToken: token})
            userActions.postPushToken(token)
        });

        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log(response);
        });

        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);

    return {
        expoPushToken,
        notification,

    }
}

export async function schedulePushNotification() {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "You've got mail! 📬",
        body: 'Here is the notification body',
        data: { data: 'goes here' },
      },
      trigger: {  },
    });
  }
  
  async function registerForPushNotificationsAsync() {
    let token;
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        // alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
    } else {
    //   alert('Must use physical device for Push Notifications');
    }
  
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  
    return token;
  }