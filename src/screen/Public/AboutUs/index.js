import React from 'react'
import { View, ScrollView } from 'react-native'
import { Container, Content, Text, Icon } from '../../../component/Basic'
import styles from './styles'
import theme from '../../../theme/styles'
import Header from '../../../component/Header'

import { DarkStatusBar } from '../../../component/StatusBar'
export default class extends React.Component {
  render() {
    return <Container>
      <DarkStatusBar />
      <Header
        leftType='back'
        title={''} />
      <View style={styles.aboutUsHeader}>
        <Text style={styles.aboutUsHeaderTitle}>ABOUT US</Text>
        <Text style={styles.aboutUsHeaderText}>Information about your company</Text>
      </View>
      <Content contentContainerStyle={theme.layoutDf}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.aboutUsContent}>
            <Text style={styles.aboutUsText}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Penatibus et magnis dis parturient montes nascetur ridiculus mus. Ultricies leo integer malesuada nunc. \n\n  Donec ac odio tempor orci dapibus ultrices. Quam adipiscing vitae proin sagittis nisl rhoncus mattis rhoncus. Sed faucibus turpis in eu. Vulputate eu scelerisque felis imperdiet proin fermentum leo vel. Sit amet porttitor eget dolor morbi non arcu risus quis. \n\n In hac habitasse platea dictumst vestibulum rhoncus. Aliquam sem fringilla ut morbi tincidunt augue interdum velit. In hac habitasse platea dictumst vestibulum rhoncus.
            </Text>
          </View>
        </ScrollView>
      </Content>
    </Container>
  }
}
