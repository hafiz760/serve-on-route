import React from 'react'
import { View } from 'react-native'
import { Container, Content, Text, Icon } from '../../../component/Basic'
import { } from '../../../component/Form'

import AsyncStorage from '@react-native-async-storage/async-storage'

import RNPickerSelect from 'react-native-picker-select'
import RNRestart from 'react-native-restart'

import styles from './styles'
import Header from '../../../component/Header'

import theme from '../../../theme/styles'
import Languages from '../../../config/language'
import { __, setLocale } from '../../../utilities/translation'


export default class extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      language: ''
    }

    this.changeLanguage = this.changeLanguage.bind(this)
  }

  async componentDidMount () {
    const language = await AsyncStorage.getItem('language')
    this.setState({
      language
    })
  }

  async changeLanguage (code) {
    if (this.state.language !== code) {
      const l = Languages.find(item => (item.code === code))
      if (l) {
        await AsyncStorage.setItem('language', code)
        setLocale(code, l.direction)
        RNRestart.Restart()
      }
    }
  }

  render () {
    return (
      <Container style={theme.layoutDf}>
        <Header statusBarType='dark' navLeftType='back' title={__('Language')} />
        <Content contentContainerStyle={theme.layout}>

          <View style={styles.langContainer}>
            <Text style={styles.langLabel}>{__('Languages')}</Text>
            <View style={styles.langPicker}>
              <RNPickerSelect
                items={Languages.map(item => ({ label: item.name, value: item.code }))}
                value={this.state.language}
                pickerProps={{
                  style: styles.langPickerText
                }}
                onValueChange={this.changeLanguage}
              />
            </View>
          </View>

        </Content>
      </Container>
    )
  }
}
