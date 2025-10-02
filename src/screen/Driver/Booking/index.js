
import React from 'react'
import { View, ScrollView, Image } from 'react-native'
import { Container, Content, Text, Icon } from '../../../component/Basic'
import { TextInput, Button, ToggleSwitch } from '../../../component/Form'

import Modal from 'react-native-modalbox'

import styles from './styles'
import theme from '../../../theme/styles'

import Header from '../../../component/Header'
import { DarkStatusBar } from '../../../component/StatusBar'

export default class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isDisabled: false,
      isOpen: false
    }
  }
  render() {
    return <Container>
      <DarkStatusBar />
      <Header
        leftType='back' />
      <View style={styles.bookingHeader}>
        <Text style={styles.bookingHeaderTitle}>BOOKING</Text>
        <Text style={styles.bookingHeaderText}>CHECKOUT YOUR BOOKINGS</Text>
      </View>
      <Content contentContainerStyle={theme.layoutDf}>
  <ScrollView showsVerticalScrollIndicator={false}>
    <View style={styles.bookingContainer}>
      <View style={styles.bookingForm}>
        <View style={styles.bookingItem}>
          <Text style={styles.bookingTitle}>BOOKING ID:#Z83764</Text>
          <Button>
            <Text style={styles.bookingCloseText}>Closed</Text>
          </Button>
        </View>
        <View style={styles.bookingInfo}>
          <Text style={styles.bookingText}>PICKUP TIME</Text>
          <View style={styles.bookingDetailInfo}>
            <Text style={styles.bookingTimeText}>Dec 25, 2019</Text>
            <Text style={styles.bookingDetailText}>11:30 AM</Text>
          </View>
        </View>
        <View style={styles.bookingInfo}>
          <Text style={styles.bookingText}>VEHICLE NO</Text>
          <Text style={styles.bookingDetailText}>NY 57565</Text>
        </View>
        <View style={styles.bookingInfo}>
          <Text style={styles.bookingText}>VEHICLE TYPE</Text>
          <Text style={styles.bookingDetailText}>Tata ACE</Text>
        </View>
        <View style={styles.bookingInfo}>
          <Text style={styles.bookingText}>MATERIAL TYPE</Text>
          <Text style={styles.bookingDetailText}>Electronics</Text>
        </View>
        <View style={styles.bookingInfo}>
          <Text style={styles.bookingText}>TOTAL LOAD</Text>
          <Text style={styles.bookingDetailText}>100 Kgs</Text>
        </View>
        <View style={styles.bookingInfo}>
          <Text style={styles.bookingText}>INVOICE DC COLLECTED</Text>
          <View>
            <ToggleSwitch />
          </View>
        </View>
        <View style={styles.bookingInfo}>
          <Text style={styles.bookingText}>STATUTORY DOCUMENT COLLECTED</Text>
          <View>
            <ToggleSwitch />
          </View>
        </View>
        <View style={styles.bookingInfo}>
          <Text style={styles.bookingText}>ADVANCE PAID</Text>
          <Text style={styles.bookingDetailText}>$500 USD</Text>
        </View>
        <View style={styles.bookingInfo}>
          <Text style={styles.bookingText}>$500 BALANCE TO BE COLLECTED</Text>
          <View>
            <ToggleSwitch />
          </View>
        </View>
      </View>
      <View style={styles.documentInfo}>
        <Text style={styles.documentTitle}>DOCUMENTS</Text>
        <Text style={styles.documentText}>Collect & Upload documents</Text>
        <View style={styles.documentDetails}>
          <Text style={styles.documentText}>ACKNOWLEDGEMENT</Text>
          <Button style={styles.uploadBtn}>
            <Text style={styles.uploadBtnText}>Upload</Text>
          </Button>
        </View>
      </View>
      <View style={styles.documentInfo}>
        <Text style={styles.documentTitle}>OTP</Text>
        <Text style={styles.documentText}>Please enter your OTP and Close the trip</Text>
        <Text style={styles.codeText}>OTP CODE</Text>
        <View style={styles.formRow}>
          <TextInput
            placeholder=""
            keyboardType="numeric"
            style={styles.formInput}
          />
          <TextInput
            placeholder=""
            keyboardType="numeric"
            style={styles.formInput}
          />
          <TextInput
            placeholder=""
            keyboardType="numeric"
            style={styles.formInput}
          />
          <TextInput
            placeholder=""
            keyboardType="numeric"
            style={styles.formInput}
          />
        </View>
        <Button
          style={styles.tripBtn}
          onPress={() => this.refs.modalCheckout.open()}
        >
          <Text style={styles.tripBtnText}>END TRIP</Text>
        </Button>
      </View>
    </View>
  </ScrollView>
</Content>

      <Modal
        ref={'modalCheckout'}
        position={'center'}
        isOpen={this.state.isOpen}
        onClosed={() =>
          this.setState({
            isOpen: false
          })
        }
        isDisabled={this.state.isDisabled}
        style={styles.modalCheckout}>
        <View>
          <Image source={require('../../../assets/images/tick-inside-circle.png')} style={styles.modalImg} />
        </View>
        <View style={styles.modalTextInfo}>
          <Text style={styles.modalTitle}>Thank You</Text>
          <Text style={styles.modalText}>Your Trip has been completed\nsuccessfully</Text>
        </View>
      </Modal>
    </Container>
  }
}
