import { COLOR, FAMILY, SIZE } from '../../../theme/typography'
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
const React = require('react-native')
const { Platform } = React

export default {

  container: {
    flex: 1,
    alignItems: 'center'
  },
  verificationBgImg: {
    flex: 1,
    width: "100%",
    height: "100%",
    position: "absolute",
    zIndex: 1,
  },

  verificationBgCover: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: 2,
    backgroundColor: COLOR.DARKVIOLET
  },
  verificationContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: 3,
  },
  /** -- Content --**/

  verificationForm: {
    flex: 1,
    marginHorizontal: 30,
    marginTop: 40
  },
  verificationImg: {
    width: 100,
    height: 100,
    alignSelf: "center",
    marginBottom: 30
  },
  codeText: {
    fontFamily: FAMILY.REGULAR,
    fontSize: SIZE.SIZE_18,
    color: COLOR.LIGHT,
    textAlign: 'center'
  },
  otpResendTextStyle: {
    fontSize: wp(3.5),
    alignSelf: 'center',
    marginBottom: hp(0.5),
},
  verificationTitle: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_30,
    color: COLOR.LIGHT,
    textAlign: "center",
  },
  verificationText: {
    fontFamily: FAMILY.REGULAR,
    fontSize: SIZE.SIZE_18,
    color: COLOR.LIGHT,
    // letterSpacing: 0.24,
    lineHeight: 20,
    textAlign: 'center',
    paddingTop: 10,
    // paddingBottom: 30
  },
  formRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center'
  },
  formInput: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_12,
    color: COLOR.DARK,
    backgroundColor: COLOR.LIGHT,
    borderRadius: 10,
    margin: 5,
    paddingHorizontal: 20,
    marginBottom: 15
  },
  confirmBtn: {
    backgroundColor: COLOR.GREEN,
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 15,
    width: 220,
    alignItems: 'center',
    alignSelf: "center",
    marginTop:hp(5)

  },
  confirmBtnText: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_16,
    color: COLOR.LIGHT,
    // alignSelf: "center",
  },
  verificationTimeInfo: {
    flexDirection: 'row',
    alignSelf: 'center',
    paddingVertical: 20
  },
  resendText: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_12,
    color: COLOR.LIGHT,
    alignSelf: "center",
    // alignItems: 'center',
    // flexDirection: 'row',
    // letterSpacing: 0.5,
  },
  resendTime: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_20,
    color: 'rgba(255, 178, 41, 1)',
    marginBottom: 5,
    alignSelf: 'center',

  },
  borderStyleHighLighted: {
    borderColor: "#03DAC6",
  },
  underlineStyleBase: {
    width: 50,
    height: 50,
    borderWidth: 0,
    borderBottomWidth: 1,
    backgroundColor: 'white',
    color: 'black',
    borderRadius: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    alignSelf: 'center',
    // alignContent: 'space-around'
    // flexShrink:2
    // marginRight:30

  },
  underlineStyleHighLighted: {
    borderColor: "#03DAC6",

  },

}
