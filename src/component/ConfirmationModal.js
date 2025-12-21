import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Modal from 'react-native-modal';
import {COLOR, FAMILY, SIZE} from '../theme/typography';

const ConfirmationModal = ({
  isVisible,
  onClose,
  onConfirm,
  title,
  message,
  onModalHide,
}) => {
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onModalHide={onModalHide}
      animationIn="fadeIn"
      animationOut="fadeOut"
      animationInTiming={300}
      animationOutTiming={300}
      backdropTransitionInTiming={300}
      backdropTransitionOutTiming={0}
      useNativeDriver={true}
      hideModalContentWhileAnimating={true}
      style={styles.modal}>
      <View style={styles.container}>
        <Text style={styles.title}>{title || 'Are you sure?'}</Text>
        <Text style={styles.message}>{message}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={onClose}
            style={[styles.button, styles.cancelButton]}>
            <Text style={styles.cancelText}>No</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onConfirm}
            style={[styles.button, styles.confirmButton]}>
            <Text style={styles.confirmText}>Yes</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  title: {
    fontSize: SIZE.SIZE_18,
    fontFamily: FAMILY.BOLD,
    color: COLOR.PRIMARY,
    marginBottom: 10,
  },
  message: {
    fontSize: SIZE.SIZE_14,
    fontFamily: FAMILY.REGULAR,
    color: COLOR.DARK,
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: COLOR.SMOKELIGHT,
  },
  confirmButton: {
    backgroundColor: COLOR.PRIMARY,
  },
  cancelText: {
    color: COLOR.DARK,
    fontFamily: FAMILY.BOLD,
  },
  confirmText: {
    color: 'white',
    fontFamily: FAMILY.BOLD,
  },
});

export default ConfirmationModal;
