
import { COLOR, FAMILY, SIZE } from '../../../theme/typography'

const React = require('react-native')
const { Platform } = React

export default {
  settlementHeader: {
    backgroundColor: COLOR.PRIMARY,
    paddingHorizontal: 15,
    paddingBottom: 40
  },
  settlementHeaderTitle: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_20,
    color: COLOR.LIGHT,
    marginTop: 15,
    marginLeft: 15,
    paddingBottom: 5
  },
  settlementHeaderText: {
    fontFamily: FAMILY.REGULAR,
    fontSize: SIZE.SIZE_12,
    color: COLOR.BLUE,
    marginLeft: 15
  },
  profileInputDetail: {
    marginBottom: 20,
    paddingTop:10
  },
  profileform:{
    flex : 1,
    flexDirection: 'column',
   
    
  },
  
  permissionText: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_12,
    color: COLOR.DARKBLUE,
    marginBottom: 5,
  },
  switchInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: COLOR.SMOKELIGHT,
    paddingBottom: 20,
    marginBottom: 10,
  },
  switchText: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_12,
    color: COLOR.SMOKEVIOLET,
  },
  saveBtn: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLOR.GREEN,
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 15,
    margin: 20,
  },
  saveBtnText: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_12,
    color: COLOR.LIGHT,
  },


  /** Content */
  settlementContainer: {
    paddingHorizontal: 20,
    paddingVertical: 30
  },
  bookingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15
  },
  bookingItem2: {
    borderBottomWidth: 1,
    borderColor: COLOR.LIGHTVIOLET
  },
  bookingText: {
    fontFamily: FAMILY.REGULAR,
    fontSize: SIZE.SIZE_12,
    color: COLOR.DARKBLUE
  },
  bookingCost: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_12,
    color: COLOR.GREYVIOLET,
    paddingLeft: 5
  },
  /** * -- Accordion -- ***/
  accordionContent: {
    paddingVertical: 15,
    borderRadius: 5,
    backgroundColor: COLOR.LIGHT
  },
  accordion: {
    width: '100%',
    marginBottom: 5
  },
  accordionBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLOR.LIGHT,
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 15,
    marginBottom: 5
  },
  accordionTitle: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_12,
    color: COLOR.DARKBLUE
  },
  accOrderInfo: {
    borderColor: COLOR.LIGHT,
    borderWidth: 1,
    borderTopWidth: 0,
    backgroundColor: COLOR.LIGHT,
    borderRadius: 5,
    paddingVertical: 15,
    marginBottom: 20,
  },
  accText: {
    fontFamily: FAMILY.REGULAR,
    fontSize: SIZE.SIZE_12,
    color: COLOR.PRIMARY,
    borderBottomWidth: 1,
    borderColor: COLOR.LIGHTVIOLET,
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  accordionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accordionActiveText: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_12,
    color: COLOR.LIGHT,
    backgroundColor: 'rgba(53,190,224,1)',
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  accordionInactiveText: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_12,
    color: COLOR.LIGHT,
    backgroundColor: 'rgba(92,186,71,1)',
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
}
