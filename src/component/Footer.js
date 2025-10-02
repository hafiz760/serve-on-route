import React from 'react'
import { Text, View } from 'react-native'

import { Icon } from '../component/Basic'
import { Button } from '../component/Form'
import { navigate } from '../navigation'
import { COLOR, FAMILY, SIZE } from '../theme/typography'

const isActive = (currentScreen, name) => (currentScreen == name)

const Item = (props) => {
  return (
    <Button
      style={props.isActive ? [styles.btn, styles.btnActive] : styles.btn}
      onPress={() => {
        navigate(props.routeName)
      }}
    >
      {
        props.icon
          ? (<Icon name={props.icon.name} type={props.icon.type} style={props.isActive ? [styles.icon, styles.iconActive] : styles.icon} />)
          : null
      }
      {
        props.text
          ? (<Text style={props.isActive ? [styles.text, styles.textActive] : styles.text}>{props.text.name}</Text>)
          : null
      }
    </Button>
  )
}

const Footer = (props) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Item
          isActive={isActive(props.currentScreen, 'PublicHome')}
          routeName='PublicHome'
          icon={{ name: 'home', type: 'FontAwesome' }}
          text={{ name: 'Home' }}
        />
        <Item
          isActive={isActive(props.currentScreen, 'PublicSearch')}
          routeName='PublicSearch'
          icon={{ name: 'search', type: 'FontAwesome' }}
          text={{ name: 'Search' }}
        />
        <Item
          isActive={isActive(props.currentScreen, '')}
          routeName=''
          icon={{ name: 'heart', type: 'FontAwesome' }}
          text={{ name: 'Activity' }}
        />
        <Item
          isActive={isActive(props.currentScreen, '')}
          routeName=''
          icon={{ name: 'user', type: 'FontAwesome' }}
          text={{ name: 'Profile' }}
        />
      </View>
    </View>
  )
}

const styles = {
  container: {
    width: '100%',
    position: 'absolute',
    bottom: 0
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    backgroundColor: COLOR.GREYLIGHT,
    paddingHorizontal: 5
  },
  btn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10
  },
  btnActive: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10
  },
  icon: {
    fontSize: SIZE.SIZE_20,
    color: COLOR.GREY,
    marginBottom: 5
  },
  iconActive: {
    fontSize: SIZE.SIZE_24,
    color: COLOR.PRIMARY,
    marginBottom: 5
  },
  text: {
    fontFamily: FAMILY.REGULAR,
    fontSize: SIZE.SIZE_12,
    color: COLOR.GREY
  },
  textActive: {
    fontFamily: FAMILY.SEMIBOLD,
    fontSize: SIZE.SIZE_12,
    color: COLOR.PRIMARY
  }
}

export default Footer