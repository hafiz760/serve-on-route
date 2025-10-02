import React from 'react'
import { StatusBar, View } from 'react-native'
import { useIsFocused } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { COLOR } from '../theme/typography'

const C = function (props) {
  const isFocused = useIsFocused()
  if (isFocused) {
    const insets = useSafeAreaInsets()
    const style = { height: insets.top }
    if (props.backgroundColor) {
      style.backgroundColor = props.backgroundColor
    }
    return (
      <View style={style}>
        <StatusBar animated {...props} />
      </View>
    )
  }
  return null
}

export const DarkStatusBar = function (props) {
  return <C backgroundColor={props.backgroundColor || COLOR.PRIMARY} barStyle='light-content' />
}

export const LightStatusBar = function (props) {
  return <C backgroundColor={props.backgroundColor || COLOR.default} barStyle='dark-content' />
}