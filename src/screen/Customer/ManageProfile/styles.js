import { COLOR, FAMILY, SIZE } from "../../../theme/typography";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
const React = require("react-native");
const { Platform } = React;

export default {
  /* --Tab-- */
  tabInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    backgroundColor: "green",
  },
  tabActive: {
    flex: 1,
    alignItems: "center",
    backgroundColor: COLOR.BLUE,
    borderRadius: 3,
    paddingVertical: 10,
    marginHorizontal: 5,
  },
  tabInactive: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 3,
    paddingVertical: 10,
    marginHorizontal: 5,
  },
  tabTextActive: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_12,
    color: COLOR.LIGHT,
  },
  tabTextInactive: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_12,
    color: "rgba(255,255,255,0.5)",
  },
  /* --Content-- */
  profileHeader: {
    backgroundColor: COLOR.PRIMARY,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  profileHeaderTitle: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_20,
    color: COLOR.LIGHT,
    marginBottom: 5,
  },
  profileHeaderText: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_12,
    color: COLOR.BLUE,
    marginBottom: 10,
  },
  /* --Profile-- */
  profileContainer: {
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  profileContent: {
    backgroundColor: COLOR.LIGHT,
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  profileImgInfo: {
    alignSelf: "center",
    justifyContent: "center",
  },
  profileBgImg: {
    width: 100,
    height: 100,
    justifyContent: "center",
    backgroundColor: COLOR.LIGHT,
    borderRadius: 50,
    shadowOpacity: 0.9,
    elevation: 10,
    shadowOffset: {
      height: 0,
    },
    shadowRadius: 0,
    shadowColor: "#CCC",
  },
  profileImg: {
    width: 90,
    height: 90,
    borderRadius: 45,
    position: "absolute",
    alignSelf: "center",
  },
  iconDetail: {
    width: 30,
    height: 30,
    borderRadius: 15,
    position: "absolute",
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLOR.LIGHT,
    shadowOpacity: 0.9,
    elevation: 10,
    shadowOffset: {
      height: 0,
    },
    shadowRadius: 0,
    shadowColor: "#CCC",
  },
  editName: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_12,
    color: COLOR.GREYDARK,
  },
  formRow: {
    marginBottom: 20,
  },
  formInput: {
    fontFamily: FAMILY.REGULAR,
    fontSize: SIZE.SIZE_12,
    color: COLOR.PRIMARY,
    borderBottomWidth: 1,
    borderColor: COLOR.SMOKELIGHT,
  },
  formText: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_12,
    color: COLOR.DARKBLUE,
  },
  saveBtn: {
    backgroundColor: COLOR.GREEN,
    borderRadius: 5,
    marginTop: 30,
    marginBottom:hp(20)
  },
  saveBtnText: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_12,
    color: COLOR.LIGHT,
    textAlign: "center",
    paddingVertical: 15,
  },
  /* --permission-- */
  profileInputDetail: {
    marginBottom: 20,
  },
  permissionText: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_12,
    color: COLOR.DARKBLUE,
    marginBottom: 5,
  },
  switchInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: COLOR.SMOKELIGHT,
    paddingBottom: 20,
    marginBottom: 10,
  },
  switchText: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_12,
    color: COLOR.SMOKEVIOLET,
  },

  /* --insurance-- */
  insuranceTitle: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_12,
    color: COLOR.DARKBLUE,
  },
  insuranceDetail: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: COLOR.SMOKELIGHT,
    paddingVertical: 15,
  },
  checkDetail: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkText: {
    fontFamily: FAMILY.REGULAR,
    fontSize: SIZE.SIZE_12,
    color: COLOR.DARK,
  },
  coverageBtn: {
    justifyContent: "flex-end",
    backgroundColor: COLOR.BLUE,
    borderRadius: 5,
  },
  coverageBtnText: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_10,
    color: COLOR.LIGHT,
    textAlign: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  /** - - Modal Box Booking- - **/
  modalSort: {
    height: "60%",
    width: "90%",
    borderRadius: 10,
    backgroundColor: COLOR.LIGHT,
  },
  closeHiddenDesc: {
    alignItems: "flex-end",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  modalDetail: {
    backgroundColor: COLOR.SMOKEBLUE,
  },
  modalTitle: {
    fontFamily: FAMILY.BOLD,
    fontSize: 12,
    color: COLOR.DARK,
    marginBottom: 10,
    paddingLeft: 20,
  },
  modalDesc: {
    fontFamily: FAMILY.REGULAR,
    fontSize: SIZE.SIZE_12,
    color: COLOR.DARKBLUE,
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  paymentHeader: {
    backgroundColor: "rgba(89, 73, 158, 1)",
    paddingHorizontal: 15,
    paddingBottom: 40,
  },
  paymentHeaderTitle: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_20,
    color: COLOR.LIGHT,
    marginTop: 15,
    marginLeft: 15,
    paddingBottom: 5,
  },
  paymentHeaderText: {
    fontFamily: FAMILY.REGULAR,
    fontSize: SIZE.SIZE_12,
    color: COLOR.BLUE,
    marginLeft: 15,
  },
  paymentContainer: {
    backgroundColor: COLOR.LIGHT,
    borderRadius: 5,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  /* --PaymentTab-- */
  tabInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 2,
    paddingVertical: 2,
    marginVertical: 15,
    marginHorizontal: 20,
  },
  tabActive1: {
    flex: 1,
    alignItems: "center",
    backgroundColor: COLOR.LIGHT,
    borderRadius: 3,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginHorizontal: 3,
  },
  tabInactive: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 3,
    borderRadius: 3,
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: "rgba(49,51,86,0.05)",
  },
  tabImgActive: {
    width: 40,
    height: 40,
  },
  tabImgInactive: {
    width: 40,
    height: 40,
    color: COLOR.GREY,
  },
  /** -- Card -- **/
  payPalInfo: {
    marginHorizontal: 20,
    marginVertical: 15,
  },
  cardImg: {
    width: 70,
    height: 50,
  },
  paymentForm: {
    paddingHorizontal: 30,
    paddingVertical: 30,
  },
  formRow: {
    marginVertical: 10
  },
  formRow2: {
    flex: 5,
    marginRight: 10,
  },
  inputInfo: {
    marginVertical: 10,
  },
  dropDown:{
    borderRightWidth: 0, // Set border on the right side
    borderLeftWidth: 0, // Set border on the left side
   borderTopWidth: 0, // Set border on the bottom side
   fontFamily: FAMILY.BOLD,
   fontSize: SIZE.SIZE_14,
   color: COLOR.DARK,
   borderColor: "rgba(42,33,77,0.1)",
   borderBottomWidth: 1,
   paddingVertical: 10,
    
  },
  formText: {
    fontFamily: FAMILY.REGULAR,
    fontSize: SIZE.SIZE_10,
    color: COLOR.SMOKEVIOLET,
    paddingBottom: 5,
  },
  formInput: {
    
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_14,
    color: COLOR.DARK,
    borderColor: "rgba(42,33,77,0.1)",
    borderBottomWidth: 1,
    paddingVertical: 10,
  },
  cardInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  payBtn: {
    alignItems: "center",
    backgroundColor: COLOR.GREEN,
    borderRadius: 5,
    paddingVertical: 15,
    marginHorizontal: 20,
    marginBottom: 10,
    position: "absolute",
    top: 500,
    width: "90%",
  },
  payBtnText: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_12,
    color: COLOR.LIGHT,
  },
  button : {
    backgroundColor:'#2471A3',
    width:150,
    height:45,
    alignSelf:'center',
    justifyContent:'center',
    alignItems:'center',
    marginTop:20,
    borderRadius:5
  },
  buttonText : {
    fontSize: 15,
    color: '#f4f4f4',
    fontWeight:'bold',
    textTransform:'uppercase'
  },
  inputContainerStyle : {
    backgroundColor:'#fff',
    borderRadius:5
  },
  inputStyle : {
    backgroundColor:'#222242',
    paddingLeft:15,
    borderRadius:5,
    color:'#fff'
  },
  labelStyle : {
    marginBottom:5,
    fontSize:12
  }
};
