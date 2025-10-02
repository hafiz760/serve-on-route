import React, { useState } from 'react';
import { View } from 'react-native';
import { DarkStatusBar } from "../../../component/StatusBar";
import Header from "../../../component/Header";
import { Container, Text, Icon } from "../../../component/Basic";
import styles from './styles';
export default function Index() {
    return (
        <Container>
            <DarkStatusBar />
            <Header leftType="back" title={"Settings"} />

            <View style={styles.main}>
                <View style={styles.first}>
                    <Icon
                        name="key-variant"
                        type="MaterialCommunityIcons"
                    // style={[theme.SIZE_14, theme.LIGHT]}
                    />
                    <Text style={styles.text}>Change Password</Text>
                </View>

                <View style={styles.first}>
                    <Icon
                        name="lock-check"
                        type="MaterialCommunityIcons"
                    />
                    <Text style={styles.text}>Privacy Policy</Text>
                </View>

                <View style={styles.first}>
                    <Icon
                        name="note-text"
                        type="MaterialCommunityIcons"

                    />
                    <Text style={styles.text}>Terms and Conditions</Text>
                </View>

                <View style={styles.first}>
                    <Icon
                        name="logout"
                        type="MaterialCommunityIcons"
                    />
                    <Text style={styles.text}>Logout</Text>
                </View>

                <View style={styles.first}>
                    <Icon

                        name="delete"
                        type="MaterialCommunityIcons"
                    />
                    <Text style={styles.text}>Delete Account</Text>
                </View>
            </View>
        </Container>
    );
}
