import { COLOR, FAMILY, SIZE } from "../../../theme/typography";

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
const React = require("react-native");
const { Platform } = React;

export default {
  selectVehicleContainer: {
    paddingHorizontal: 20,
    // paddingVertical: 20,
  },

  selectVehicleContent: {
    // paddingVertical: 10,
  },
  formRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLOR.LIGHT,
    borderRadius: 10,
    marginBottom: 10,
    paddingHorizontal: 20,
    marginVertical: 10,
    // backgroundColor:'red',

  },
  formRow2: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLOR.LIGHT,
    borderRadius: 10,
    marginBottom: 10,
    paddingHorizontal: 20,
    marginVertical: 10,
    // backgroundColor:'red',

  },
  
  formInput: {
    fontFamily: FAMILY.REGULAR,
    fontSize: SIZE.SIZE_14,
    color: COLOR.DARKVIOLET,
    marginVertical:10
    // paddingHorizontal: 20,
  },
  formRow2: {
    // width: "50%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLOR.LIGHT,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 15,
  },
  /** * -- Accordion -- ***/
  accordionBtn: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLOR.LIGHT,
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 15,
    marginBottom: 10,
  },
  accordionTitle: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_12,
    color: COLOR.DARKBLUE,
  },
  accOrderInfo: {
    flex: 1,
    // flexDirection:'row',
    borderColor: COLOR.LIGHT,
    borderWidth: 1,
    borderTopWidth: 0,
    backgroundColor: COLOR.LIGHT,
    paddingVertical: 15,
    marginBottom: 10,
    borderRadius: 5,
  },
  accText: {
    fontFamily: FAMILY.REGULAR,
    fontSize: SIZE.SIZE_12,
    color: COLOR.PRIMARY,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: COLOR.LIGHTVIOLET,
  },
  selectDateMain: {
    flexDirection: 'row',
    justifyContent: "space-between"
  },
  selectDateText: {
    fontFamily: FAMILY.REGULAR,
    fontSize: SIZE.SIZE_14,
    color: COLOR.DARKVIOLET,
    paddingHorizontal: 20,
  },
  slotContaainer: {
    width: "100%",
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  slotBtn: {
    width: "45%",
    backgroundColor: "white",
    paddingHorizontal: 20,
    borderRadius: 5,
    paddingVertical: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  slotBtnB: {
    width: "45%",
    backgroundColor: "white",
    paddingHorizontal: 20,
    borderRadius: 5,
    paddingVertical: 15,
    justifyContent: "center",
    alignItems: "center",
    borderColor: COLOR.PRIMARY,
    borderWidth: 1,
  },
  timeText: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_12,
    color: COLOR.DARKBLUE,
  },
  timeTex2t: {
    fontFamily: FAMILY.REGULAR,
    fontSize: SIZE.SIZE_14,
    color: COLOR.PRIMARY,
  },
  timeText2: {
    fontFamily: FAMILY.REGULAR,
    fontSize: SIZE.SIZE_14,
    color: COLOR.PRIMARY,
    marginBottom: hp(1)
  },
  inputHeading: {
    fontFamily: FAMILY.REGULAR,
    fontSize: SIZE.SIZE_14,
    color: COLOR.PRIMARY,
    marginBottom: hp(1)
  },
  inputHeading2: {
    fontFamily: FAMILY.REGULAR,
    fontSize: SIZE.SIZE_14,
    color: COLOR.PRIMARY,
    marginBottom: hp(1)
  },
  /** * -- Vehicle Detail -- ***/
  switchInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 30,
  },
  switchText: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_12,
    color: COLOR.SMOKEVIOLET,
    paddingLeft: 10,
  },
  selectVehicleDetail: {
    backgroundColor: COLOR.LIGHT,
    borderRadius: 5,
    paddingVertical: 20,
  },
  vehicleInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: COLOR.LIGHTVIOLET,
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  costInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  vehicleTitle: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_12,
    color: COLOR.DARK,
    borderBottomWidth: 1,
    borderColor: COLOR.SMOKELIGHT,
    paddingBottom: 10,
    paddingLeft: 20,
  },
  vehicleText: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_12,
    color: COLOR.DARKBLUE,
  },
  vehicleItemText: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_12,
    color: COLOR.GREYVIOLET,
  },
  bookingBtn: {
    backgroundColor: COLOR.GREEN,
    borderRadius: 10,
    marginVertical: 10,
    marginHorizontal: 20,
  },
  bookingBtnText: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_16,
    color: COLOR.LIGHT,
    textAlign: "center",
    paddingVertical: 15,
  },
  uploadBtn: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLOR.LIGHT,
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 6,
    marginVertical: 10,
  },
  labelContainer: {
    alignItems: "center",
    // paddingVertical: 24,
    paddingHorizontal: 0,
  },
  biddingCardText: {
    fontFamily: FAMILY.BOLD,

    fontSize: SIZE.SIZE_12,
    color: "black",
  },
  bookingDeclineBtn: {
    backgroundColor: "#af4035",
    borderRadius: 5,
    marginVertical: 10,
    marginHorizontal: 20,
  },

  label: {
    fontFamily: FAMILY.REGULAR,
    fontSize: SIZE.SIZE_20,
    color: COLOR.PRIMARY,
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  uploadBtnText: {
    fontFamily: FAMILY.REGULAR,
    fontSize: SIZE.SIZE_12,
    // color: COLOR.DARKBLUE,
    color: COLOR.DARKVIOLET,

    paddingVertical: 15,
    paddingLeft: 20,
  },
  signUpImg: {
    width: 100,
    height: 100,
    borderRadius: 15,
    marginBottom: 10,
  },
};
