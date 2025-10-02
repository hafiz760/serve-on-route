
import { COLOR, FAMILY, SIZE } from '../../../theme/typography'

const React = require('react-native')
const { Platform } = React

export default {
  contactHeader: {
    backgroundColor: COLOR.PRIMARY,
    paddingHorizontal: 15,
    paddingBottom: 40
  },
  contactHeaderTitle: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_20,
    color: COLOR.LIGHT,
    marginTop: 15,
    marginLeft: 15,
    paddingBottom: 5
  },
  contactHeaderText: {
    fontFamily: FAMILY.REGULAR,
    fontSize: SIZE.SIZE_12,
    color: COLOR.BLUE,
    marginLeft: 15
  },
  contactContainer: {
    backgroundColor: COLOR.LIGHT,
    paddingVertical: 30,
    marginVertical: 30,
    marginHorizontal: 20
  },
  formRow: {
    borderBottomWidth: 1,
    borderColor: COLOR.LIGHTVIOLET,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  formText: {
    fontFamily: FAMILY.REGULAR,
    fontSize: SIZE.SIZE_12,
    color: COLOR.SMOKEVIOLET
  },
  formInput: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_12,
    color: COLOR.GREYVIOLET,
    paddingVertical: 10,
    paddingHorizontal: 0
  },
  sendBtn: {
    alignItems: 'center',
    backgroundColor: COLOR.GREEN,
    marginHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 5
  },
  sendText: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_12,
    color: COLOR.LIGHT
  }
}
