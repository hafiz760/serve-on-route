import React from 'react'
import { View, ScrollView, Image } from 'react-native'
import { Container, Content, Text, Icon } from '../../../component/Basic'
import { TextInput, Button, } from '../../../component/Form'

import styles from './styles'
import theme from '../../../theme/styles'

import Header from '../../../component/Header'
import Support from '../../../component/Support'


import { DarkStatusBar } from '../../../component/StatusBar'
import { bind } from '../../../utilities/component'
import { navigateReset } from '../../../navigations'
export default class extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      values: {}
    }

    bind(this)

    this.onChangeText = this.onChangeText.bind(this)
    this.validate = this.validate.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  onChangeText(n, v) {
    this.setState({
      values: { ...this.state.values, [n]: v }
    })
  }

  validate() {
    const isEmpty = (key) => {
      return !(typeof this.state.values[key] !== 'undefined' && this.state.values[key] !== '')
    }
    const errors = []
    if (isEmpty('email')) {
      errors.push('Please enter your email address')
    } else if (!this.state.values.email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
      errors.push('Please enter a valid email address')
    }


    if (isEmpty('name')) {
      errors.push('Please enter your Name')
    }

    if (isEmpty('comment')) {
      errors.push('Please enter your Comments')
    }

    if (isEmpty('mobileNumber')) {
      errors.push('Please enter your Mobile Number')
    }

    if (errors.length) {
      throw new Error(errors.join('\n'))
    }
  }

  async onSubmit() {
    await Support.showLoading()
    try {
      this.validate()

      await Support.showSuccess({
        title:('Successfully'),
        message: ('Your comments can be sent successfully'),
        onHide: () => {
          navigateReset('')
        },
        hideDelay: 2500
      })
    } catch (e) {
      await Support.showServerError(e)
    }
    await Support.hideLoading()
  }
  render() {
    return <Container>
      <DarkStatusBar />
      <Header
        leftType='back' />
      <View style={styles.contactHeader}>
        <Text style={styles.contactHeaderTitle}>CONTACT</Text>
        <Text style={styles.contactHeaderText}>Information about your company</Text>
      </View>
      <Content contentContainerStyle={theme.layoutDf}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.contactContainer}>
            <View style={styles.formRow}>
              <Text style={styles.formText}>NAME</Text>
              <TextInput
                placeholder='Daniel Vettari'
                placeholderTextColor='#rgba(42,33,77,0.8)'
                style={styles.formInput} 
                onChangeText={(v) => this.onChangeText('name', v)}/>
            </View>
            <View style={styles.formRow}>
              <Text style={styles.formText}>EMAIL ADDRESS</Text>
              <TextInput
                placeholder='daniel@gmail.com'
                placeholderTextColor='#rgba(42,33,77,0.8)'
                style={styles.formInput} 
                onChangeText={(v) => this.onChangeText('email', v)}/>
            </View>
            <View style={styles.formRow}>
              <Text style={styles.formText}>MOBILE NUMBER</Text>
              <TextInput
                placeholder='+ 012459253784'
                keyboardType='numeric'
                placeholderTextColor='#rgba(42,33,77,0.8)'
                style={styles.formInput} 
                onChangeText={(v) => this.onChangeText('mobileNumber', v)} />
            </View>
            <View style={styles.formRow}>
              <Text style={styles.formText}>COMMENTS</Text>
              <TextInput
                placeholder='Write your comments'
                multiline
                numberOfLines={7}
                textAlignVertical={'top'}
                placeholderTextColor='#rgba(42,33,77,0.8)'
                style={styles.formInput}
                onChangeText={(v) => this.onChangeText('comment', v)} />
            </View>
            <Button style={styles.sendBtn} onPress={this.onSubmit}>
              <Text style={styles.sendText}>END</Text>
            </Button>
          </View>
        </ScrollView>
      </Content>
    </Container>
  }
}
