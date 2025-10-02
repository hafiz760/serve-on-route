import React from 'react'
import { Image, Platform, Text, View } from 'react-native'

import themePlatform from '../../theme/platform'
import { COLOR, FAMILY, SIZE } from '../../theme/typography'
import theme from '../../theme/styles'
import { goBack, openDrawer } from '../../navigations'
import { Button } from '../Form'
import { Icon } from '../Basic'

const Left = (props) => {
  let C
  if (props.leftContent) {
    C = props.leftContent
  } else if (props.leftType === 'menu') {
    C = (
      <Button style={styles.btn} 
      
      onPress={openDrawer}
      >
        <Icon name='menu' type='Entypo' style={[theme.SIZE_30, theme.LIGHT]} />
        {/* <Icon name='bell' type='Entypo' style={[theme.SIZE_30, theme.LIGHT]} /> */}

      </Button>

    )
  } else if (props.leftType === 'back') {
    C = (
      <Button style={styles.btn} 
              onPress={goBack}
      >
        <Icon name='arrow-left' type='Feather' style={[theme.SIZE_30, theme.LIGHT]} />

      </Button>
    )
  }


  return (
    <View style={props.leftStyle ? [styles.left, props.leftStyle] : styles.left}>
      {C}
    </View>
  )
}
const Right = (props) => {
  let C
  if (props.rightContent) {
    C = props.rightContent
  }
  else if (props.rightType === 'Icon') {
    C = (<Button style={styles.btn1} >
      {/* <Icon name='key-variant' type='MaterialCommunityIcons' style={[theme.SIZE_30, ]} /> */}
      <Icon name='bell' type='Feather' style={[theme.SIZE_24, theme.LIGHT,styles.iconStyle ]}/>

    </Button>
    )
  }
  return (
    <View style={props.rightStyle ? [styles.right, props.rightStyle] : styles.right}>
      {C}
    </View>
  )
}

const Middle = (props) => {
  let C
  if (props.middleContent) {
    C = props.middleContent
  } else if (props.title) {
    const titleStyle = [styles.headerTitle]
    if (props.titleAlign) {
      titleStyle.push(styles[props.titleAlign])
    }
    if (props.titleColor) {
      titleStyle.push(styles[props.titleColor])
    }
    C = <Text style={styles.middleText} >{props.title}</Text>
  }
  return (
    <View style={props.middleStyle ? [styles.middle, props.middleStyle] : styles.middle}>
      {C}
    </View>
  )
}



const Header = ({ variant = 'default', ...props }) => {
  const cs = { ...styles.container }
  if (variant === 'DEFAULT') {
    cs.backgroundColor = COLOR.DEFAULT
  } else if (variant === 'PRIMARY') {
    cs.backgroundColor = COLOR.PRIMARY
  } else if (variant === 'transparent') {
    cs.backgroundColor = 'transparent'
  }
  return (
    <View style={props.style ? [cs, props.style] : cs}>
      <Left {...props} variant={variant} />
      <Middle {...props} variant={variant} />
      <Right {...props} variant={variant} />
    </View>
  )
}

const containerHeight = Platform.OS === 'ios' ? themePlatform.toolbarHeight + 10 : themePlatform.toolbarHeight

const styles = {
  iconStyle :{
    transform: [{ rotate: '35deg' }] 
  },
  
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: containerHeight,
    backgroundColor: COLOR.PRIMARY
  },
  left: {
    flex: 1.5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  middle: {
    flex: 7,
    justifyContent: 'center',
    alignItems: 'center'
  },

  start: {

  },
  center: {

  },
  end: {

  },
  middleText: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_24,
    color: COLOR.LIGHT
  },
  LIGHT: {
    color: COLOR.LIGHT
  },
  dark: {
    color: COLOR.dark
  },

  right: {
    flex: 1.5,
    alignItems: 'flex-end',
    justifyContent: 'center'
  },

  btn: {
    paddingHorizontal: 15,
    paddingVertical: 15
  },
  btn1: {
    paddingHorizontal: 15,
    paddingVertical: 15,


  },
  btnImg: {
    width: 24,
    height: 24
  },
  headerTitle: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_16,
    color: COLOR.dark
  }
}

export default Header