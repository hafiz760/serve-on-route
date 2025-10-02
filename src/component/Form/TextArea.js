import React from 'react'
import { TextInput as NativeTextInput } from 'react-native'

const TextArea = ({variant = 'default', ...props}) => {
  const { style, ...p } = props
  return (
    <NativeTextInput
        style={props.style ? [styles.container, props.style] : styles.container}
        multiline
        {...p}
    >{props.children}</NativeTextInput>
  )
}

const styles = {
  container: {
    paddingHorizontal: 5
  }
}

export default TextArea
