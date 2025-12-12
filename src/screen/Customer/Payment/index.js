import React, {useState} from 'react';
import {View, KeyboardAvoidingView, Platform} from 'react-native';
import {Container, Text} from '../../../component/Basic';
import styles from './styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CreditCardInput} from 'react-native-credit-card-input';
import Header from '../../../component/Header';
import axios from 'axios';
import {showMessage} from '../../../helper/showAlert';
import {DarkStatusBar} from '../../../component/StatusBar';
import {BASE_URL, URL_V} from '../../../utilities/helper';
import {Button} from '../../../component/Form';
import {navigateReset} from '../../../navigations';
import AppSpinner from '../../../component/AppSpinner';

const Payment = () => {
  const [CardInput, setCardInput] = useState({});
  const [loading, setLoading] = useState(false);

  const postData = async () => {
    setLoading(true);
    var data = await AsyncStorage.getItem('response');
    var datas = JSON.parse(data);
    console.log(CardInput.values.expiry.split('/'));

    const res = axios
      .post(
        `${BASE_URL}${URL_V}payment`,
        {
          card_number: CardInput.values.number,
          card_exp_month: CardInput.values.expiry.split('/')[0],
          card_exp_year: CardInput.values.expiry.split('/')[1],
          card_cvc: CardInput.values.cvc,
          payment_method: 'pm_card_visa',
        },
        {
          headers: {
            Authorization: `Bearer ${datas.access_token}`,
          },
        },
      )
      .then(data => {
        console.log('Card res', data);
        setLoading(false);
        showMessage('success', 'Payment Method is Added Succefully');
        navigateReset('CustomerAllPayments');
        // makePaymentByUser(data.data.payment_method);
      })
      .catch(err => {
        setLoading(false);
        showMessage('error', 'Error in added payment method');
        console.log('CURRENT ERROR===>', err.response.data);
      });
  };

  // const makePaymentByUser = async method => {
  //   console.log('Method in paymentByUser ', method);
  //   var data = await AsyncStorage.getItem('response');
  //   var datas = JSON.parse(data);

  //   axios
  //     .post(
  //       `${BASE_URL}${URL_V}payment/transfer`,
  //       {
  //         paymentMethod: method,
  //         currency: 'cad',
  //         amount: '250',
  //         rider_account: 'acct_1MwmIbPu2iasesq5',
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${datas.access_token}`,
  //         },
  //       },
  //     )
  //     .then(data => {
  //       console.log('result to make payment', data.data);
  //     })
  //     .catch(err => {
  //       console.log('error546', err.response);
  //     });
  // };

  const onSubmit = () => {
    if (CardInput.valid == false || typeof CardInput.valid == 'undefined') {
      showMessage('error', 'Invalid Credit Card');
      navigateReset('CustomerAllPayments');
      return false;
    } else {
      // await Support.showSuccess({
      //   title: 'Success!',
      //   message: 'Payment Method is Added Succefully',
      //   onHide: () => {
      //     console.log(CardInput);
      //     // makePaymentByUser();
      //     // postData();
      //     onDisplayNotification();
      //     navigateReset('PublicHome');
      //   },
      //   hideDelay: 2500,
      // });
      postData();
    }
  };

  const onDisplayNotification = async () => {
    const channelId = await notifee.createChannel({
      id: 'important',
      name: 'Important Notifications',
      importance: AndroidImportance.HIGH,
    });

    await notifee.displayNotification({
      title: 'Your New Order Is Ready ',
      body: 'You can see you order requirment going to in my Trip',
      android: {
        channelId,
        importance: AndroidImportance.HIGH,
      },
    });
  };

  return (
    <Container>
      <DarkStatusBar />
      <Header leftType="back" title="ADD CARD" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}>
        <Container>
          <View style={styles.payPalInfo}>
            <CreditCardInput
              inputContainerStyle={styles.inputContainerStyle}
              inputStyle={styles.inputStyle}
              labelStyle={styles.labelStyle}
              validColor="#fff"
              placeholderColor="#ccc"
              onChange={data => {
                setCardInput(data);
              }}
            />
          </View>
        </Container>
      </KeyboardAvoidingView>
      <Button
        style={styles.payBtn}
        disabled={loading}
        onPress={() => {
          onSubmit();
        }}>
        {loading ? (
          <AppSpinner />
        ) : (
          <Text style={styles.payBtnText}>SAVE CARD</Text>
        )}
      </Button>
    </Container>
  );
};

export default Payment;
