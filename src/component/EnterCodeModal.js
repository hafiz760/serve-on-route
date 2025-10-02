import React from 'react';
import { View, Text, Modal, TextInput, Pressable, StyleSheet } from 'react-native';

const EnterCodeModal = ({
    modalVisible,
    setModalVisible,
    onChangeNumber,
    number,
    handleDoneTripStatus,
  }) => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Enter Code</Text>
            <TextInput
              style={styles.input}
              onChangeText={onChangeNumber}
              value={number}
              placeholder="0000"
              keyboardType="numeric"
            />
            <Pressable
              onPress={() => {
                setModalVisible(!modalVisible);
                handleDoneTripStatus();
              }}
              style={styles.doneButton}>
              <Text style={styles.doneButtonText}>Done</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    );
  };
  
  const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalView: {
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 20,
      alignItems: 'center',
    },
    modalText: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 8,
      padding: 10,
      marginBottom: 20,
      width: '100%',
    },
    doneButton: {
      backgroundColor: '#007AFF',
      borderRadius: 8,
      padding: 10,
      width: '100%',
      alignItems: 'center',
    },
    doneButtonText: {
      color: 'white',
      fontWeight: 'bold',
    },
  });

export default EnterCodeModal;
