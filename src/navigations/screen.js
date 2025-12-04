import React, {useState, useEffect} from 'react';
import {Dimensions, I18nManager} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {navigationRef, onReady, onLastScreenLeave} from '../navigations';
import {useDispatch, useSelector} from 'react-redux';
import DrawerLeft from '../component/Drawer/Left';
import messaging from '@react-native-firebase/messaging';
import {updateNotiId} from '../store/reducers/session.js';
import ScreenWrapper from '../component/ScreenWrapper';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const {width} = Dimensions.get('window');

const WIDTH_DRAWER = width * 0.78;

const listeners = ({navigation, route}) => ({
  beforeRemove: e => {
    if (e.data.action.type === 'GO_BACK') {
      onLastScreenLeave(e);
    }
  },
});

const DrawerNavUser = ({navigation}) => {
  const data = useSelector(state => state);
  console.log('cveer1', data.session);

  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerWidth: WIDTH_DRAWER,
        drawerStyle: {width: '75%'},
        drawerPosition: I18nManager.isRTL ? 'right' : 'left',
      }}
      drawerContent={props => <DrawerLeft {...props} />}
      minSwipeDistance={width}>
      {data.session.bool ? (
        <Stack.Screen
          name="PublicHome"
          component={ScreenWrapper(require('../screen/Driver/Home').default)}
        />
      ) : (
        <Stack.Screen
          name="PublicHome"
          component={ScreenWrapper(
            require('../screen/Public/Home/index.js').default,
          )}
        />
      )}
    </Drawer.Navigator>
  );
};

const DrawerNavDriver = ({navigation}) => {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerWidth: WIDTH_DRAWER,
        drawerStyle: {width: '75%'},
        drawerPosition: I18nManager.isRTL ? 'right' : 'left',
      }}
      drawerContent={props => <DrawerLeft {...props} />}
      minSwipeDistance={width}>
      <Stack.Screen
        name="DriverHome"
        component={ScreenWrapper(require('../screen/Driver/Home').default)}
      />
    </Drawer.Navigator>
  );
};

const NavRoot = ({navigation}) => {
  return null;
};

