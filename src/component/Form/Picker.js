import React from 'react'
import RNPickerSelect from 'react-native-picker-select'

import { pickerSelectStyles } from '../../theme/styles'

const Picker = ({variant = 'default', ...props}) => {
  const { onChange, placeholder: _placeholder, placeholderTextColor, style: _style, ...p } = props

  p.onValueChange = (value, index) => {
    if (props.value === value || (index === 0 && !props.value)) {
      return
    }
    onChange && onChange(props.name, value)
  }

  const placeholder = {
    label: _placeholder || 'Select',
    value: '',
    color: placeholderTextColor || '#000000'
  }
  const style = [pickerSelectStyles]
  if (_style) {
    style.push(_style)
  }

  return (
    <RNPickerSelect
      {...p}
      placeholder={placeholder}
      style={style}
    />
  )
}

export default Picker