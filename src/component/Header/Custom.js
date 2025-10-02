import React from 'react'
import { Image, TouchableHighlight, View } from 'react-native'
import { Icon } from '../../component/Basic'
import { goBack } from '../../navigations'

const CustomHeader = () => {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <TouchableHighlight style={styles.customHeaderBtn} onPress={goBack}>
          <Icon name='arrow-left' type='Feather' style={styles.btnIcon} />
        </TouchableHighlight>
      </View>
      <View style={styles.mid} />
      <View style={styles.right} />
    </View>
  )
}

const styles = {
  container: {
    flexDirection: 'row',
    position: 'absolute',
    width: '100%',
    height: 40,
    marginTop: 20,
    
  },
  left: {
    flex: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    
  },
  mid: {
    flex: 7,
    justifyContent: 'center',
  },
  right: {
    flex: 1.5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  btn: {
    paddingVertical: 10,
    paddingHorizontal: 10
  }
}

export default CustomHeader