const Navigator = () => {
  const data = useSelector(state => state);
  const {user} = useSelector(state => state.session);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!user) return; // Only attach listeners if user is present

    console.log('APP INITIALIZED');

    const unsubscribeNotificationOpened = messaging().onNotificationOpenedApp(
      remoteMessage => {
        console.log(
          'onNotificationOpenedApp',
          JSON.stringify(remoteMessage, null, 2),
        );
        if (
          remoteMessage?.data?.notificationType === 'parcel_notify' &&
          user?.roles?.includes('rider')
        ) {
          dispatch(updateNotiId(remoteMessage.notification?.body));
          console.log('Notification opened from background: rider');
          navigationRef.navigate('DrawerNav', {
            screen: 'PublicHome',
            params: {data: remoteMessage.notification?.body},
          });
        } else if (
          remoteMessage?.data?.notificationType === 'parcel_reboot' &&
          user?.roles?.includes('user')
        ) {
          console.log('Notification opened from background: user');
          navigationRef.navigate('DrawerNav', {screen: 'PublicHome'});
        }
      },
    );

    // When the app is opened from a quit state
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (
          remoteMessage?.data?.notificationType === 'parcel_notify' &&
          user?.roles?.includes('rider')
        ) {
          dispatch(updateNotiId(remoteMessage.notification?.body));
          console.log('Notification opened from quit state: rider');
          navigationRef.navigate('DrawerNav', {
            screen: 'PublicHome',
            params: {data: remoteMessage.notification?.body},
          });
        }
      });

    // Foreground notifications
    const unsubscribeOnMessage = messaging().onMessage(async remoteMessage => {
      console.log(
        'FOREGROUND notification',
        JSON.stringify(remoteMessage, null, 2),
      );
      dispatch(updateNotiId(remoteMessage.notification?.body));
      console.log('aftre set');
      if (
        remoteMessage &&
        user?.roles?.includes('rider') &&
        remoteMessage?.data?.notificationType === 'parcel_notify'
      ) {
        navigationRef.navigate('DrawerNav', {
          screen: 'PublicHome',
          params: {
            data: remoteMessage.notification?.body, // <= this!
          },
        });
      } else if (
        remoteMessage?.data?.notificationType === 'parcel_reboot' &&
        user?.roles?.includes('user')
      ) {
        console.log('Foreground user notification');
        // showMessage("success", remoteMessage.notification?.body);
      }
    });

    // Cleanup to avoid memory leaks
    return () => {
      unsubscribeNotificationOpened();
      unsubscribeOnMessage();
    };
  }, [user]);

  return (
    <NavigationContainer ref={navigationRef} onReady={onReady}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName="NavRoot"
        screenListeners={listeners}>
        <Stack.Screen name="NavRoot" component={NavRoot} />
        <Stack.Screen name="DrawerNav" component={DrawerNavUser} />
        {/* <Stack.Screen name="DrawerNav" component={DrawerNavDriver} /> */}
        <Stack.Screen
          name="PublicIntro"
          component={ScreenWrapper(require('../screen/Public/Intro').default)}
        />
        <Stack.Screen
          name="PublicSignUp"
          component={ScreenWrapper(require('../screen/Public/SignUp').default)}
        />
        <Stack.Screen
          name="PublicLogin"
          component={ScreenWrapper(require('../screen/Public/Login').default)}
        />

        <Stack.Screen
          name="PublicVerification"
          component={ScreenWrapper(
            require('../screen/Public/Verification').default,
          )}
        />
        <Stack.Screen
          name="ResetPassword"
          component={ScreenWrapper(
            require('../screen/Public/ResetPassword').default,
          )}
        />
        <Stack.Screen
          name="PublicForgotPassword"
          component={ScreenWrapper(
            require('../screen/Public/ForgotPassword').default,
          )}
        />
        <Stack.Screen
          name="PublicAboutUs"
          component={ScreenWrapper(require('../screen/Public/AboutUs').default)}
        />
        <Stack.Screen
          name="PublicContact"
          component={ScreenWrapper(require('../screen/Public/Contact').default)}
        />
        {data.session.bool ? (
          <Stack.Screen
            name="PublicHome"
            component={ScreenWrapper(require('../screen/Driver/Home').default)}
          />
        ) : (
          <Stack.Screen
            name="PublicHome"
            component={ScreenWrapper(require('../screen/Public/Home').default)}
          />
        )}
        <Stack.Screen
          name="PublicSplash"
          component={ScreenWrapper(require('../screen/Public/Splash').default)}
        />
        <Stack.Screen
          name="CustomerLanguage"
          component={ScreenWrapper(
            require('../screen/Customer/Language').default,
          )}
        />
        <Stack.Screen
          name="CustomerSelectVehicle"
          component={ScreenWrapper(
            require('../screen/Customer/SelectVehicle').default,
          )}
        />
        <Stack.Screen
          name="CustomerSharedVehicle"
          component={ScreenWrapper(
            require('../screen/Customer/SharedVehicle').default,
          )}
        />
        <Stack.Screen
          name="CustomerPayment"
          component={ScreenWrapper(
            require('../screen/Customer/Payment').default,
          )}
        />
        <Stack.Screen
          name="CustomerBookingComplete"
          component={ScreenWrapper(
            require('../screen/Customer/BookingComplete').default,
          )}
        />
        <Stack.Screen
          name="DriverBookingComplete"
          component={ScreenWrapper(
            require('../screen/Driver/BookingComplete').default,
          )}
        />
        <Stack.Screen
          name="CustomerBookingConfirm"
          component={ScreenWrapper(
            require('../screen/Customer/BookingConfirm').default,
          )}
        />
        <Stack.Screen
          name="CustomerWriteUs"
          component={ScreenWrapper(
            require('../screen/Customer/WriteUs').default,
          )}
        />
        <Stack.Screen
          name="CustomerManageProfile"
          component={ScreenWrapper(
            require('../screen/Customer/ManageProfile').default,
          )}
        />
        <Stack.Screen
          name="CustomerMyTrips"
          component={ScreenWrapper(
            require('../screen/Customer/MyTrips').default,
          )}
        />
        <Stack.Screen
          name="CustomerNotification"
          component={ScreenWrapper(
            require('../screen/Customer/Notification').default,
          )}
        />
        <Stack.Screen
          name="CustomerAllPayments"
          component={ScreenWrapper(
            require('../screen/Customer/AllPayments').default,
          )}
        />
        <Stack.Screen
          name="DriverManageProfile"
          component={ScreenWrapper(
            require('../screen/Driver/ManageProfile').default,
          )}
        />
        <Stack.Screen
          name="DriverDrivingLicense"
          component={ScreenWrapper(
            require('../screen/Driver/ManageProfile/DrivingLicense').default,
          )}
        />
        <Stack.Screen
          name="DriverGovernmentId"
          component={ScreenWrapper(
            require('../screen/Driver/ManageProfile/GovernmentId').default,
          )}
        />
        <Stack.Screen
          name="DriverAddRoutes"
          component={ScreenWrapper(
            require('../screen/Driver/MyRoutes').default,
          )}
        />
        <Stack.Screen
          name="DriverRoutes"
          component={ScreenWrapper(
            require('../screen/Driver/MyAllRoute').default,
          )}
        />
        <Stack.Screen
          name="DriverNotification"
          component={ScreenWrapper(
            require('../screen/Driver/Notification').default,
          )}
        />
        <Stack.Screen
          name="DriverBooking"
          component={ScreenWrapper(require('../screen/Driver/Booking').default)}
        />
        <Stack.Screen
          name="DriverSettlement"
          component={ScreenWrapper(
            require('../screen/Driver/Settlement')?.default,
          )}
        />
        <Stack.Screen
          name="DriverPermissions"
          component={ScreenWrapper(
            require('../screen/Driver/Permissions')?.default,
          )}
        />
        <Stack.Screen
          name="DriverMyTrips"
          component={ScreenWrapper(
            require('../screen/Driver/MyTrips')?.default,
          )}
        />
        <Stack.Screen
          name="CustomerDriverTracking"
          component={ScreenWrapper(require('../screen/Tracking').default)}
        />
        <Stack.Screen
          name="showNotification"
          component={ScreenWrapper(
            require('../screen/Driver/Home/ShowNotification')?.default,
          )}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigator;
