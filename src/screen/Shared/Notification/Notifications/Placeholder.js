import React from 'react'
import { View } from 'react-native'
import { Fade, Placeholder, PlaceholderMedia, PlaceholderLine } from 'rn-placeholder'

import styles from '../styles'

export default class extends React.Component {
  render() {
    return (
      <Placeholder Animation={Fade} >
        <View style={styles.notificationContent}>
          <View style={styles.notificationInfo}>
            <PlaceholderLine width={40} />
            <PlaceholderLine width={20} />
          </View>
          <View style={styles.notificationDetail}>
            <PlaceholderLine width={80} />
          </View>
        </View>
      </Placeholder>

    )
  }
}
