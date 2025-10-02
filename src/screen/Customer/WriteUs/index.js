import React from "react";
import { View, ScrollView } from "react-native";
import { Container, Content, Text, Icon } from "../../../component/Basic";
import { TextInput, Button, Picker } from "../../../component/Form";

import styles from "./styles";
import theme from "../../../theme/styles";

import Header from "../../../component/Header";
import Support from "../../../component/Support";
import { DarkStatusBar } from "../../../component/StatusBar";
import { navigateReset } from "../../../navigations";

export default function WriteUs (){
 const book=[{ label: "Order Tracking", value: 0 }];

  async function onSubmit() {
    await Support.showLoading();
    try {
     

      await Support.showSuccess({
        title: "Thank you !",
        message:"Your Message can be send successfully",
        onHide: () => {
          navigateReset("");
        },
        hideDelay: 2500,
      });
    } catch (e) {
      await Support.showServerError(e);
    }
    await Support.hideLoading();
  }

 
    return (
      <Container>
        <DarkStatusBar />
        <Header leftType="back" />
        <View style={styles.writeUsHeader}>
          <Text style={styles.writeUsHeaderTitle}>WRITE US</Text>
          <Text style={styles.writeUsHeaderText}>
            MAIL YOUR REQUIREMENTS TO US
          </Text>
        </View>
        <Content contentContainerStyle={theme.layoutDf}>
          <View style={styles.writeUsContainer}>
            <View style={styles.writeUsInfo}>
              <Text style={styles.writeUsTitle}>BOOKING ID</Text>
              <View style={styles.picker}>
                <Picker items={book}  />
                {/* onChange={this.onChangeValue} */}
              </View>
            </View>
            <View style={styles.formRow}>
              <Text style={styles.formText}>COMMENTS</Text>
              <TextInput
                placeholder=""
                placeholderTextColor="#ccc"
                multiline
                numberOfLines={7}
                textAlignVertical={"top"}
                // placeholder='Please write your comments'
                // onChangeText={(v) => this.onChangeText("comment", v)}
                style={styles.formInput}
              />
            </View>
            <Button style={styles.sendBtn} onPress={onSubmit}>
              <Text style={styles.sendBtnText}>SEND</Text>
            </Button>
          </View>
        </Content>
      </Container>
    );
  }

