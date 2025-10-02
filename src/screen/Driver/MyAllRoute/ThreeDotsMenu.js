import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet, Image } from "react-native";
import { COLOR, FAMILY, SIZE } from "../../../theme/typography";


const ThreeDotsMenu = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleModal}>
        <Image source={require("../../../asset/images/threeDot.png")} />
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={toggleModal}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.modalItem}
            onPress={() => console.log("Option 1")}
          >
            <Text style={{color:"#000"}}>Delete</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalItem} onPress={toggleModal}>
            <Text style={{color:"#000"}}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  modalContainer: {
    position: "absolute",
    top: 30,
    right: 20,
    backgroundColor: "white",
    elevation: 5,
    borderRadius: 5,
    padding: 10,
  },
  modalItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    color: COLOR.BLUE,
  },
});

export default ThreeDotsMenu;
