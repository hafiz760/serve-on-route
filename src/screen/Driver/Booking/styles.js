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
    fontSize: SIZE.SIZE_12,
    color: COLOR.BLUE,
    marginLeft: 15
  },
  bookingContainer: {
    marginHorizontal: 20,
    marginVertical: 15
  },
  bookingForm: {
    backgroundColor: COLOR.LIGHT,
    borderRadius: 5,
    marginVertical: 10
  },
  bookingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  bookingTitle: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_12,
    color: COLOR.DARK
  },
  bookingCloseText: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_12,
    color: COLOR.LIGHT,
    backgroundColor: COLOR.GREEN,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 3
  },
  bookingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: COLOR.LIGHTVIOLET,
    paddingHorizontal: 20,
    paddingVertical: 15
  },
  bookingText: {
    fontFamily: FAMILY.REGULAR,
    fontSize: 11,
    color: COLOR.DARKBLUE
  },
  bookingDetailInfo: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  bookingTimeText: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_12,
    color: COLOR.GREYVIOLET,
    borderColor: COLOR.GREY,
    borderRightWidth: 1,
    paddingRight: 5
  },
  bookingDetailText: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_12,
    color: COLOR.GREYVIOLET,
    borderColor: COLOR.GREY,
    paddingLeft: 5
  },
  documentInfo: {
    marginVertical: 10,
    backgroundColor: COLOR.LIGHT,
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  documentTitle: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_12,
    color: COLOR.DARK,
    marginTop: 10
  },
  documentText: {
    fontFamily: FAMILY.REGULAR,
    fontSize: SIZE.SIZE_10,
    color: COLOR.DARKBLUE,
    marginTop: 10,
    marginBottom: 30
  },
  documentDetails: {
    borderColor: COLOR.LIGHTVIOLET,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    marginBottom: 20
  },
  codeText: {
    fontFamily: FAMILY.REGULAR,
    fontSize: SIZE.SIZE_10,
    color: COLOR.DARKBLUE,
    marginTop: 10
  },
  uploadBtn: {
    alignItems: 'flex-end',
    marginBottom: 10
  },
  uploadBtnText: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_12,
    color: COLOR.LIGHT,
    backgroundColor: COLOR.BLUE,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5
  },
  tripBtn: {
    backgroundColor: COLOR.GREEN,
    paddingVertical: 5,
    alignItems: 'center',
    borderRadius: 5
  },
  tripBtnText: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_12,
    color: COLOR.LIGHT,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  formRow: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 30,
    justifyContent: 'space-between'
  },
  formInput: {
    flex: 1,
    fontFamily: FAMILY.REGULAR,
    fontSize:  SIZE.SIZE_20,
    color: COLOR.GREYVIOLET,
    textAlign: 'center',
    borderBottomWidth: 1,
    borderColor: COLOR.LIGHTVIOLET,
    marginHorizontal: 5,
  },
  // modal//
  modalCheckout: {
    width: '90%',
    height: '35%',
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    justifyContent: 'center'
  },
  modalImg: {
    width: 64,
    height: 64,
    alignSelf: 'center'
  },
  modalTextInfo: {
    alignItems: 'center',
    marginVertical: 20
  },
  modalTitle: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_20,
    color: COLOR.PRIMARY,
    marginTop: 15,
    marginLeft: 15,
    paddingBottom: 5
  },
  modalText: {
    fontFamily: FAMILY.REGULAR,
    fontSize: SIZE.SIZE_12,
    color: COLOR.DARKVIOLET,
    textAlign: 'center',
    paddingBottom: 10
  }
}
