import React from 'react'
import { Platform, View } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import Dialog from 'react-native-dialog'
import PropTypes from 'prop-types'
import moment from 'moment'

import Placeholder from './Placeholder'
import { bind } from '../../../utility/component'

class Picker extends React.Component {
  constructor (props) {
    super(props)

    const date = moment(props.value, props.format)

    this.state = {
      visibleDateTimePicker: false,
      date: date.isValid() ? date : null
    }

    bind(this)

    this.open = this.open.bind(this)
    this.onCancelIos = this.onCancelIos.bind(this)
    this.applyData = this.applyData.bind(this)
    this.renderPicker = this.renderPicker.bind(this)
    this.renderIOS = this.renderIOS.bind(this)
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevProps.value !== this.props.value) {
      const date = moment(this.props.value, this.props.format)
      this.setState({
        date: date.isValid() ? date : null
      })
    }
  }

  async open () {
    const date = moment(this.props.value, this.props.format)
    const state = {
      visibleDateTimePicker: true,
      date: date.isValid() ? date : null
    }
    if (this.props.mode === 'datetime') {
      state.modeSub = 'date'
    }
    await this.promisedSetState(state)
  }

  onCancelIos () {
    this.setState({
      visibleDateTimePicker: false
    })
  }

  async applyData () {
    await this.promisedSetState({
      visibleDateTimePicker: false
    })
    await this.props.onChange(this.state.date ? this.state.date.format(this.props.format) : '')
    if (this.props.mode === 'datetime') {
      if (this.state.modeSub === 'date') {
        await this.promisedSetState({
          visibleDateTimePicker: true,
          modeSub: 'time'
        })
      }
    }
  }

  renderPicker () {
    let display
    let mode = this.props.mode
    if (this.props.mode === 'date') {
      display = 'calendar'
    } else if (this.props.mode === 'time') {
      display = Platform.OS === 'android' ? 'clock' : 'inline'
    } else if (this.props.mode === 'datetime') {
      mode = this.state.modeSub
      if (this.props.mode === 'date') {
        display = 'calendar'
      } else if (this.props.mode === 'time') {
        display = Platform.OS === 'android' ? 'clock' : 'inline'
      }
    }

    return (
      <DateTimePicker
        testID='dateTimePicker'
        timeZoneOffsetInMinutes={moment().utcOffset()}
        value={this.state.date ? this.state.date.toDate() : (new Date())}
        mode={mode}
        display={display}
        locale='en_GB'
        minimumDate={this.props.minimumDate}
        onChange={async (event, date) => {
          if (date === undefined) {
            await this.promisedSetState({
              visibleDateTimePicker: false
            })
          } else {
            const m = moment(date)
            await this.promisedSetState({
              date: m.isValid() ? m : null
            })
            if (Platform.OS === 'android') {
              this.applyData()
            }
          }
        }}
      />
    )
  }

  renderIOS () {
    return (
      <Dialog.Container visible>
        <Dialog.Title>{this.props.title}</Dialog.Title>
        <View>{this.renderPicker()}</View>
        <Dialog.Button label='Cancel' onPress={this.onCancelIos} />
        <Dialog.Button label='Ok' onPress={this.applyData} />
      </Dialog.Container>
    )
  }

  render () {
    let picker
    if (this.state.visibleDateTimePicker) {
      if (Platform.OS === 'android') {
        picker = this.renderPicker()
      } else if (Platform.OS === 'ios') {
        picker = this.renderIOS()
      }
    }

    const buttonProps = {}
    buttonProps.style = {
      flex: 1,
      paddingVertical: 5
    }
    if (this.props.buttonStyle) {
      buttonProps.style = this.props.buttonStyle
    }

    const textProps = {}
    if (this.props.textStyle) {
      textProps.style = Array.isArray(this.props.textStyle) ? [...this.props.textStyle] : [this.props.textStyle]
    }
    if (this.state.date) {
    } else {
      if (this.props.placeholderTextColor) {
        if (!textProps.style) {
          textProps.style = []
        }
        textProps.style.push({ color: this.props.placeholderTextColor })
      }
    }

    buttonProps.onPress = this.open

    return (
      <>
        <Placeholder
          buttonStyle={this.props.buttonStyle}
          textStyle={this.props.textStyle}
          date={this.state.date}
          displayFormat={this.props.displayFormat}
          placeholder={this.props.placeholder}
          placeholderTextColor={this.props.placeholderTextColor}
          onPress={this.open}
        />
        {picker}
      </>
    )
  }
}

Picker.propTypes = {
  title: PropTypes.string,
  placeholder: PropTypes.string,
  placeholderTextColor: PropTypes.string,
  format: PropTypes.string,
  displayFormat: PropTypes.string,
  buttonStyle: PropTypes.object,
  textStyle: PropTypes.object,
  componentRight: PropTypes.element
}

Picker.defaultProps = {
  title: '',
  placeholder: '',
  placeholderTextColor: null,
  format: '',
  displayFormat: '',
  buttonStyle: null,
  textStyle: null,
  is24Hour: null
}

export default Picker
