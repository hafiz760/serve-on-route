import { COLOR, FAMILY, SIZE } from '../../../theme/typography'

const React = require('react-native')
const { Platform } = React

export default {
  langContainer: {
    paddingHorizontal: 15,
    paddingVertical: 15
  },
  langLabel: {
    fontFamily: FAMILY.regular,
    fontSize: SIZE.SIZE_14,
    color: COLOR.GREYDARK,
    marginBottom: 10
  },
  langPicker: {
    backgroundColor: COLOR.SMOKEDARK,
    borderRadius: 5,
    paddingHorizontal: 10
  },
  langPickerText: {
    fontFamily: FAMILY.regular,
    fontSize: SIZE.SIZE_12,
    color: COLOR.GREYDARK
  }
}
