import { COLOR, FAMILY, SIZE } from '../../../theme/typography'

export default {
  /* Drawer Navigation */
  drawer: {
    flex: 1
  },

  /* Header */
  headerBg: {
    width: '100%',
    backgroundColor: COLOR.PRIMARY,
    alignItems:'center',
    justifyContent: 'center',
  },
  header: {
    paddingVertical: 30,
    paddingHorizontal: 30,
    alignItems:'center'
  },
  headerImg: {
    width: 72,
    height: 72,
    borderRadius: 36,
    marginBottom: 15
  },
  headerName: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_14,
    color: COLOR.LIGHT,
    marginBottom: 5
  },
  headerDesc: {
    fontFamily: FAMILY.REGULAR,
    fontSize: SIZE.SIZE_18,
    color: COLOR.dark
  },

  /* Content */
  content: {
    flex: 1,
    backgroundColor: COLOR.PRIMARY,
    paddingBottom: 30
  },
  contentInfo: {
    paddingVertical: 15
  },

  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 15
  },
  col: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  itemIcon: {
    // fontFamily:FAMILY.BOLD,
    fontSize: SIZE.SIZE_20,
    color: COLOR.LIGHT,
    marginRight: 20
  },
  itemText: {
    flex: 1,
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_14,
    color: COLOR.LIGHT,
    marginLeft:10
  },
  navHeader: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_14,
    color: COLOR.LIGHT,
    marginTop: 20,
    marginBottom: 10,
    marginLeft: 20,
    paddingTop: 20
  },
  user: {
    alignItems: 'center',
    backgroundColor: COLOR.GREYLIGHT,
    paddingVertical: 15
  },
  userText: {
    flex: 1,
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_16,
    color: COLOR.GREY,
    textAlign: 'center'
  }
}