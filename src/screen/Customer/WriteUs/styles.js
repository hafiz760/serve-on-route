import { COLOR, FAMILY, SIZE } from '../../../theme/typography'

const React = require('react-native')
const { Platform } = React

export default {
  writeUsHeader: {
    backgroundColor: COLOR.PRIMARY,
    paddingHorizontal: 20,
    paddingBottom: 40
  },
  writeUsHeaderTitle: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_20,
    color: COLOR.LIGHT,
    marginTop: 15,
    marginLeft: 15,
    paddingBottom: 5
  },
  writeUsHeaderText: {
    fontFamily: FAMILY.REGULAR,
    fontSize: SIZE.SIZE_12,
    color: COLOR.BLUE,
    marginLeft: 15
  },
  writeUsContainer: {
    backgroundColor: COLOR.LIGHT,
    borderRadius: 5,
    marginVertical: 30,
    marginHorizontal: 20
  },
  writeUsInfo: {
    borderColor: COLOR.LIGHTVIOLET,
    borderBottomWidth: 1,
    paddingTop: 20,
    marginBottom: 30,
    marginHorizontal: 20,
  },
  writeUsTitle: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_12,
    color: COLOR.DARKBLUE,
    marginBottom: 5
  },
  formRow: {
    borderBottomWidth: 1,
    borderColor: COLOR.LIGHTVIOLET,
    marginHorizontal: 20,
  },
  formText: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_12,
    color: COLOR.DARKBLUE
  },
  formInput: {
    fontFamily: FAMILY.REGULAR,
    fontSize: SIZE.SIZE_12,
    color: COLOR.GREYVIOLET
  },
  picker:{
  },
  sendBtn: {
    backgroundColor: COLOR.GREEN,
    alignItems: 'center',
    borderRadius: 5,
    paddingVertical: 5,
    margin: 20,
  },
  sendBtnText: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_12,
    color: COLOR.LIGHT,
    paddingHorizontal: 10,
    paddingVertical: 10,
  }
}
