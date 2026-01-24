import { COLOR, FAMILY, SIZE } from '../../../theme/typography'

export default {
  /* Drawer Navigation */
  drawer: {
    flex: 1,
    backgroundColor: COLOR.PRIMARY,
  },

  /* Header */
  headerBg: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingTop: 60,
    paddingBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  header: {
    paddingHorizontal: 25,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerImg: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerTextContainer: {
    marginLeft: 15,
    flex: 1,
  },
  headerName: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_18,
    color: COLOR.LIGHT,
    marginBottom: 2,
  },
  headerSubtitle: {
    fontFamily: FAMILY.REGULAR,
    fontSize: SIZE.SIZE_12,
    color: 'rgba(255, 255, 255, 0.6)',
  },

  /* Content */
  content: {
    flex: 1,
  },
  navMenu: {
    paddingTop: 20,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingVertical: 18,
    marginHorizontal: 10,
    borderRadius: 12,
  },
  activeItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  col: {
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuIcon: {
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  itemText: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_14,
    color: COLOR.LIGHT,
    letterSpacing: 0.3,
  },

  /* Footer / Logout */
  footer: {
    paddingBottom: 40,
    paddingHorizontal: 25,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: 20,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  logoutIcon: {
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.6)',
    marginRight: 15,
  },
  logoutText: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_14,
    color: 'rgba(255, 255, 255, 0.6)',
  },
}