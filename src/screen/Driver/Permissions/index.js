import React from "react";
import { View, ScrollView } from "react-native";

import { Container, Content, Text, Icon } from "../../../component/Basic";
import { TextInput, Button ,ToggleSwitch} from "../../../component/Form";
import styles from "./styles";
import theme from "../../../theme/styles";

import Header from "../../../component/Header";
import { DarkStatusBar } from "../../../component/StatusBar";
import { useEffect, useState } from "react";
export default function Permission() {
  const [accessMessage, setAccessMessage] = useState(false);
  const [mediaStorage, setMediaStorage] = useState(false);
  const [location, setLocation] = useState(false);
 
  return (
    <Container>
      <DarkStatusBar />
      <Header leftType="back" />
      <View style={styles.settlementHeader}>
        <Text style={styles.settlementHeaderTitle}>
          PERMISSIONS
        </Text>
        <Text style={styles.settlementHeaderText}>
        Permissions
        </Text>
      </View>
      <Content contentContainerStyle={theme.layoutDf}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.settlementContainer}>
          <View style={styles.profileInputDetail}>
            <Text style={styles.permissionText}>MESSAGE</Text>
            <View style={styles.switchInfo}>
              <Text style={styles.switchText}>Access your message</Text>
              <ToggleSwitch 
               setValue={setAccessMessage}
               value={accessMessage}
              />

            </View>
          </View>
          <View style={styles.profileInputDetail}>
            <Text style={styles.permissionText}>MEDIA & STORAGE</Text>
            <View style={styles.switchInfo}>
              <Text style={styles.switchText}>
              Access your Media & Storage
              </Text>
              <ToggleSwitch 
               setValue={setMediaStorage}
               value={mediaStorage}
              />
            </View>
          </View>
           <View style={styles.profileInputDetail}>
            <Text style={styles.permissionText}>LOCATION</Text>
            <View style={styles.switchInfo}>
              <Text style={styles.switchText}>
              Access your location
              </Text>
              <ToggleSwitch 
               setValue={setLocation}
               value={location}
              />
            </View>
          </View>

          <Button
            style={styles.saveBtn}
            onPress={() => {
              navigate("CustomerSelectVehicle");
            }}
          >
            <Text style={styles.saveBtnText}>SAVE</Text>
          </Button>
          </View>
        </ScrollView>
      </Content>
    </Container>
  );
}
