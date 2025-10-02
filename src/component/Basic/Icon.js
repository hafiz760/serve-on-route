import React from "react";

import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Foundation from 'react-native-vector-icons/Foundation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Zocial from 'react-native-vector-icons/Zocial';

import { COLOR, SIZE } from '../../theme/typography'

const Icon = ({ type, size = 'SIZE_24', color = 'dark', style, ...props }) => {
    const sizeStyle = styles.size[size]
    const colorStyle = styles.color[color]
    const iconStyle = [sizeStyle, colorStyle]
    if (style) {
        iconStyle.push(style)
    }

    let C = null

    switch (type) {
        case 'AntDesign':
            C = AntDesign;
            break;
        case 'Entypo':
            C = Entypo;
            break;
        case 'EvilIcons':
            C = EvilIcons;
            break;
        case 'Feather':
            C = Feather;
            break;
        case 'FontAwesome':
            C = FontAwesome;
            break;
        case 'FontAwesome5':
            C = FontAwesome5;
            break;
        case 'Fontisto':
            C = Fontisto;
            break;
        case 'Foundation':
            C = Foundation;
            break;
        case 'Ionicons':
            C = Ionicons;
            break;
        case 'MaterialCommunityIcons':
            C = MaterialCommunityIcons;
            break;
        case 'MaterialIcons':
            C = MaterialIcons;
            break;
        case 'Octicons':
            C = Octicons;
            break;
        case 'SimpleLineIcons':
            C = SimpleLineIcons;
            break;
        case 'Zocial':
            C = Zocial;
            break;
    }

    if (C === null) {
        return null
    }

    return <C {...props} style={iconStyle} />
}

const styles = {
    size: {
        SIZE_24: {
            fontSize: SIZE.SIZE_24
        },
        // default: {
        //     fontSize: SIZE.text14
        // },
        // xs: {
        //     fontSize: SIZE.text18
        // },
        // md: {
        //     fontSize: SIZE.SIZE24
        // },
        // lg: {
        //     fontSize: SIZE.text36
        // },
        // xl: {
        //     fontSize: SIZE.text48
        // },
        // xl2: {
        //     fontSize: SIZE.text64
        // },
    },
    color: {
        dark: {
            color: COLOR.PRIMARY
        },
        LIGHT:{
            color: COLOR.LIGHT
        },
        yellow:{
            color: COLOR.yellow
        }
        // default: {
        //     color: COLOR.dark
        // },
        // light: {
        //     color: COLOR.light
        // },
    }
}

export default Icon