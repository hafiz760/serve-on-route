import React, { useState } from "react"
import { Switch } from "react-native"

const ToggleSwitch = ({setValue,value}) => {
 
  const toggleSwitch = () => setValue(previousState => !previousState)

  return (
    <Switch
      trackColor={{ false: "grey", true: "rgba(89, 73, 158, 1)" }}
      thumbColor={value ? "blue" : "white"}
      onValueChange={toggleSwitch}
      value={value}
    />
  )
}

export default ToggleSwitch