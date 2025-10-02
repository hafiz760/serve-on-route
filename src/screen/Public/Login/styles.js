import { COLOR, FAMILY, SIZE } from "../../../theme/typography";

const React = require("react-native");
const { Platform } = React;

export default {
  container: {
    flex:1
  },

  signUpBgImg: {
    flex: 1,
    width: "100%",
    height: "100%",
    position: "absolute",
    zIndex: 1,
  },
  signUpBgCover: {
    flex: 1,
    width: "100%",
    height: "100%",
    position: "absolute",
    zIndex: 2,
    backgroundColor: COLOR.DARKVIOLET,
  },
  connectText11: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_16,
    color: COLOR.LIGHT,
    alignSelf: "center",
    letterSpacing: 0.5,
  },
  signUpBgContainer: {
    flex: 1,
    width: "100%",
    height: "100%",
    position: "absolute",
    zIndex: 3,
  },
  /** -- Content --**/
  signUpForm: {
    flex: 1,
    marginHorizontal: 30,
    marginTop: 30,
  },
  loginUpImg: {
    width: 120,
    height: 120,
    alignSelf: "center",
    // marginTop: 30,
    // marginBottom: 15,
    // backgroundColor:"#544548"
  },
  loginTitle: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_30,
    color: COLOR.LIGHT,
    textAlign: "center",
  },
  loginText: {
    fontFamily: FAMILY.REGULAR,
    fontSize: SIZE.SIZE_20,
    color: COLOR.LIGHT,
    textAlign: "center",
    lineHeight: 24,
  },
  formInput: {
    flex: 1,
    fontFamily: FAMILY.REGULAR,
    fontSize: SIZE.SIZE_12,
    color: COLOR.DARK,
    backgroundColor: COLOR.LIGHT,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  formInput3: {
    width: "100%",
    fontFamily: FAMILY.REGULAR,
    fontSize: SIZE.SIZE_14,
    color: COLOR.DARK,
    backgroundColor: COLOR.LIGHT,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  formInput4: {
    width: "100%",
    fontFamily: FAMILY.REGULAR,
    fontSize: SIZE.SIZE_20,
    color: COLOR.DARK,
    backgroundColor: COLOR.LIGHT,
    borderRadius: 10,
  },
  formInput2: {
    marginLeft: 15,
  },
  loginUpBtn: {
    backgroundColor: COLOR.GREEN,
    borderRadius: 10,
    paddingVertical: 15,
    marginTop: -6,
  },
  loginBtnText: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_14,
    color: COLOR.LIGHT,
    alignSelf: "center",
  },
  signUpContent: {
    marginVertical: 20,
  },
  forgotText: {
    fontFamily: FAMILY.LIGHT,
    fontSize: SIZE.SIZE_14,
    color: COLOR.YELLOW,
    textDecorationLine: "underline",
    letterSpacing: 1,
  },
  connectText: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_12,
    color: COLOR.LIGHT,
    alignSelf: "center",
    letterSpacing: 0.5,
  },
  connectTextLink: {
    fontFamily: FAMILY.REGULAR,
    fontSize: SIZE.SIZE_14,
    color: COLOR.YELLOW,
    alignSelf: "center",
    letterSpacing: 1,
    paddingBottom: 10,
    textDecorationLine: "underline",
  },
  smnItem: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
  },
  smnBtn: {
    flexDirection: "row",
    backgroundColor: "transparent",
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  smnFacebook: {
    backgroundColor: COLOR.LIGHT,
  },
  smnTwitter: {
    backgroundColor: COLOR.LIGHT,
    marginLeft: 15,
  },
  smnGooglePlus: {
    backgroundColor: COLOR.LIGHT,
    marginLeft: 15,
  },
  tabInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 21,
    // justifyContent: "space-between",

  },
  tabActive: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "green",
    borderRadius: 10,
    paddingVertical: 15,
    marginHorizontal: 10
  },
  tabInactive: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 10,
    paddingVertical: 15,
    marginHorizontal: 10

  },
  tabTextActive: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_18,
    color: COLOR.LIGHT,
  },
  tabTextInactive: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_18,
    color: "rgba(255,255,255,0.5)",
  },
  termText: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_12,
    color: COLOR.LIGHT,
    alignSelf: "center",
    textAlign: "center",
    lineHeight: 20,
    marginTop: 10,
  },
  term2Text:{
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_12,
    color: COLOR.YELLOW,
    alignSelf: "center",
    textAlign: "center",
   
  }
};
