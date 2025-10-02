import { COLOR, FAMILY, SIZE } from '../../../theme/typography'

const React = require('react-native')
const { Platform } = React

export default {
  introBgImg: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: 1,
    borderWidth: 1
  },
  introBgCover: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: 2,
    backgroundColor: COLOR.DARKVIOLET
  },
  introContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: 3,
  },

  /** -- Content --**/

  introContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  introImg: {
    width: 190,
    height: 100,
    alignSelf: 'center',
    marginBottom: 15,
  },
  introTitle: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_36,
    color: COLOR.LIGHT,
    textAlign: 'center'
  },
  introText: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_12,
    color: COLOR.DEFAULT,
    textAlign: 'center',
    lineHeight: 21
  },
  startBtn: {
    alignSelf: 'flex-end',
    backgroundColor: COLOR.GREEN,
    borderRadius: 5,
    paddingHorizontal: 40,
    paddingVertical: 15,
    margin: 20,
  },
  startBtnText: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_12,
    color: COLOR.LIGHT
  }
}
