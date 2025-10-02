import React, {useState, useEffect, useCallback} from 'react';
import {View, ScrollView, Image, TouchableOpacity} from 'react-native';
import {Container, Content, Text, Icon} from '../../../component/Basic';
import {Button} from '../../../component/Form';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './styles';
import theme from '../../../theme/styles';

import Header from '../../../component/Header';
import {DarkStatusBar} from '../../../component/StatusBar';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import axios from 'axios';
import {useDispatch} from 'react-redux';
import {showMessage} from '../../../helper/showAlert';
import {navigate, navigateReset} from '../../../navigations';
import OtpInput from '../../../component/OtpInput';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {FAMILY} from '../../../theme/typography';
import {useFocusEffect} from '@react-navigation/native';
const qs = require('qs');

export default function Verification(props) {
  const [data, setData] = useState({});
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const dispatch = useDispatch();
  const [isCodeValid, setIsCodeValid] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(true);
  const param=props.route.params
  console.log("param",param);
  var isSecond = 60;
  var x;
  const [counter, setCounter] = useState(60);

  useFocusEffect(
    useCallback(() => {
      if (timer) {
        x = setInterval(() => {
          let temp = isSecond - 1;
          isSecond = temp;
          if (isSecond < 10) {
            setCounter('0' + isSecond);
          } else {
            setCounter(isSecond);
          }

          if (isSecond == 0) {
            clearInterval(x);
            setTimer(false);
            setCounter(60);
          }
        }, 1000);
      }
    }, [timer]),
  );
  useEffect(() => {
    const initializeData = async () => {
      setData(props.route.params.values);
      const emailStored = await AsyncStorage.getItem('email');
      const phoneNumber = await AsyncStorage.getItem('phoneNumber');
      setEmail(emailStored);
      setPhone(phoneNumber);
    };

    initializeData();
  }, [props.route.params.values]);

  const logins = async () => {
    if(otpCode==="0000"){
     if( param.from!="signUP"){
      navigate("ResetPassword")
     }else{
      navigateReset("PublicHome");
     }
    
    }else{
      console.log("else called");
    }
      
  }

  const ResendOtp = v => {
    setTimer(true);
  };

  return (
    <Container>
      <DarkStatusBar />
    
      <Image
        source={{
          uri: 'https://cdn.pixabay.com/photo/2018/08/01/21/49/peterbilt-3578297_960_720.jpg',
        }}
        resizeMode="cover"
        style={styles.verificationBgImg}
      />
      <View style={styles.verificationBgCover} />
      <View style={styles.verificationContainer}>
        <ScrollView>
          <Content contentContainerStyle={theme.layoutDf}>
          <Header leftType="back" />
            <View style={styles.verificationForm}>
              <Image
                // source={require('../../../assets/images/unlock.png')}
                source={require("../../../assets/images/lock.png")}
                resizeMode="contain"
                style={styles.verificationImg}
              />

              <Text style={styles.codeText}>VERIFICATION CODE</Text>
              <Text style={styles.verificationTitle}>CONFIRMATION</Text>
              <Text style={styles.verificationText}>
                {`Enter the 4-digit OTP sent to you at your number 03...`}000
              </Text>

            <View style={{marginTop:hp(5)}}>
            <OtpInput
                length={4}
                iscode={isCodeValid}
                onComplete={code => {
                  setOtpCode(code);
                }}
              />
            </View>

              {/* <OTPInputView
                style={{ height: 100 }}
                pinCount={4}
                code={code}
                onCodeChanged={setCode}
                autoFocusOnLoad
                codeInputFieldStyle={styles.underlineStyleBase}
                codeInputHighlightStyle={styles.underlineStyleHighLighted}
              /> */}
              <View style={{marginTop: hp(3)}}>
                <>
                  <Text
                    style={{
                      ...styles.otpResendTextStyle,
                      color: '#BABABA',
                      fontFamily: FAMILY.REGULAR,
                    }}>
                    Didn’t receive code?
                  </Text>
                  <TouchableOpacity
                    onPress={ResendOtp}
                    disabled={isLoading || timer}>
                    <Text
                      style={{
                        ...styles.otpResendTextStyle,
                        color: isLoading || timer ? '#BABABA' : 'white',
                        fontFamily: FAMILY.REGULAR,
                        textDecorationLine: 'underline',
                        fontWeight: 'bold',
                      }}>
                      Resend OTP
                    </Text>
                  </TouchableOpacity>
                  {timer ? (
                    <Text
                      style={{
                        ...styles.otpResendTextStyle,
                        color: 'white',
                        fontFamily: FAMILY.REGULAR,
                        marginTop: hp(1),
                      }}>{`00:${counter}`}</Text>
                  ) : null}
                </>
              </View>

              <Button
                style={styles.confirmBtn}
                onPress={logins}
                disabled={loading}>
                <Text style={styles.confirmBtnText}>VERIFY</Text>
              </Button>
            </View>
          </Content>
        </ScrollView>
      </View>
    </Container>
  );
}
