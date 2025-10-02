
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { COLOR, FAMILY, SIZE } from "../../../theme/typography";
const React = require("react-native");
const { Platform } = React;

export default {
  profileHeader: {
    backgroundColor: COLOR.PRIMARY,
    paddingHorizontal: 15,
    paddingBottom: 40,
  },
  profileHeaderTitle: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_20,
    color: COLOR.LIGHT,
    marginTop: 15,
    marginLeft: 15,
    paddingBottom: 5,
  },
  profileHeaderText: {
    fontFamily: FAMILY.REGULAR,
    fontSize: SIZE.SIZE_12,
    color: COLOR.BLUE,
    marginLeft: 15,
  },
  profileContainer: {
    // paddingVertical: 10,
  },
  profileContent: {
    backgroundColor: COLOR.LIGHT,
    borderRadius: 5,
    marginHorizontal: 20,
    // marginVertical: 5,
  },
  profileImgItem: {
    alignItems: "center",
    justifyContent: "center",
  },
  profileImgDetail: {
    paddingHorizontal: 10,
    // paddingVertical: 10,
  },
  avatarImg: {
    width: 105,
    height: 105,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    elevation: 10,
    shadowOffset: {
      width: 15,
      height: 15,
    },
    shadowColor: "#333",
    shadowOpacity: 0.9,
    shadowRadius: 0,
    backgroundColor: COLOR.LIGHT,
    // marginTop: 15,
    alignSelf: "center",
    top: -5
  },
  profileImg: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editBtn: {
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
  formRow: {
    borderBottomWidth: 1,
    borderColor: COLOR.LIGHTVIOLET,
    paddingHorizontal: 20,
    marginBottom: 5,
  },
  formRow2: {
    flex: 1,
    paddingHorizontal: 20,
  },
  formText: {
    fontFamily: FAMILY.REGULAR,
    fontSize: SIZE.SIZE_12,
    color: COLOR.SMOKEVIOLET,
  },
  formInput: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_12,
    color: COLOR.GREYVIOLET,
    paddingVertical: 10,
    paddingHorizontal: 0,
  },
  profileBtnInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: COLOR.LIGHTVIOLET,
   
  },
  profileBtnInfoTwo: {
    borderBottomWidth: 0,
  },

  permissionContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  permissionBtn: {
    alignSelf: "flex-end",
    backgroundColor: COLOR.GREYVIOLET,
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  uploadBtn: {
    alignSelf: "center",
    backgroundColor: COLOR.BLUE,
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  uploadBtnText: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_10,
    color: COLOR.DARKBLUE,
  },
  uploadBtnText: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_10,
    color: COLOR.LIGHT,
  },
  saveBtn: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLOR.GREEN,
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 15,
    margin: 20,
  },
  saveBtnText: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_12,
    color: COLOR.LIGHT,
  },

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
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  profileContent: {
    backgroundColor: COLOR.LIGHT,
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
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
    marginBottom: 10,
  },
  formInput: {
    fontFamily: FAMILY.REGULAR,
    fontSize: SIZE.SIZE_12,
    color: COLOR.DARKBLUE,
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
    paddingTop: 10,
    alignItems: "center",
  },
  profileform: {
    flex: 1,
    flexDirection: "column",
  },
  permissionHeader: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_30,
    color: COLOR.DARK,
    marginBottom: 5,
  },
  permissionText: {
    fontFamily: FAMILY.REGULAR,
    fontSize: SIZE.SIZE_14,
    color: COLOR.DARK,
    marginBottom: 5,
  },
  permissionLabel: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_14,
    color: COLOR.DARK,
    marginBottom: 5,
  },
  switchInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: COLOR.SMOKELIGHT,
    // backgroundColor:'red',
    width: "92%",
  },
  switchText: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_16,
    color: COLOR.DARK,
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
    marginVertical: 5,
  },
  formRow2: {
    width:wp(41),
    // backgroundColor:'red'
  },
  inputInfo: {
    marginVertical: 10,
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
  loaderContainerStyles: {
    width: "100%",
    height: 500,
    alignItems: "center",
    justifyContent: "center",
  },
  uploadbtn2:{
    width:wp(90),
    alignSelf:'center',
    backgroundColor:'#5CBA47',
    alignItems:'center',
    height:hp(6),
    borderRadius:10,
    justifyContent:'center',
    bottom:hp(-15)
  },
  saveBtnText2:{
    color:"#fff"
  },
  icon:{
    fontSize: SIZE.SIZE_20,
    color: "red"
  },
  crossView:{
    backgroundColor:"#fff",
    position:'absolute',
    right:0,
    borderRadius:100,
    padding:2,
  }
};
