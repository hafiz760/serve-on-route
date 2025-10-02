import { COLOR, FAMILY, SIZE } from "../../../theme/typography";

const React = require("react-native");
const { Platform } = React;

export default {
  // --content--//

  homeContainer: {
    backgroundColor: COLOR.PRIMARY,
    flex: 1,

  },
  formRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLOR.LIGHT,
    borderRadius: 10,
    marginBottom: 15,
    marginHorizontal: 20,
    paddingLeft: 15,
    marginTop: 5,
    paddingVertical: 5,

  },
  formRow2: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLOR.LIGHT,
    borderRadius: 10,
    marginBottom: 15,
    marginHorizontal: 20,
    paddingLeft: 15,
    paddingVertical: 5,

  },
  formInput: {
    flex: 1,
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_12,
    color: COLOR.PRIMARY,
    marginLeft: 5,
  },
  footerBtn: {
    backgroundColor: COLOR.PRIMARY,

  },
  footerBtnInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },
  selectBtn: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLOR.GREEN,
    borderRadius: 10,
    marginBottom: 10,
    paddingVertical: 15,
    marginHorizontal: 20,


  },
  shareBtn: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLOR.BLUE,
    borderRadius: 10,
    paddingVertical: 15,
    marginLeft: 5,
  },
  shareBtnText: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_18,
    color: COLOR.LIGHT,
  },
  // --map--//
  mMap: {
    // width: "90%",
    flex: 1,
    borderColor: COLOR.LIGHT,
    borderWidth: 5,
    marginHorizontal: 20,
    borderRadius: 10,



  },
  mMapImg: {
    flex: 1,
  },

  // * NEW STYLES FOR UBER LIKE FUNCTIONALITY
  marker: {
    width: 40,
    height: 40,
  },
  closeIconStyles: {
    marginTop: 10,
    marginRight: 3,
    color: COLOR.DARKLIGHT,
    fontSize: 24,
  },
};
