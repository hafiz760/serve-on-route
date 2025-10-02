import { COLOR, FAMILY, SIZE } from '../../../theme/typography'

const React = require('react-native')
const { Platform } = React

export default {
  sharedVehicleContainer: {
    paddingVertical: 20,
    paddingHorizontal: 15,
    backgroundColor: COLOR.SMOKEBLUE
  },
  sharedVehicleContent: {
    paddingVertical: 15
  },
  formRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLOR.LIGHT,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 15,
  },
  formInput: {
    flex: 1,
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_12,
    color: COLOR.DARKBLUE,
    paddingVertical: 15
  },
  formRow2: {
    width: '50%'
  },
  formText: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_12,
    color: COLOR.DARKBLUE
  },
  /** * -- Accordion -- ***/
  accordionTab: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLOR.LIGHT,
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 15,
    marginBottom: 10
  },
  accordionTitle: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_12,
    color: COLOR.DARKBLUE
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
    paddingHorizontal: 20
  },
  /** * -- Vehicle Detail -- ***/
  sharedVehicleContent2: {
    backgroundColor: COLOR.LIGHT,
    borderRadius: 5,
    paddingVertical: 20,
    marginBottom: 30
  },
  vehicleTitle: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_12,
    color: COLOR.GREYVIOLET,
    borderBottomWidth: 1,
    borderColor: COLOR.GREYLIGHT,
    paddingBottom: 10,
    paddingLeft: 20
  },
  vehicleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: COLOR.GREYLIGHT,
    paddingVertical: 15,
    paddingHorizontal: 20
  },
  vehicleText: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_12,
    color: COLOR.DARKBLUE
  },
  vehicleItemText: {
    fontFamily: FAMILY.REGULAR,
    fontSize: SIZE.SIZE_12,
    color: COLOR.GREYVIOLET
  },
  switchInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20
  },
  switchText: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_12,
    color: COLOR.SMOKEVIOLET,
    paddingLeft: 10
  },
  costText: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_12,
    color: COLOR.DARK
  },
  bookingBtn: {
    backgroundColor: COLOR.GREEN,
    borderRadius: 5,
    marginVertical: 10,
    marginHorizontal: 20
  },
  bookingBtnText: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_12,
    color: COLOR.LIGHT,
    textAlign: 'center',
    paddingVertical: 15
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: COLOR.BLUE,
    borderRadius: 20,
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 20
  },
  addBtnText: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_10,
    color: COLOR.LIGHT,
    paddingLeft: 10
  },
  totalInfo: {
    backgroundColor: COLOR.LIGHT,
    borderRadius: 5,
    paddingVertical: 30,
    marginBottom: 30
  },
  totalInfoText: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_12,
    color: COLOR.DARK,
    textAlign: 'center'
  },

  // --modal--//
  modalPackage: {
    width: '90%',
    height: '60%',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 20,
    justifyContent: 'center'
  },
  mPackageImg: {
    width: 64,
    height: 64,
    alignSelf: 'center'
  },
  mPackageHeader: {
    alignItems: 'center',
    marginVertical: 20
  },
  mPackageHeaderTitle: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_20,
    color: COLOR.PRIMARY,
    marginTop: 15,
    marginLeft: 15,
    paddingBottom: 10
  },
  mPackageHeaderText: {
    fontFamily: FAMILY.REGULAR,
    fontSize: SIZE.SIZE_14,
    color: COLOR.DARKBLUE,
    textAlign: 'center',
    paddingBottom: 10
  },
  mPackageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderColor: 'rgba(89,73,158,0.1)',
    borderBottomWidth: 1,
    paddingVertical: 15
  },
  mTotalInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 5,
    paddingTop: 20
  },
  mPackageTitle: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_12,
    color: COLOR.DARKVIOLET
  },
  mTotalText: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_12,
    color: COLOR.DARKVIOLET
  },
  mPackageText: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_12,
    color: COLOR.DARK
  },
    /** * -- Accordion -- ***/
    accordionBtn: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: COLOR.LIGHT,
      borderRadius: 5,
      paddingHorizontal: 20,
      paddingVertical: 20,
      marginBottom: 10
    },
    accordionTitle: {
      fontFamily: FAMILY.BOLD,
      fontSize: SIZE.SIZE_12,
      color: COLOR.DARKBLUE
    },
    accOrderInfo: {
      borderColor:COLOR.LIGHT,
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
      color:  COLOR.PRIMARY,
      borderBottomWidth: 1,
      borderColor: COLOR.LIGHTVIOLET,
      paddingVertical: 15,
      paddingHorizontal: 20,
    },
}
