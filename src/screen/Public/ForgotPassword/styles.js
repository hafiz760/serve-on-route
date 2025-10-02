import { COLOR, FAMILY, SIZE } from "../../../theme/typography";

const React = require("react-native");
const { Platform } = React;

export default {
  container: {
    flex: 1
  },

  ForgotBgImg: {
    flex: 1,
    width: "100%",
    height: "100%",
    position: "absolute",
    zIndex: 1,
  },
  forgotBgCover: {
    flex: 1,
    width: "100%",
    height: "100%",
    position: "absolute",
    zIndex: 2,
    backgroundColor: COLOR.DARKVIOLET,
  },

  forgotBgContainer: {
    flex: 1,
    width: "100%",
    height: "100%",
    position: "absolute",
    zIndex: 3,
  },
  /** -- Content --**/
  forgotUpForm: {
    flex: 1,
    marginHorizontal: 20,
    marginTop: 50,
  },
  ForgotImg: {
    width: 126,
    height: 126,
    alignSelf: "center",
    marginTop: 30,
    marginBottom: 15,
  },
  forgotTitle: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_30,
    color: COLOR.LIGHT,
    textAlign: "center",
    marginBottom: 18
  },
  forgotText: {
    // fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_18,
    color: COLOR.LIGHT,
    textAlign: "center",
    lineHeight: 21,
    marginBottom: 31,
  },

  formInput4: {
    width: "100%",
    fontFamily: FAMILY.REGULAR,
    fontSize: SIZE.SIZE_20,
    color: COLOR.DARK,
    backgroundColor: COLOR.LIGHT,
    borderRadius: 10,
  },

  forgotBtn: {
    backgroundColor: COLOR.GREEN,
    borderRadius: 10,
    paddingVertical: 15,
    marginTop: 44,
  },
  forgotBtnText: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_14,
    color: COLOR.LIGHT,
    alignSelf: "center",
  },


};
