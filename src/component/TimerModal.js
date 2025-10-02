import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Modal from 'react-native-modal';
import CountDown from 'react-native-countdown-component';
const TimerModal = (isVisible) => {
  return (
    <View>
     <Modal isVisible={isVisible}  style={styles.modal}>
     <CountDown
        until={60 * 1 + 30}
        size={30}
        onFinish={() => alert('Finished')}
        digitStyle={{backgroundColor: '#FFF'}}
        digitTxtStyle={{color: '#1CC625'}}
        timeToShow={['M', 'S']}
        timeLabels={{m: 'MM', s: 'SS'}}
      />
      </Modal>
    </View>
  )
}

export default TimerModal

const styles = StyleSheet.create({})