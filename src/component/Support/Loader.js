import React from 'react'
import {
  StyleSheet,
  View,
  Modal,
  ActivityIndicator
} from 'react-native'

class Loader extends React.PureComponent {
    static instance;

    constructor (props) {
        super(props)

        this.state = {
          visible: false
        }

        this.showLoading = this.showLoading.bind(this)
        this.hideLoading = this.hideLoading.bind(this)
    }

    showLoading () {
        this.setState({
          visible: true
        })
    }

    hideLoading () {
        this.setState({
          visible: false
        })
    }

  render () {
    return (
      <Modal
        transparent
        animationType='none'
        visible={this.state.visible}
      >
        <View style={styles.modalBackground}>
          <View style={styles.activityIndicatorWrapper}>
            <ActivityIndicator size='large' color='#ffffff' animating />
          </View>
        </View>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040'
  },
  activityIndicatorWrapper: {
    backgroundColor: 'transparent',
    height: 100,
    width: 100,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around'
  }
})

export default Loader
