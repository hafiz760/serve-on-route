import { COLOR, FAMILY, SIZE } from '../../../theme/typography'

const React = require('react-native')
const { Platform } = React

export default {

  notificationHeaderView: {
    flex: 1,
    alignItems: 'center',
    marginTop: 5

  },
  notificationHeaderText: {
    fontFamily: FAMILY.REGULAR,
    fontSize: SIZE.SIZE_16,
    color: COLOR.PRIMARY,
    // marginLeft: 15,
    // justifyContent:'center',
  },
  notificationContainer: {
    paddingVertical: 20,
  },
  notificationContent: {
    flex: 1,
    backgroundColor: COLOR.LIGHT,
    borderRadius: 10,
    marginHorizontal: 20,
    // paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 25,
  },
  notificationInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  notificationTitle: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_12,
    color: COLOR.DARK
  },
  notificationText: {
    fontFamily: FAMILY.REGULAR,
    fontSize: SIZE.SIZE_10,
    color: COLOR.SMOKEVIOLET
  },
  notificationDetail: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-between',
  },

  cardImg1: {
    // flex:2,
    alignItems: 'center',
    justifyContent: "center",
    backgroundColor: '#D9D9D9',
    borderRadius: 50,
    height: 50,
    width: 50,
    marginEnd: 10,
    marginHorizontal: 15,
  },
  bookingText: {
    flex: 5,
    fontFamily: FAMILY.REGULAR,
    fontSize: SIZE.SIZE_18,
    color: COLOR.SMOKEVIOLET,
    alignSelf: 'center',
    // alignItems:'center',
    // backgroundColor:'black',
    lineHeight: 28,

  },
  deleteBtn: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
    // backgroundColor:'red'
  },
  /* --Modal-- */
  mNewBox: {
    width: '94%',
    height: 200,
    borderWidth: 1,
    borderColor: COLOR.smoke,
    borderRadius: 5
  },
  closeIcon: {
    alignSelf: 'flex-end',
    paddingRight: 20,
    paddingVertical: 15
  },
  mNotificationText: {
    fontFamily: FAMILY.REGULAR,
    fontSize: SIZE.SIZE_14,
    color: COLOR.DARK,
    textAlign: 'center',
    lineHeight: 20,
  },
  mBtns: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 50
  },
  yesBtn: {
    flex: 1,
    backgroundColor: COLOR.GREEN,
    borderRadius: 10,
    marginHorizontal: 20,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    // alignContent: 'flex-end'
  },
  yesBtnText: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_16,
    color: COLOR.LIGHT
  },
  noBtn: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: COLOR.SMOKEBLUE,
    borderRadius: 5,
    paddingVertical: 15,
  },
  noBtnText: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_11,
    color: COLOR.SMOKEVIOLET
  }
}
