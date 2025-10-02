import React, { useEffect, useState } from 'react'
import { Text, View } from 'react-native'

import styles from './styles'
import theme from '../../../theme/styles'

import { Icon } from '../../../component/Basic'
import { Button } from '../../../component/Form'

const Accordion = ({ title, text, renderContent, onOpened, onClosed, expanded }) => {
  const [opened, setOpened] = useState(false)

  useEffect(() => {
    if (opened) {
      onOpened && onOpened()
    } else {
      onClosed && onClosed()
    }
  }, [opened])

  const toggle = () => {
    setOpened(!opened)
  }

  return (
    <View style={styles.accordion}>
      <Button disabled style={styles.accordionBtn} onPress={toggle}>
        <Text style={opened ? styles.accordionTitle : styles.accordionTitle}>{title}</Text>
        <View style={styles.accordionInfo}>
          {/* <View style={styles.accordionItem}>
            <Text style={opened ? styles.accordionActiveText : styles.accordionInactiveText}>{text}</Text>
          </View> */}
          <Icon name={opened ? 'keyboard-arrow-down' : 'keyboard-arrow-right'} type='MaterialIcons' style={[theme.SIZE_20, theme.DARKBLUE]} />
        </View>
      </Button>
      {opened ? renderContent() : null}
    </View>
  )
}

export default Accordion