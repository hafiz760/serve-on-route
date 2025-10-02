import { COLOR, SIZE, FAMILY } from '../../../theme/typography'

export default {
  splash: {
    flex: 1,
    position: 'relative',
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(89, 73, 158, 1)',
  },
  splashContent: {
    width: '100%',
    height: '100%',
    zIndex: 2,
    position: 'absolute',
  },
  splashTop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  splashImg: {
    // marginBottom: 10,
    width: '70%',
    height: '25%',
    // backgroundColor:'red'
  },
  splashTitle: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_42,
    color: COLOR.LIGHT,
    letterSpacing: 2,
  },
}