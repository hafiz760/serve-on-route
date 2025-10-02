import React from "react";
import { View, ScrollView } from "react-native";
import { Container, Content, Text, Icon } from "../../../component/Basic";
import Notifications from "./Notifications";

import styles from "./styles";
import theme from "../../../theme/styles";
import Header from "../../../component/Header";
import { DarkStatusBar } from "../../../component/StatusBar";
import { COLOR } from "../../../theme/typography";
import AppSpinner from "../../../component/AppSpinner";

export default class extends React.Component {
  state = {
    loading: true,
  };
  showLoading = (val) => {
    this.setState({ loading: val });
  };
  render() {
    return (
      <Container >
        <DarkStatusBar />

        <Header leftType="back" title={"Notifications"} rightType="Icon" 
        // Icon=name="upload",type="AntDesign",style={[theme.SIZE_24, theme.DARKBLUE]}
        />
        {this.state.loading && (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              // marginTop: 100
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
              <Notifications
                showLoading={this.showLoading}
                loading={this.state.loading}
              />
            </View>
          </ScrollView>
        </Content>
      </Container>
    );
  }
}


