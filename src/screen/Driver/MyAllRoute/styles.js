import { COLOR, FAMILY, SIZE } from "../../../theme/typography";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
const React = require("react-native");
const { Platform } = React;

export default {
  accordionItem: {
    marginRight: wp("0"),
    marginBottom: hp('1'),
    // alignSelf: 'baseline',
    // alignSelf: 'flex-end',
    marginTop: 15


  },
  myTripHeader: {
    // backgroundColor: COLOR.PRIMARY,
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  myTripHeaderTitle: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_20,
    color: COLOR.LIGHT,
    marginTop: 15,
    marginLeft: 15,
    paddingBottom: 5,
  },
  myTripHeaderText: {
    fontFamily: FAMILY.REGULAR,
    fontSize: SIZE.SIZE_12,
    color: COLOR.BLUE,
    marginLeft: 15,
  },
  /** Tab */
  myTripTabItems: {
    flexDirection: "row",

    paddingHorizontal: 15,
    // justifyContent: "center",
    // alignItems: "center",
    marginVertical: 10,
    // backgroundColor: 'rgba(89,73,158,0.1)',

    justifyContent: "center",
    alignItems: "center",
    width: wp(100),
    height: hp(12),
    alignSelf: 'center',
    paddingHorizontal: wp(4),
    backgroundColor: "rgba(42,33,77,0.1)",
    // height:'20%'

  },
  tabActive: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLOR.GREEN,
    borderRadius: 10,
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 15,
    margin: 5,
  },
  tabActive1: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLOR.GREEN,
    borderRadius: 10,
    paddingVertical: 15,
    // margin: 5,
    marginTop: 20,
  },
  tabInactive: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLOR.GREY,
    borderRadius: 10,
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 15,
    margin: 5,
  },
  tabActiveText: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_16,
    color: COLOR.LIGHT,
  },
  tabInactiveText: {
    fontFamily: FAMILY.REGULAR,
    fontSize: SIZE.SIZE_12,
    color: "rgba(255,255,255,0.5)",
  },

  /* -- Accordion -- */
  tripsAllLable: {
    backgroundColor: COLOR.LIGHT,
    borderRadius: 5,
  },
  accordionTab: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLOR.LIGHT,
    borderRadius: 5,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  accordionTabText: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_12,
    color: "#333",
  },

  /** Content */
  myTripContainer: {
    paddingHorizontal: 20,
    paddingVertical: 30,

  },
  openBtnText: {
    fontFamily: FAMILY.BOLD,
    fontSize: 12,
    color: COLOR.LIGHT,
    alignSelf: "center",
    backgroundColor: COLOR.BLUE,
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 3,
  },
  completedBtnText: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_12,
    color: COLOR.LIGHT,
    alignSelf: "center",
    backgroundColor: COLOR.GREEN,
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 3,
  },
  bookingInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: COLOR.SMOKELIGHT,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  bookingTitle: {
    fontFamily: FAMILY.REGULAR,
    fontSize: SIZE.SIZE_12,
    color: COLOR.DARKBLUE,
  },
  bookingDetailInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  bookingDetail: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_12,
    color: COLOR.DARK,
    borderColor: COLOR.GREY,
    borderRightWidth: 1,
    paddingRight: 5,
  },
  bookingText: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_12,
    color: COLOR.GREYVIOLET,
    borderColor: COLOR.GREY,
    paddingLeft: 5,
  },
  btnInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    margin: 15,
  },
  detailBtn: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: COLOR.SMOKELIGHT,
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 15,
    marginRight: 15,
  },
  detailBtnText: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_12,
    color: COLOR.GREYDARK,
    marginLeft: 5,
  },
  detailTag: {
    flex: 3,
  },
  balanceBtn: {
    flex: 4,
  },
  balanceBtnText: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_12,
    color: COLOR.LIGHT,
    textAlign: "center",
    backgroundColor: "rgba(249,64,65,1)",
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  rateBtn: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_12,
    color: COLOR.LIGHT,
    textAlign: "center",
    backgroundColor: COLOR.PRIMARY,
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  /** * -- ModalLayout -- ***/
  modalRating: {
    width: "90%",
    height: 400,
    borderRadius: 10,
  },
  modalRatingContainer: {
    marginHorizontal: 15,
  },
  closeSortDesc: {
    alignItems: "flex-end",
    marginVertical: 10,
  },
  starImg: {
    width: 80,
    height: 80,
    alignSelf: "center",
  },
  modalRatingTitle: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_20,
    color: COLOR.DARKLIGHT,
    alignSelf: "center",
    paddingTop: 10,
    paddingBottom: 5,
  },
  modalRatingText: {
    fontFamily: FAMILY.REGULAR,
    fontSize: SIZE.SIZE_12,
    color: COLOR.GREYVIOLET,
    alignSelf: "center",
    textAlign: "center",
    lineHeight: 20,
  },
  modalRatingInfo: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    marginVertical: 20,
  },
  modalStarIcon: {
    fontSize: SIZE.SIZE_30,
    color: "rgba(255, 178, 41, 1)",
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
  submitBtn: {
    backgroundColor: COLOR.GREEN,
    paddingVertical: 15,
    borderRadius: 5,
    marginVertical: 15,
  },
  submitBtnText: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_12,
    color: COLOR.LIGHT,
    textAlign: "center",
  },
  /** * -- Accordion -- ***/
  accordionContent: {
    backgroundColor: COLOR.LIGHT,
    borderRadius: 10,
    paddingVertical: 15,
    marginTop: 5,
  },

  accordion: {
    width: "100%",
    marginBottom: 10,
    marginBottom: 5,
    // backgroundColor:'red',
    // marginTop:hp(-5)
  },
  accordionBtn: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLOR.LIGHT,
    borderRadius: 10,
    // paddingHorizontal: 10,
    paddingVertical: 15,
    // backgroundColor:'red'
  },
  accordionTitle: {
    flex: 1,
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_14,
    color: COLOR.PRIMARY,

  },
  accordionTitle1: {
    // flex: 1,
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_12,
    color: COLOR.DARKBLUE,

  },
  accordionTitleTo: {
    flex: 1,
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_14,
    color: COLOR.PRIMARY,
    paddingLeft: 15,
    // backgroundColor: 'red'

  },
  accordionTitle2: {
    flex: 1,
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_12,
    color: COLOR.DARKBLUE,

  },
  accOrderInfo: {
    borderColor: COLOR.LIGHT,
    borderWidth: 1,
    borderTopWidth: 0,
    backgroundColor: COLOR.LIGHT,
    borderRadius: 5,
    paddingVertical: 15,
    marginBottom: 20,
  },
  accText: {
    fontFamily: FAMILY.REGULAR,
    fontSize: SIZE.SIZE_12,
    color: COLOR.PRIMARY,
    borderBottomWidth: 1,
    borderColor: COLOR.LIGHTVIOLET,
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  accordionInfo: {
    flex: 1,
    // flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: 'space-between',
    // backgroundColor:'red'
  },
  accordionActiveText: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_12,
    color: COLOR.LIGHT,
    backgroundColor: "rgba(53,190,224,1)",
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  accordionInactiveText: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_12,
    color: COLOR.LIGHT,
    backgroundColor: COLOR.GREEN,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,

  },
  sender: {
    alignItems: "flex-end",
    backgroundColor: COLOR.GREY,

    marginTop: 5,
    paddingBottom: 5,
    paddingTop: 5,
    paddingRight: 7,
    marginLeft: 70,
    fontSize: SIZE.SIZE_12,
    borderRadius: 6,
  },
  reciver: {
    backgroundColor: COLOR.GREYVIOLET,
    marginTop: 5,
    paddingBottom: 5,
    borderRadius: 6,
    paddingTop: 5,
    paddingLeft: 7,
    marginRight: 70,
    fontSize: SIZE.SIZE_12,
  },
  formInput3: {
    width: "90%",
    fontFamily: FAMILY.REGULAR,
    fontSize: SIZE.SIZE_12,
    color: COLOR.DARK,
    backgroundColor: COLOR.LIGHTVIOLET,
    borderRadius: 3,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  noTripsFoundContainer: {
    justifyContent: "center",
    alignItems: "center",
  },

  noTripsFoundText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "bold",
  },
  heig:
  {
    // height:'10%'/

  },
  modalContainer: {
    position: "absolute",
    top: 30,
    right: 20,
    backgroundColor: "white",
    elevation: 5,
    borderRadius: 5,
    padding: 10,
  },
  modalItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    color: COLOR.BLUE,
  },
};
