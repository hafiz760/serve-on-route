import React from "react";
import { View, ScrollView, Image } from "react-native";
import { Container, Content, Text, Icon } from "../../../component/Basic";
import { TextInput, Button, ToggleSwitch } from "../../../component/Form";

import styles from "./styles";
import theme from "../../../theme/styles";

import Header from "../../../component/Header";
import Accordion from "./Accordion";

import CalendarStrip from "react-native-calendar-strip";
import Modal from "react-native-modalbox";
import { DarkStatusBar } from "../../../component/StatusBar";
import { navigate } from "../../../navigations";
export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDisabled: false,
      isOpen: false,
    };
    console.log("props",props);
  }
  render() {
    return (
      <Container>
        <DarkStatusBar />
        <Header leftType="back" title={"Shared Vehicle"} />
        <View>
          <CalendarStrip
            calendarAnimation={{ type: "sequence", duration: 30 }}
            daySelectionAnimation={{
              type: "background",
              duration: 300,
              highlightColor: "rgb(53,190,224)",
              fontFamily: "Montserrat-SemiBold",
            }}
            style={{
              height: 140,
              paddingVertical: 10,
              backgroundColor: "rgba(89,73,158,1)",
            }}
            calendarHeaderStyle={{ color: "#FFF" }}
            calendarColor={"#FFF"}
            dateNumberStyle={{ color: "#FFF" }}
            dateNameStyle={{ color: "#FFF" }}
            highlightDateNameStyle={{ color: "#FFF" }}
            highlightDateNumberStyle={{ color: "#FFF" }}
            iconContainer={{ flex: 0.1 }}
          />
        </View>
        <Content contentContainerStyle={theme.layoutDf}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.sharedVehicleContainer}>
              <View style={styles.sharedVehicleContent}>
                <View style={styles.formRow}>
                  <TextInput
                    placeholder="Pickup From"
                    placeholderTextColor="rgba(89, 73, 158, 0.5)"
                    style={styles.formInput}
                  />
                  <Icon
                    name="location-pin"
                    type="Entypo"
                    style={[theme.SIZE_20, theme.DARKBLUE]}
                  />
                </View>
                <View style={styles.formRow}>
                  <TextInput
                    placeholder="Drop at"
                    placeholderTextColor="rgba(89, 73, 158, 0.5)"
                    style={styles.formInput}
                  />
                  <Icon
                    name="location-pin"
                    type="Entypo"
                    style={[theme.SIZE_20, theme.DARKBLUE]}
                  />
                </View>
                <View style={[styles.formRow, styles.formRow2]}>
                  <TextInput
                    placeholder="Pickup Time"
                    placeholderTextColor="rgba(89, 73, 158, 0.5)"
                    style={styles.formInput}
                  />
                  <Icon
                    name="clock"
                    type="Feather"
                    style={[theme.SIZE_20, theme.DARKBLUE]}
                  />
                </View>
              </View>
              <View style={styles.formRow}>
  <TextInput
    placeholder="Enter your Load Details"
    placeholderTextColor="rgba(89, 73, 158, 0.5)"
    style={styles.formInput}
  />
  <Text style={styles.formText}>Kgs</Text>
</View>
<View style={styles.sharedVehicleContent2}>
  <View>
    <Text style={styles.vehicleTitle}>Package Details</Text>
  </View>
  <View style={styles.vehicleItem}>
    <Text style={styles.vehicleText}>DIMENSION</Text>
    <Text style={styles.vehicleText}>QUALITY</Text>
  </View>
  <View style={styles.vehicleItem}>
    <Text style={styles.vehicleItemText}>7.2 ft X 4/2 Ft X 1 Ft</Text>
    <Text style={styles.vehicleItemText}>20 Nos</Text>
  </View>
  <View style={styles.vehicleItem}>
    <Text style={styles.vehicleItemText}>4.2 ft X 2/1 Ft X 1 Ft</Text>
    <Text style={styles.vehicleItemText}>10 Nos</Text>
  </View>
  <View style={styles.vehicleItem}>
    <Text style={styles.costText}>TOTAL PACKAGES</Text>
    <Text style={styles.costText}>30 Nos</Text>
  </View>
  <Button
    style={styles.addBtn}
    onPress={() => this.refs.modalPackage.open()}
  >
    <Icon
      name="plus"
      type="AntDesign"
      style={[theme.SIZE_20, theme.light]}
    />
    <Text style={styles.addBtnText}>ADD PACKAGE</Text>
  </Button>
</View>
<View style={styles.accordionLayout}>
  <Accordion
    title="Select Material Type"
    renderContent={() => (
      <View style={styles.accOrderInfo}>
        <Button>
          <Text style={styles.accText}>Dump truck</Text>
        </Button>
        <Button>
          <Text style={styles.accText}>Garbage truck</Text>
        </Button>
        <Button>
          <Text style={styles.accText}>Log carrier</Text>
        </Button>
        <Button>
          <Text style={styles.accText}>Refrigerator truck</Text>
        </Button>
        <Button>
          <Text style={styles.accText}>Tank truck</Text>
        </Button>
        <Button>
          <Text style={styles.accText}>Concrete transport truck (cement mixer)</Text>
        </Button>
      </View>
    )}
  />
  <Accordion
    title="Select Delivery Floor"
    renderContent={() => (
      <View style={styles.accOrderInfo}>
        <Button>
          <Text style={styles.accText}>Dump truck</Text>
        </Button>
        <Button>
          <Text style={styles.accText}>Garbage truck</Text>
        </Button>
        <Button>
          <Text style={styles.accText}>Log carrier</Text>
        </Button>
        <Button>
          <Text style={styles.accText}>Refrigerator truck</Text>
        </Button>
        <Button>
          <Text style={styles.accText}>Tank truck</Text>
        </Button>
        <Button>
          <Text style={styles.accText}>Concrete transport truck (cement mixer)</Text>
        </Button>
      </View>
    )}
  />
</View>
<View style={styles.switchInfo}>
  <Text style={styles.switchText}>Unloading Manpower</Text>
  <ToggleSwitch />
</View>
<View style={styles.totalInfo}>
  <Text style={styles.totalInfoText}>Total Payable $1200</Text>
</View>
            </View>
          </ScrollView>
        </Content>
        <Modal
  ref={"modalPackage"}
  position={"center"}
  isOpen={this.state.isOpen}
  onClosed={() =>
    this.setState({
      isOpen: false,
    })
  }
  isDisabled={this.state.isDisabled}
  style={styles.modalPackage}
>
  <View>
    <Image
      source={require("../../../assets/images/package.png")}
      style={styles.mPackageImg}
    />
  </View>
  <View style={styles.mPackageHeader}>
    <Text style={styles.mPackageHeaderTitle}>Package</Text>
    <Text style={styles.mPackageHeaderText}>
      Checkout Your Package
      {"\n"}informations
    </Text>
  </View>
  <View style={styles.mPackageInfo}>
    <Text style={styles.mPackageTitle}>DIMENSION</Text>
    <Text style={styles.mPackageText}>QUANTITY</Text>
  </View>
  <View style={styles.mPackageInfo}>
    <Text style={styles.mPackageTitle}>7.2 ft x 4/2 ft x 1ft</Text>
    <Text style={styles.mPackageText}>20 Nos</Text>
  </View>
  <View style={styles.mPackageInfo}>
    <Text style={styles.mPackageTitle}>41 ft x 4/2 ft x 2ft</Text>
    <Text style={styles.mPackageText}>10 Nos</Text>
  </View>
  <View style={styles.mTotalInfo}>
    <Text style={styles.mTotalText}>TOTAL PACKAGES</Text>
    <Text style={styles.mTotalText}>30 Nos</Text>
  </View>
</Modal>
<Button
  style={styles.bookingBtn}
  onPress={() => {
    navigate("CustomerBookingConfirm");
  }}
>
  <Text style={styles.bookingBtnText}>BOOK NOW</Text>
</Button>

      </Container>
    );
  }
}
