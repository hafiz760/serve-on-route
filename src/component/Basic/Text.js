import React from 'react'
import { Text as NativeText } from 'react-native'
import { COLOR, FAMILY, SIZE } from '../../theme/typography'

const Text = ({ variant = 'regular', text , size, color, style, ...props }) => {
  const sizeStyle = styles.size[size]
  const colorStyle = styles.color[color]
  const textStyle = [styles.text[variant], sizeStyle, colorStyle]
  if (style) {
    textStyle.push(style)
  }

  return (
    <NativeText {...props} style={textStyle}>{props.children}</NativeText>
  )
}

const styles = {
  text: {
    regular: {
      fontFamily: FAMILY.REGULAR
    },
    medium: {
      fontFamily: FAMILY.MEDIUM
    },
    semiBold: {
      fontFamily: FAMILY.SEMIBOLD
    },
    bold: {
      fontFamily: FAMILY.BOLD
    },
  },
  size: {
    text14: {
      fontSize: SIZE.text14
    },
    text18: {
      fontSize: SIZE.text18
    },
    text24: {
      fontSize: SIZE.text24
    },
    text36: {
      fontSize: SIZE.text36
    },
    text48: {
      fontSize: SIZE.text48
    }
  },
  color: {
    default: {
      color: COLOR.dark
    },
    LIGHT: {
      color: COLOR.LIGHT
    },
    DARK: {
      color: COLOR.DARK
    }
  }
}

export default Text
