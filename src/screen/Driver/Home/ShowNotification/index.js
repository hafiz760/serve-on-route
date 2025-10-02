import React, { useState, useRef, useEffect } from "react";
import { View, ScrollView, FlatList } from "react-native";
import { Container, Content } from "../../../../component/Basic";
import { DarkStatusBar } from "../../../../component/StatusBar";
import Header from "../../../../component/Header";
import theme from "../../../../theme/styles";
import { Text, Icon } from "../../../../component/Basic";
import { Button } from "../../../../component/Form";
import styles from "./Styles";
import DropDownPicker from "react-native-dropdown-picker";

const ShowNotification = () => { 
  let initialArray = [
    { date: "6" },
    { date: "3" },
    { date: "5" },
    { date: "2" },
    { date: "4" },
    { date: "1" },
  ];
  const [arr, setArr] = useState(initialArray);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [items, setItems] = useState([
    { label: "Sort by Date", value: "Sort by Date" },
    { label: "Sort by Price", value: "Sort by price" },
  ]);

  const sortArray = (sortBy) => {
    let sortedArr = [...arr];
    if (sortBy === "Sort by Date") {
      sortedArr.sort((a, b) => parseInt(a.date) - parseInt(b.date));
    } else if (sortBy === "Sort by Price") {
      // Implement sorting by price logic here
      // sortedArr.sort(...);
    }
    setArr(sortedArr);
  };

  useEffect(() => {
    if (value) {
      sortArray(value);
    }
  }, [value]);

  const renderItem = ({ item, index }) => {
    return (
      <>
        <View style={styles.notificationContent}>
          <View style={styles.notificationInfo}>
            <Text style={styles.notificationTitle}>{"Notification ID"}</Text>
            <Text style={styles.notificationText}>{item.date}</Text>
          </View>
          <View style={styles.notificationDetail}>
            <Text style={styles.bookingText}>AAAAAAAAAAAAAAA</Text>
            <Button style={styles.deleteBtn}>
              <Icon
                name="checkmark-done"
                type="Ionicons"
                style={[theme.SIZE_20, { color: "blue" }]}
              />
            </Button>
          </View>
        </View>
      </>
    );
  };
  return (
    <Container>
      <DarkStatusBar />
      <Header leftType="menu" title={"Notification"} />
      <View style={styles.pickerView}>
        <DropDownPicker
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
          style={{ borderColor: "#fff" }}
          placeholder="SORT"
        />
      </View>
      <FlatList data={arr} renderItem={renderItem} />
    </Container>
  );
};
export default ShowNotification;
