import React from 'react'
import { Platform } from 'react-native'

import Picker from './Picker'

export const DatePicker = (props) => {
  const p = {}
  if (typeof props.format !== 'string') {
    p.format = 'YYYY-MM-DD'
  }
  if (typeof props.displayFormat !== 'string') {
    p.displayFormat = 'DD/MM/YYYY'
  }
  p.mode = 'date'
  p.title = 'Date'

  return (
    <Picker {...props} {...p} />
  )
}

export const TimePicker = (props) => {
  const p = {}
  if (typeof props.format !== 'string') {
    p.format = 'HH:mm:ss'
  }
  if (typeof props.displayFormat !== 'string') {
    p.displayFormat = 'hh:mm A'
  }
  p.mode = 'time'
  if (typeof props.is24Hour !== 'boolean') {
    p.is24Hour = false
  }
  p.title = 'Time'

  return (
    <Picker {...props} {...p} />
  )
}

export const DateTimePicker = (props) => {
  const p = {}
  if (typeof props.format !== 'string') {
    p.format = 'YYYY-MM-DD HH:mm:ss'
  }
  if (typeof props.displayFormat !== 'string') {
    p.displayFormat = 'DD/MM/YYYY hh:mm A'
  }
  p.mode = 'datetime'
  p.display = Platform.OS === 'android' ? 'clock' : 'inline'
  if (typeof props.is24Hour !== 'boolean') {
    p.is24Hour = false
  }
  p.title = 'Date & Time'

  return (
    <Picker {...props} {...p} />
  )
}
