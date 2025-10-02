import { COLOR, FAMILY, SIZE } from "../../../theme/typography";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
const React = require("react-native");
const { Platform } = React;

export default {
  myTripHeader: {
    backgroundColor: COLOR.PRIMARY,
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  myTripHeaderTitle: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_20,
    color: COLOR.LIGHT,
    marginTop: 15,
    marginLeft: 15,
    paddingBottom: 5,
  },
  myTripHeaderText: {
    fontFamily: FAMILY.REGULAR,
    fontSize: SIZE.SIZE_12,
    color: COLOR.BLUE,
    marginLeft: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color:"#000"
  },
  input: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    marginBottom: 16,
    padding: 8,
    
  },
  outerView:{
width:wp("90"),
alignSelf:'center',
marginTop:hp('2')
  },
};