import { COLOR, FAMILY, SIZE } from '../../../theme/typography'
const React = require('react-native')
const { Platform } = React

export default {
  notificationHeader: {
    backgroundColor: COLOR.PRIMARY,
    paddingHorizontal: 15,
    paddingBottom: 40
  },
  notificationHeaderTitle: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_20,
    color: COLOR.LIGHT,
    marginTop: 15,
    marginLeft: 15,
    paddingBottom: 5
  },
  notificationHeaderText: {
    fontFamily: FAMILY.REGULAR,
    fontSize: SIZE.SIZE_12,
    color: COLOR.BLUE,
    marginLeft: 15
  },
  notificationContainer: {
    paddingVertical: 20
  },
  notificationContent: {
    flex: 1,
    backgroundColor: COLOR.LIGHT,
    borderRadius: 5,
    marginHorizontal: 20,
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginTop: 15,
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
    justifyContent: 'space-between',
  },
  bookingText: {
    flex: 1,
    fontFamily: FAMILY.REGULAR,
    fontSize: SIZE.SIZE_11,
    color: COLOR.SMOKEVIOLET,
    lineHeight: 16
  },
  deleteBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor:COLOR.SMOKEVIOLET,
    borderRadius:5,
    
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
    alignItems: 'center',
    backgroundColor: 'rgba(249,64,65,1)',
    borderRadius: 5,
    marginRight: 10,
    paddingVertical: 15,
  },
  yesBtnText: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_11,
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
  },
  bookingBtn: {
    backgroundColor: COLOR.GREEN,
    borderRadius: 5,
    marginVertical: 10,
    marginHorizontal: 20,
    alignItems:'center',
    justifyContent:'center'
  },
  bookingBtnText: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_12,
    color: COLOR.LIGHT,
    textAlign: "center",
    paddingVertical: 5,
  },
  biddingCardText: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_12,
    color: "black",
    marginBottom:1
  },
}
