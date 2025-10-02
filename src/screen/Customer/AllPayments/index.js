import React from "react";
import { View, ScrollView } from "react-native";
import { Container, Content, Text, Icon } from "../../../component/Basic";
import { Button } from "../../../component/Form";
import Notifications from "./Notifications";

import styles from "./styles";
import theme from "../../../theme/styles";
import Header from "../../../component/Header";
import { DarkStatusBar } from "../../../component/StatusBar";
import AppSpinner from "../../../component/AppSpinner";
import { COLOR } from "../../../theme/typography";
import { navigate } from "../../../navigations";

export default class extends React.Component {
  state = {
    loading: true,
  };

  showLoading = (val) => {
    this.setState({ loading: val });
  };

  render() {
    return (
      <Container style={theme.layout}>
        <DarkStatusBar />
        <Header leftType="back" title="PAYMENTS" />

        {this.state.loading && (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <AppSpinner size="large" color={COLOR.PRIMARY} />
          </View>
        )}
        <Content
          style={[theme.layout, this.state.loading ? { display: "none" } : {}]}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.notificationContainer}>
              <View style={styles.notificationHeaderView}>
                <Text style={styles.notificationHeaderText}>
                  Manage Payment Methods
                </Text>
              </View>

              <Notifications
                showLoading={this.showLoading}
                loading={this.state.loading}
              />
            </View>
          </ScrollView>
          <View style={styles.myTripHeader}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Button
                style={styles.yesBtn}
                onPress={() => {
                  navigate("CustomerPayment");
                }}
              >
                <Text style={styles.yesBtnText}>ADD ACCOUNT</Text>
              </Button>
            </View>
          </View>
        </Content>
      </Container>
    );
  }
}
