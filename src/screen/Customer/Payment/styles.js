import { COLOR, FAMILY, SIZE } from '../../../theme/typography'

const React = require('react-native')
const { Platform } = React

export default {
  paymentHeader: {
    backgroundColor:  'rgba(89, 73, 158, 1)',
    paddingHorizontal: 15,
    paddingBottom: 40
  },
  paymentHeaderTitle: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_20,
    color: COLOR.LIGHT,
    marginTop: 15,
    marginLeft: 15,
    paddingBottom: 5
  },
  paymentHeaderText: {
    fontFamily: FAMILY.REGULAR,
    fontSize: SIZE.SIZE_12,
    color: COLOR.BLUE,
    marginLeft: 15
  },
  paymentContainer: {
    backgroundColor: COLOR.LIGHT,
    borderRadius: 5,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  /* --PaymentTab-- */
  tabInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
    paddingVertical: 2,
    marginVertical: 15,
    marginHorizontal: 20,
  },
  tabActive: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: COLOR.LIGHT,
    borderRadius: 3,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginHorizontal: 3
  },
  tabInactive: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 3,
    borderRadius: 3,
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: 'rgba(49,51,86,0.05)'
  },
  tabImgActive: {
    width: 40,
    height: 40,
  },
  tabImgInactive: {
    width: 40,
    height: 40,
    color: COLOR.GREY
  },
  /** -- Card -- **/
  payPalInfo: {
    marginHorizontal: 20,
    marginVertical: 15,
  },
  cardImg: {
    width: 70,
    height: 50,
  },
  paymentForm: {
    paddingHorizontal: 30,
    paddingVertical: 30,
  },
  formRow: {
    marginVertical: 10,
  },
  formRow2: {
    flex: 5,
    marginRight: 10,
  },
  inputInfo: {
    marginVertical: 10,
  },
  formText: {
    fontFamily: FAMILY.REGULAR,
    fontSize: SIZE.SIZE_10,
    color: COLOR.SMOKEVIOLET,
    paddingBottom: 5,
  },
  formInput: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_14,
    color: COLOR.DARK,
    borderColor: "rgba(42,33,77,0.1)",
    borderBottomWidth: 1,
    paddingVertical: 10,
  },
  cardInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  payBtn: {
    alignItems: 'center',
    backgroundColor: COLOR.GREEN,
    borderRadius: 5,
    paddingVertical: 15,
    marginHorizontal: 20,
    marginBottom: 10
  },
  payBtnText: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_12,
    color: COLOR.LIGHT
  },
  button : {
    backgroundColor:'#2471A3',
    width:150,
    height:45,
    alignSelf:'center',
    justifyContent:'center',
    alignItems:'center',
    marginTop:20,
    borderRadius:5
  },
  buttonText : {
    fontSize: 15,
    color: '#f4f4f4',
    fontWeight:'bold',
    textTransform:'uppercase'
  },
  inputContainerStyle : {
    backgroundColor:'#fff',
    borderRadius:5
  },
  inputStyle : {
    backgroundColor:'#222242',
    paddingLeft:15,
    borderRadius:5,
    color:'#fff'
  },
  labelStyle : {
    marginBottom:5,
    fontSize:12
  }
}
