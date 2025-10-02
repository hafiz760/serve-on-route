import React from 'react'

import { Icon } from '../../component/Basic'
import { Button } from '../../component/Form'

const RadioButton = ({ variant = 'default', ...props }) => {
  const { style, checked, onChange, prefix, suffix, color, ...p } = props

  p.onPress = () => {
    onChange && onChange(!checked)
  }

  const iconStyle = { color: '#EF233C' || 'black' }
  if (prefix || suffix) {
    iconStyle.paddingHorizontal = 5
    iconStyle.marginRight = 10
  }

  return (
    <Button disabled style={props.style ? [styles.container, props.style] : styles.container} {...p}>
      {prefix}
      <Icon name={checked ? 'check-circle' : 'checkbox-blank-circle-outline'} type='MaterialCommunityIcons' style={iconStyle} />
      {suffix}
    </Button>
  )
}

const styles = {
  container: {
    paddingHorizontal: 5,
    marginBottom: -10
  }
}

export default RadioButton