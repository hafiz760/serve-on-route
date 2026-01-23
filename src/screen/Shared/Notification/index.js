import React, { useState } from "react";
import { View, ScrollView } from "react-native";
import { Container, Content } from "../../../component/Basic";
import NotificationList from "./Notifications";
import styles from "./styles";
import theme from "../../../theme/styles";
import Header from "../../../component/Header";
import { DarkStatusBar } from "../../../component/StatusBar";
import { COLOR } from "../../../theme/typography";
import AppSpinner from "../../../component/AppSpinner";

/**
 * Shared Notification Screen
 * @param {Object} props
 * @param {string} props.userRole - 'customer' or 'driver'
 */
export default function Notification({ userRole = 'customer' }) {
  const [loading, setLoading] = useState(true);

  const showLoading = (val) => {
    setLoading(val);
  };

  return (
    <Container>
      <DarkStatusBar />
      <Header leftType="back" title={"Notifications"} />

      {loading && (
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

      <Content style={[theme.layout, loading ? { display: "none" } : {}]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.notificationContainer}>
            <NotificationList
              showLoading={showLoading}
              loading={loading}
              userRole={userRole}
            />
          </View>
        </ScrollView>
      </Content>
    </Container>
  );
}
