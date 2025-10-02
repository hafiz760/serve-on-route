
import { COLOR, FAMILY, SIZE } from '../../../theme/typography'

const React = require('react-native')
const { Platform } = React

export default {
  bookingHeader: {
    backgroundColor: COLOR.PRIMARY,
    paddingHorizontal: 15,
    paddingBottom: 40
  },
  bookingHeaderTitle: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_20,
    color: COLOR.LIGHT,
    marginTop: 15,
    marginLeft: 15,
    paddingBottom: 5
  },
  bookingHeaderText: {
    fontFamily: FAMILY.REGULAR,
    fontSize: SIZE.SIZE_14,
    color: COLOR.BLUE,
    marginLeft: 15
  },
  bookingContainer: {
    marginHorizontal: 20,
    marginVertical: 30
  },
  bookingContent: {
    backgroundColor: COLOR.LIGHT
  },
  bookingDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20
  },
  bookingIdText: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_12,
    color: COLOR.DARK
  },
  completeBtn: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_12,
    color: COLOR.LIGHT,
    backgroundColor: COLOR.GREEN,
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  calendarIcon: {
    marginLeft: 5
  },
  bookingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderColor: COLOR.GREYLIGHT,
    borderBottomWidth: 1,
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  bookingTitle: {
    fontFamily: FAMILY.REGULAR,
    fontSize: SIZE.SIZE_12,
    color: COLOR.DARKBLUE
  },
  bookingDetailInfo: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  bookingText: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_12,
    color: COLOR.GREYVIOLET,
    borderColor: COLOR.GREY,
    paddingLeft: 5
  },
  uploadBtn: {
    alignItems: 'flex-start',
    borderColor: COLOR.SMOKE,
    borderBottomWidth: 1,
    marginHorizontal: 20,
    paddingVertical: 15,
  },
  uploadBtnText: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_12,
    color: COLOR.LIGHT,
    backgroundColor: COLOR.BLUE,
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
  payBtnInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginVertical: 20
  },
  payBtn: {
    flex: 5,
    backgroundColor: COLOR.GREEN,
    borderRadius: 5,
    alignItems: 'center',
    paddingVertical: 5,
  },
  cancelBtn: {
    backgroundColor: 'rgba(42,33,77,0.1)',
    borderRadius: 5,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 5,
    marginLeft: 5
  },
  payText: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_12,
    color: COLOR.LIGHT,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  cancelText: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_12,
    color: 'rgba(42,33,77,0.3)',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  bookingBtn: {
    backgroundColor: COLOR.GREEN,
    borderRadius: 5,
    marginHorizontal: 20,
    marginVertical: 10,
    paddingVertical: 15,
  },
  bookingBtnText: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_12,
    color: COLOR.LIGHT,
    textAlign: 'center'
  },
  // modal//
  modalCheckout: {
    width: '90%',
    height: '80%',
    borderRadius: 10,
    paddingVertical: 20,
    justifyContent: 'center'
  },
  modalImg: {
    width: 86,
    height: 86,
    alignSelf: 'center'
  },
  modalTextInfo: {
    alignItems: 'center',
    marginVertical: 20
  },
  modalTitle: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_20,
    color: COLOR.DARK,
    marginLeft: 15,
    paddingBottom: 5
  },
  modalTitleText: {
    fontFamily: FAMILY.REGULAR,
    fontSize: SIZE.SIZE_12,
    color: COLOR.GREYVIOLET,
    textAlign: 'center',
    paddingBottom: 10
  },
  modalInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderColor: COLOR.SMOKEBLUE,
    borderBottomWidth: 1,
    paddingHorizontal: 30,
    paddingBottom: 5,
  },
  modalInfoNoBorder: {
    borderBottomWidth: 0
  },
  modalText: {
    fontFamily: FAMILY.REGULAR,
    fontSize: SIZE.SIZE_12,
    color: COLOR.DARKBLUE
  },
  modalDetailInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15
  },
  modalDetailText: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_12,
    color: COLOR.SMOKEVIOLET,
    paddingLeft: 5
  },
  modalDetailTextDark: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_12,
    color: COLOR.DARK,
    paddingLeft: 5
  },

  // modal//
  modalPackage: {
    width: '90%',
    height: '60%',
    borderRadius: 10,
    paddingVertical: 20,
    justifyContent: 'center'
  }
}