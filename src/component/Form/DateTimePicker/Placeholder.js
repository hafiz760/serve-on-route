import React from 'react'
import { Text, TouchableOpacity } from 'react-native'

const Placeholder = (props) => {
  const buttonProps = {}
  buttonProps.style = {
    flex: 1,
    paddingVertical: 5
  }
  if (props.buttonStyle) {
    buttonProps.style = props.buttonStyle
  }

  const textProps = {}
  if (props.textStyle) {
    textProps.style = Array.isArray(props.textStyle) ? [...props.textStyle] : [props.textStyle]
  }
  if (props.date) {
  } else {
    if (props.placeholderTextColor) {
      if (!textProps.style) {
        textProps.style = []
      }
      textProps.style.push({ color: props.placeholderTextColor })
    }
  }

  buttonProps.onPress = props.onPress

  return (
    <TouchableOpacity {...buttonProps}>
      <Text {...textProps}>
        {props.date ? props.date.format(props.displayFormat) : props.placeholder}
      </Text>
    </TouchableOpacity>
  )
}

export default Placeholder
